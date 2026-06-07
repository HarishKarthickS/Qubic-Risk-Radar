from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "Qubic Risk Radar"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    BACKEND_URL: str = "http://localhost:8000"
    
    DATABASE_URL: str = "postgresql+asyncpg://qubic_radar:password@localhost:5432/qubic_radar_db"
    
    REDIS_URL: str = "redis://localhost:6379/0"
    
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str = "Qubic Risk Radar"
    
    WEBHOOK_SECRET: str = "change_me_in_production"
    
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    DISCORD_WEBHOOK_URL_CRITICAL: str = ""
    DISCORD_WEBHOOK_URL_WARNING: str = ""
    DISCORD_WEBHOOK_URL_INFO: str = ""
    
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""
    
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "noreply@qubicradar.io"
    
    DISCORD_BOT_TOKEN: str = ""
    
    NOTIFICATION_RETRY_MAX: int = 3
    NOTIFICATION_RETRY_DELAY: int = 1
    NOTIFICATION_TIMEOUT: int = 10
    
    RULE_EVALUATION_ENABLED: bool = True
    DEDUPLICATION_ENABLED: bool = True
    
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60
    
    ENABLE_AI_DETECTION: bool = True
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-pro"
    AI_CONFIDENCE_THRESHOLD: float = 0.7
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
