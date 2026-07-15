# Qubic Risk Radar

Qubic Risk Radar is a monitoring and alerting platform for the Qubic blockchain network. It
ingests on-chain events through webhooks, evaluates them against a configurable rule engine,
and dispatches alerts to Discord, Telegram, and email. Optional anomaly detection with Google
Gemini can run on top of the rule engine.

Live: https://qubic-risk-radar.vercel.app

## Features

- Event ingestion via EasyConnect webhooks, verified with a shared secret
- Rule engine for user-defined threat and threshold detection, with deduplication
- Incident tracking and analytics/metrics endpoints
- Multi-channel alerting: Discord (severity-based webhooks), Telegram, and email (SMTP/SendGrid)
- Optional AI anomaly detection using Google Gemini, gated by a confidence threshold
- JWT authentication with an onboarding flow
- Configurable rate limiting and notification retries

## Architecture

- **Backend** — FastAPI (async) with SQLAlchemy 2.0 over PostgreSQL (asyncpg), Alembic
  migrations, and Redis. Structured logging via structlog. Alerts are delivered through
  Discord webhooks / `discord.py`, Telegram, and SMTP or SendGrid. Gemini is only called when
  AI detection is enabled.
- **Frontend** — React + Vite + TypeScript dashboard (React Router, Axios).
- **Runtime** — the API and the built frontend run in a single image under supervisord;
  PostgreSQL and Redis run as separate services (see `docker-compose.yml`).

## Tech stack

**Backend:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy (asyncpg), Alembic, Redis,
Pydantic v2 / pydantic-settings, python-jose + passlib (JWT/bcrypt), httpx, discord.py,
google-generativeai, structlog, pytest

**Frontend:** React 18, Vite 5, TypeScript, React Router, Axios, lucide-react

**Infra:** Docker, docker-compose, supervisord, Render

## Project structure

```
backend/
  app/
    main.py            FastAPI app + router registration
    config.py          Settings (pydantic-settings)
    database.py        Async engine/session
    api/               Routers: auth, webhooks, webhooks_management, events, incidents,
                       rules, detections, metrics, analytics, onboarding
    models/            user, event, incident, alert, rule, monitored_target,
                       easyconnect_config, ai_detection, plan
  alembic/versions/    001_initial, 002_add_auth, 003_add_onboarding, 004_ai_detection
frontend/              React + Vite dashboard
docker-compose.yml     Postgres, Redis, and the app image
```

## Getting started

### With Docker (recommended)

```bash
cp .env.example .env    # set JWT_SECRET, WEBHOOK_SECRET, DB/Redis, and alert credentials
docker compose up --build
```

The API is exposed on `http://localhost:8000` and the frontend on `http://localhost:3000`.

### Manual

Backend:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (asyncpg) |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Signing secret for auth tokens |
| `WEBHOOK_SECRET` | Verifies incoming EasyConnect webhooks |
| `ENABLE_AI_DETECTION` | Toggle Gemini anomaly detection (`true`/`false`) |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Required when AI detection is enabled |
| `DISCORD_WEBHOOK_URL_*` / `DISCORD_BOT_TOKEN` | Discord alerts |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Telegram alerts |
| `SMTP_*` / `SENDGRID_API_KEY` | Email alerts |
| `RATE_LIMIT_*`, `NOTIFICATION_RETRY_*` | Rate limiting and retry behavior |

See `.env.example` for the full list and defaults.

## Database migrations

Migrations are managed with Alembic:

```bash
alembic upgrade head                                  # apply
alembic revision --autogenerate -m "your message"     # create a new one
```

## Testing

```bash
cd backend
pytest
```

## Deployment

Configured for Render via `render.yaml` and `render-build.sh`. The container runs the API and
the static frontend under supervisord, so any Docker host works with `docker-compose` as well.

## License

MIT
