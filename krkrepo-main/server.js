require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ─── Config ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || "your_email@chitkara.edu.in";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    is_success: false,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Return the first n Fibonacci numbers (starting from 0). */
function fibonacci(n) {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("fibonacci input must be a positive integer.");
  }
  if (n > 1000) {
    throw new Error("fibonacci input must not exceed 1000.");
  }
  const series = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) series.push(0);
    else if (i === 1) series.push(1);
    else series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

/** Check if a number is prime. */
function isPrime(num) {
  if (!Number.isInteger(num) || num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

/** Filter prime numbers from an array. */
function filterPrimes(arr) {
  return arr.filter(isPrime);
}

/** GCD of two numbers. */
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** LCM of two numbers. */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/** HCF (GCD) of an integer array. */
function computeHCF(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

/** LCM of an integer array. */
function computeLCM(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

/** Validate that value is a non-empty array of integers. */
function validateIntArray(arr, fieldName) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`${fieldName} must be a non-empty array of integers.`);
  }
  if (arr.length > 1000) {
    throw new Error(`${fieldName} array must not exceed 1000 elements.`);
  }
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "number" || !Number.isInteger(arr[i])) {
      throw new Error(`${fieldName}[${i}] must be an integer.`);
    }
    if (Math.abs(arr[i]) > 1e12) {
      throw new Error(`${fieldName}[${i}] value is too large.`);
    }
  }
}

/** Call Google Gemini to get a single-word answer. */
async function askAI(question) {
  if (!GEMINI_API_KEY) {
    throw new Error("AI service is not configured.");
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Answer the following question in a single word only. Do not add punctuation, explanation, or extra words.\n\nQuestion: ${question}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
  return text || "Unknown";
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /health
app.get("/health", (_req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        is_success: false,
        error: "Request body must be a JSON object.",
      });
    }

    // Determine which valid keys are present
    const validKeys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
    const presentKeys = validKeys.filter(
      (k) => body[k] !== undefined && body[k] !== null
    );

    if (presentKeys.length === 0) {
      return res.status(400).json({
        is_success: false,
        error:
          "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI.",
      });
    }

    if (presentKeys.length > 1) {
      return res.status(400).json({
        is_success: false,
        error:
          "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI.",
      });
    }

    const key = presentKeys[0];
    let data;

    switch (key) {
      // ── fibonacci ──────────────────────────────────────────────────────
      case "fibonacci": {
        const n = body.fibonacci;
        if (typeof n !== "number" || !Number.isInteger(n) || n < 1) {
          return res.status(400).json({
            is_success: false,
            error: "fibonacci must be a positive integer.",
          });
        }
        data = fibonacci(n);
        break;
      }

      // ── prime ──────────────────────────────────────────────────────────
      case "prime": {
        const arr = body.prime;
        validateIntArray(arr, "prime");
        data = filterPrimes(arr);
        break;
      }

      // ── lcm ────────────────────────────────────────────────────────────
      case "lcm": {
        const arr = body.lcm;
        validateIntArray(arr, "lcm");
        if (arr.length < 2) {
          return res.status(400).json({
            is_success: false,
            error: "lcm requires at least 2 integers.",
          });
        }
        data = computeLCM(arr);
        break;
      }

      // ── hcf ────────────────────────────────────────────────────────────
      case "hcf": {
        const arr = body.hcf;
        validateIntArray(arr, "hcf");
        if (arr.length < 2) {
          return res.status(400).json({
            is_success: false,
            error: "hcf requires at least 2 integers.",
          });
        }
        data = computeHCF(arr);
        break;
      }

      // ── AI ─────────────────────────────────────────────────────────────
      case "AI": {
        const question = body.AI;
        if (typeof question !== "string" || question.trim().length === 0) {
          return res.status(400).json({
            is_success: false,
            error: "AI must be a non-empty string.",
          });
        }
        if (question.length > 2000) {
          return res.status(400).json({
            is_success: false,
            error: "AI question must not exceed 2000 characters.",
          });
        }
        try {
          data = await askAI(question.trim());
        } catch (aiErr) {
          console.error("AI error:", aiErr.message);
          return res.status(500).json({
            is_success: false,
            error: "AI service error.",
          });
        }
        break;
      }

      default:
        return res.status(400).json({
          is_success: false,
          error:
            "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI.",
        });
    }

    return res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data,
    });
  } catch (err) {
    console.error("Unhandled error in POST /bfhl:", err.message);
    return res.status(400).json({
      is_success: false,
      error: err.message || "Invalid request.",
    });
  }
});

// ─── Catch-all for undefined routes ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    is_success: false,
    error: "Route not found.",
  });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Global error:", err);
  res.status(500).json({
    is_success: false,
    error: "Internal server error.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`BFHL API running on http://localhost:${PORT}`);
});
