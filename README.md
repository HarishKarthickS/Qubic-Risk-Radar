# Qubic Risk Radar

Production-grade blockchain monitoring and alerting platform for the Qubic network.

## Features
- Real-time event ingestion via EasyConnect webhooks.
- Advanced rule engine for custom threat detection.
- Multi-channel alerts (Discord, Telegram, Email).
- Optional AI-powered anomaly detection using Google Gemini.
- Comprehensive analytics and reporting.
- Fully customizable via environment variables.

## Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL
- Redis
- Node.js (for frontend)

### Installation
1. Clone the repository.
2. Copy `.env.example` to `.env` and configure your settings.
3. Run `pip install -r backend/requirements.txt`.
4. Run `npm install` in the frontend directory.

### Configuration
Key environment variables:
- `ENABLE_AI_DETECTION`: Toggle AI features (true/false).
- `GEMINI_API_KEY`: Required for AI detection.
- `DATABASE_URL`: Connection string for PostgreSQL.
- `WEBHOOK_SECRET`: Used to verify incoming webhooks.

## Documentation
See the `docs` directory for more details (coming soon).

## License
MIT
