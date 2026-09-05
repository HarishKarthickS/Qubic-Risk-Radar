# Deploy: Docker and Render

Local Docker and Render hosting for Qubic Risk Radar. The API and built dashboard share one image (supervisord + nginx). PostgreSQL and Redis are separate services.

## Local Docker

```bash
cp .env.example .env   # set JWT_SECRET, WEBHOOK_SECRET, POSTGRES_PASSWORD, and optional alert/AI keys
docker compose up --build
```

Windows: `start.bat`. Linux/macOS: `chmod +x start.sh && ./start.sh` (creates `.env` from the example if missing, then compose up).

After start:

- Dashboard: http://localhost:3000
- API: http://localhost:8000
- OpenAPI: http://localhost:8000/docs

Useful commands:

```bash
docker compose logs -f
docker compose down          # stop
docker compose down -v       # stop and drop volumes
docker exec -it qrr-postgres pg_dump -U qubic_radar qubic_radar_db > backup.sql
```

Port conflicts: change host mappings in `docker-compose.yml` (`8000` / `3000` / `5432` / `6379`).

The root `Dockerfile` builds frontend + backend. Older per-service Dockerfiles under `backend/` are unused by the current compose file.

## Render

Blueprint: `render.yaml` (web service + PostgreSQL + Redis).

1. Push this repo to GitHub.
2. In the [Render dashboard](https://dashboard.render.com): **New** → **Blueprint** → connect the repo (`main`).
3. Set secrets that are `sync: false` in `render.yaml`: `WEBHOOK_SECRET`, SMTP, Discord/Telegram, `GEMINI_API_KEY` if you use AI detection.
4. Wait for the first deploy. Health check path is `/health`.

Manual equivalent: create PostgreSQL and Redis, then a Docker web service with context `.` and `Dockerfile` at the repo root. Point `DATABASE_URL` and `REDIS_URL` at the internal Render URLs. Set `CORS_ORIGINS` / `FRONTEND_URL` / `BACKEND_URL` to the actual service hostname (not a placeholder).

Free-tier notes: the web service sleeps after inactivity (cold start ~30–60s). Free Postgres and Redis on Render expire; treat them as trial, not production.

Logs: Render **Logs** tab. Inside the container, supervisor writes `/var/log/supervisor/backend.out.log` and `nginx.out.log`.

## Environment

Minimum: `POSTGRES_PASSWORD`, `JWT_SECRET` (32+ chars), `WEBHOOK_SECRET`. Full list: `.env.example`.
