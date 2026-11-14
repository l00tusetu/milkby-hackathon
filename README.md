# Run and deploy your app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Run Full Stack with Docker Compose (PostgreSQL + FastAPI + Nginx SSR/SPA)

**Prerequisites:** Docker & Docker Compose

1. Optionally copy `.env.example` to `.env` and add `GEMINI_API_KEY` (if omitted, the Smart Product Matcher automatically falls back to deterministic multilingual NLP + PostgreSQL trigram search):
   ```bash
   cp .env.example .env
   ```
2. Build and launch PostgreSQL 16, Alembic migrations, 4-language seed data (30 products across 12 categories + 16 news articles + 24 legacy 301 redirects), FastAPI, and Nginx:
   ```bash
   docker compose up --build
   ```
3. Open:
   - **Web Platform (SSR SEO + React SPA):** http://localhost:8080/ru/
   - **OpenAPI / Swagger UI:** http://localhost:8080/api/docs
   - **Dynamic XML Sitemap:** http://localhost:8080/sitemap.xml
   - **Robots.txt:** http://localhost:8080/robots.txt
   - **CMS Admin Panel:** http://localhost:8080/ru/admin

---

## Run Back-end Locally Without Docker (Dev Mode)

**Prerequisites:** Python 3.12+ & PostgreSQL 16

1. Start PostgreSQL and create database `milkby` (`pg_trgm` extension enabled).
2. Install Python dependencies:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Run migrations & seed database:
   ```bash
   export DATABASE_URL="postgresql+asyncpg://milkby:milkby_secret@localhost:5432/milkby"
   alembic upgrade head
   python -m app.seed
   ```
4. Start FastAPI:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. In another terminal, run `npm run dev` from the repository root (Vite automatically proxies `/api`, `/sitemap.xml`, and `/robots.txt` to `http://localhost:8000`).
