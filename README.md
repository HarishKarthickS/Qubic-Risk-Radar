# Qubic Risk Radar

Monitoring and alerting for the Qubic network. The API ingests EasyConnect webhooks, runs a rule engine (with optional Gemini anomaly scoring), tracks incidents, and can notify Discord, Telegram, or email.

The marketing site at [qubic-risk-radar.vercel.app](https://qubic-risk-radar.vercel.app) is the `landing-page/` Next.js app. The React dashboard in `frontend/` is served with the FastAPI backend from Docker or Render, not from that Vercel project.

## What it does

- Webhook ingestion with a shared secret
- User-defined rules, deduplication, incident list and metrics
- Alerts: Discord webhooks / bot, Telegram, SMTP or SendGrid (only if configured)
- Optional Gemini detection when `ENABLE_AI_DETECTION` is true and `GEMINI_API_KEY` is set
- JWT auth and a short onboarding flow

This is a working MVP, not a hosted SaaS with billed plans. Pricing flags in env are leftovers, not a live billing product.

## Stack

- **Backend:** Python 3.10+, FastAPI, SQLAlchemy 2 (asyncpg), Alembic, Redis, pydantic-settings, pytest
- **Dashboard:** React 18, Vite, TypeScript, React Router, Axios, TanStack Query, lucide-react
- **Landing:** Next.js 14 (`landing-page/`)
- **Run:** Docker Compose (app + Postgres + Redis); Render blueprint in `render.yaml`

## Layout

```
backend/app/     FastAPI routers, models, services
backend/alembic/  migrations
frontend/     Vite dashboard
landing-page/ Vercel marketing site
docker-compose.yml
```

## Local run

Docker (recommended):

```bash
cp .env.example .env
docker compose up --build
```

Dashboard: http://localhost:3000 — API: http://localhost:8000

Without Docker:

```bash
cd backend && pip install -r requirements.txt && alembic upgrade head && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

Config: copy `.env.example`. Required: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `WEBHOOK_SECRET`.

Tests: `cd backend && pytest`. Deploy (Docker + Render): [DEPLOY.md](DEPLOY.md).

## License

MIT
