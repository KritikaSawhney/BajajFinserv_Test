# 🏥 Bajaj Finserv Health – Qualifier 1 REST APIs

Production-ready REST APIs developed for  
**Qualifier 1 | Chitkara University 2026 | Class of 2027**.

The project emphasizes:
- Strict API response structure
- Robust validation
- Security guardrails
- Graceful error handling
- Public deployment
- AI integration

---

## 📅 Submission Details
- **Date:** 10 February 2026
- **Student:** Kritika Sawhney
- **Official Email:** kritika2046.be23@chitkara.edu.in
- **Total Duration:** 120 Minutes

---

## 🎯 Objective
Develop and deploy two public REST APIs:

- **GET /health** → System health check
- **POST /bfhl** → Functional logic endpoint

---

## 🌐 Live Deployment

### Base URL
https://bajajfinserv-test.onrender.com


### APIs
POST https://bajajfinserv-test.onrender.com/bfhl

GET https://bajajfinserv-test.onrender.com/health


---

## ⚙️ POST /bfhl Functional Keys

Each request must contain exactly **one** key.

| Key | Input | Output |
|---|---|---|
| fibonacci | Integer | Fibonacci Series |
| prime | Integer Array | Prime Numbers |
| lcm | Integer Array | LCM Value |
| hcf | Integer Array | HCF Value |
| AI | String | Single-word AI Response |

---

## 📡 Example Requests

### Fibonacci
```json
{ "fibonacci": 7 }

{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": [0,1,1,2,3,5,8]
}


### Prime

{ "prime": [2,4,7,9,11] }
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": [2,7,11]
}

### LCM

{ "lcm": [12,18,24] }

{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": 72
}

### HCF

{ "hcf": [24,36,60] }
{
  "is_success": true,
  "official_email": "kritika2046.be23@chitkara.edu.in",
  "data": 12
}

## 🛠️ Tech Stack
- Node.js  
- Express.js  
- Google Gemini API  
- dotenv  
- Render Deployment  

---

## 🔐 Security & Rate Limiting
To protect the API from abuse, **global rate limiting** is implemented.

- **Limit:** 100 requests per 15 minutes per IP  
- **Scope:** Applied to all routes  

### Rate Limiting Code (Implemented)
```js
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


Rate Limit Response
{
  "is_success": false,
  "error": "Too many requests, please try again later."
}

✅ Validation & Error Handling

Exactly one functional key required

Correct HTTP status codes

Boundary condition checks

Graceful failure (no crashes)

🔑 Environment Variables

Create a .env file in the project root:

PORT=3000
GEMINI_API_KEY=your_api_key

🚀 Run Locally

Clone the repository and start the server:

git clone <repo-url>
npm install
npm start


Server will run on:

http://localhost:3000

🧪 Testing

Postman

Thunder Client (VS Code)

Browser (GET requests)

👩‍💻 Author

Kritika Sawhney
📧 kritika2046.be23@chitkara.edu.in

Chitkara University






