# DebugMind AI — Frontend

Premium AI debugging assistant UI built with Vite + React + TypeScript.

## Tech Stack
- **Vite + React + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **Zustand** — state management (persisted)
- **Axios** — API client
- **Monaco Editor** — code editor
- **Recharts** — analytics charts
- **React Markdown** — formatted AI responses

## Pages
| Route | Description |
|-------|-------------|
| `/login` | Login with email/password |
| `/register` | Create account |
| `/dashboard` | Stats, activity chart, recent analyses |
| `/debug` | **Core workspace** — code editor, error input, AI analysis |
| `/history` | All past debug sessions, expandable cards |
| `/settings` | Preferences, API keys, notifications |

## Getting Started

```bash
# Install deps
npm install

# Configure API URL
cp .env.example .env
# Edit VITE_API_URL to point to your FastAPI backend (default: http://localhost:8000)

# Dev server
npm run dev

# Production build
npm run build
```

## Backend Integration

The frontend connects to your FastAPI backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /auth/register` | POST | Register new user |
| `POST /auth/login` | POST | Login → get JWT |
| `POST /analyze-error` | POST | `{ code, error_message }` → AI debug response |

Make sure your FastAPI backend is running with CORS enabled for `http://localhost:5173`.

Add to `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
