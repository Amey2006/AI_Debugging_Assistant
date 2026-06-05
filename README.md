# AI_Debugging_Assistant
# DebugMind AI — Intelligent AI Debugging Assistant

> An AI-powered debugging platform that analyzes code errors, explains root causes, suggests fixes, and helps developers learn from mistakes.

---

# 🚀 Project Overview

DebugMind AI is an intelligent debugging assistant built for developers and students.
Instead of showing confusing compiler/runtime errors, the platform:

* Detects and classifies errors
* Explains errors in simple language
* Suggests AI-generated fixes
* Gives learning-focused debugging guidance
* Tracks debugging history
* Supports multiple programming languages

The goal is not just fixing code — but teaching developers *why* the error happened.

---

# ✨ Features

## ✅ AI Error Analysis

* Detects:

  * Syntax errors
  * Import/module errors
  * Async misuse
  * Type errors
  * Indentation issues
  * Runtime exceptions

---

## ✅ Intelligent Explanations

Converts technical stack traces into beginner-friendly explanations.

Example:

### Input

```python
ModuleNotFoundError: No module named 'requests'
```

### Output

```text
Python cannot find the 'requests' package because it is not installed in your environment.
Install it using:

pip install requests
```

---

## ✅ AI Fix Suggestions

Uses LLMs to:

* suggest fixes
* explain best practices
* provide corrected code snippets

---

## ✅ Error Classification Engine

Custom backend engine that:

* parses stack traces
* categorizes errors
* identifies probable root causes

---

## ✅ Authentication System

* JWT Authentication
* Login/Register APIs
* Protected routes

---

## ✅ Modern Frontend

Built with:

* React
* Vite
* Tailwind CSS

Features:

* code input area
* stack trace viewer
* AI response cards
* clean developer dashboard

---

## ✅ Debugging History

Users can:

* store previous debugging sessions
* revisit solutions
* learn from past mistakes

---

# 🏗️ System Architecture

```text
                ┌──────────────────┐
                │   React Frontend │
                └────────┬─────────┘
                         │ HTTP API
                         ▼
                ┌──────────────────┐
                │   FastAPI Server │
                └────────┬─────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│ Auth Module │  │ Error Parser │  │ AI Service  │
└─────────────┘  └──────────────┘  └─────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Rule Engine      │
                │ + Classification │
                └──────────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ PostgreSQL DB    │
                └──────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios

---

## Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* PostgreSQL

---

## AI / NLP

* OpenAI API / Gemini API
* Prompt Engineering
* Error Classification Logic

---

# 📂 Project Structure

```bash
debugmind-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── analyzers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── core/
│   │   ├── db/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

# 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/debugmind-ai.git

cd debugmind-ai
```

---

# 2️⃣ Backend Setup

## Create Virtual Environment

```bash
cd backend

python -m venv venv
```

---

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Setup Environment Variables

Create `.env`

```env
DATABASE_URL=postgresql://username:password@localhost/debugmind
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

OPENAI_API_KEY=your_api_key
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# 3️⃣ Frontend Setup

```bash
cd frontend

npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Auth APIs

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

---

## Error Analysis APIs

### Analyze Error

```http
POST /analyze-error
```

### Request Body

```json
{
  "language": "python",
  "code": "import requests",
  "error": "ModuleNotFoundError: No module named 'requests'"
}
```

---

## Example Response

```json
{
  "error_type": "ImportError",
  "category": "dependency",
  "ai_response": "The requests package is not installed. Run pip install requests."
}
```

---

# 🧠 Error Analysis Flow

```text
User submits code + error
           │
           ▼
Stack trace parser
           │
           ▼
Error classification engine
           │
           ▼
Rule engine matching
           │
           ▼
AI explanation generator
           │
           ▼
Formatted debugging response
```

---

# 🔐 Authentication Flow

```text
Register/Login
      │
      ▼
JWT Token Generated
      │
      ▼
Frontend stores token
      │
      ▼
Protected API Requests
```

---

# 📌 Future Improvements

* Multi-language support
* VS Code extension
* Real-time debugging
* AI chat assistant
* Code execution sandbox
* Docker deployment
* GitHub integration
* Voice-based debugging
* Team collaboration dashboard

---

# 🧪 Sample Supported Errors

| Error Type        | Example                |
| ----------------- | ---------------------- |
| Syntax Error      | Missing brackets       |
| Import Error      | Module not installed   |
| Indentation Error | Wrong spacing          |
| Async Error       | Missing await          |
| Type Error        | Invalid type operation |
| Runtime Error     | Division by zero       |

---

# 🎯 Learning Goals of This Project

This project helps learn:

* FastAPI backend architecture
* JWT authentication
* PostgreSQL integration
* AI API integration
* Prompt engineering
* Error parsing
* AST basics
* React frontend architecture
* Full-stack development

---

# 🤝 Contribution

Contributions are welcome.

Steps:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

---

# 📜 License

----

---

# 👨‍💻 Author

Developed by Amey Mohite 

---

# ⭐ Final Vision

DebugMind AI aims to become:

> “The Grammarly for programming errors.”

A platform where developers not only fix bugs faster but also become better programmers through AI-guided learning.

