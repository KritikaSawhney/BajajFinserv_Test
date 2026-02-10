# 🏥 Bajaj Finserv Health – Qualifier 1 REST APIs

Production‑ready REST APIs developed for **Qualifier 1 | Chitkara University 2026 | Class of 2027**.

This project focuses on:

* Strict API response structure
* Robust input validation
* Security guardrails
* Graceful error handling
* Public deployment
* AI integration

---

## 📅 Submission Details

* **Submission Date:** 10 February 2026
* **Student Name:** Kritika Sawhney
* **Official Email:** [kritika2046.be23@chitkara.edu.in](mailto:kritika2046.be23@chitkara.edu.in)
* **Total Duration:** 120 Minutes

---

## 🎯 Objective

To develop and deploy **two public REST APIs** with proper validation, security, and deployment:

* **GET /health** → System health check endpoint
* **POST /bfhl** → Functional logic processing endpoint

---

## 🌐 Live Deployment

### Base URL

```
https://bajajfinserv-test.onrender.com
```

### Available APIs

* **POST** `/bfhl`
  `https://bajajfinserv-test.onrender.com/bfhl`

* **GET** `/health`
  `https://bajajfinserv-test.onrender.com/health`

---

## ⚙️ POST /bfhl – Functional Keys

Each request body must contain **exactly one** functional key.

| Key         | Input Type    | Output                            |
| ----------- | ------------- | --------------------------------- |
| `fibonacci` | Integer       | Fibonacci series up to N terms    |
| `prime`     | Integer Array | Filtered prime numbers            |
| `lcm`       | Integer Array | LCM of numbers                    |
| `hcf`       | Integer Array | HCF (GCD) of numbers              |
| `AI`        | String        | Single‑word AI‑generated response |

---

## 📡 Example Requests & Responses

### Fibonacci

**Request**

```json
{ "fibonacci": 7 }
```

**Response**

```json
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": [0, 1, 1, 2, 3, 5, 8]
}
```

---

### Prime Numbers

**Request**

```json
{ "prime": [2, 4, 7, 9, 11] }
```

**Response**

```json
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": [2, 7, 11]
}
```

---

### LCM

**Request**

```json
{ "lcm": [12, 18, 24] }
```

**Response**

```json
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": 72
}
```

---

### HCF

**Request**

```json
{ "hcf": [24, 36, 60] }
```

**Response**

```json
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": 12
}
```

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Google Gemini API
* dotenv
* Render (Deployment)

---

## 🔐 Security & Rate Limiting

To protect the API from abuse, **global rate limiting** is implemented across all routes.

* **Limit:** 100 requests per 15 minutes per IP
* **Scope:** Applied to all endpoints

### Rate Limiting Implementation

```js
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
```

### Rate Limit Error Response

```json
{
  "is_success": false,
  "error": "Too many requests, please try again later."
}
```

---

## ✅ Validation & Error Handling

* Exactly **one functional key** allowed per request
* Proper HTTP status codes used
* Boundary condition checks implemented
* Graceful error handling (no server crashes)

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
GEMINI_API_KEY=your_api_key
```

---

## 🚀 Run Locally

Clone the repository and start the server:

```
git clone <repo-url>
npm install
npm start
```

The server will start at:

```
http://localhost:3000
```

---

## 🧪 Testing Tools

* Postman
* Thunder Client (VS Code)
* Browser (for GET endpoints)

---

## 👩‍💻 Author

**Kritika Sawhney**
📧 [kritika2046.be23@chitkara.edu.in](mailto:kritika2046.be23@chitkara.edu.in)

**Chitkara University**
