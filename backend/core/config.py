import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    API_VERSION: str = "v1"
    SECRET_KEY: str = "fitaix_premium_super_secure_key_2026_change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/fitaix_db?schema=public"
    REDIS_URL: str = "redis://localhost:6379/0"
    CLOUDINARY_URL: str = "cloudinary://api_key:api_secret@cloud_name"

    model_config = ConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        extra="ignore"
    )

settings = Settings()
