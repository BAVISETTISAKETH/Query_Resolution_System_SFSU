import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    # Basic settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "University Query Resolution System"
    
    # CORS - allow frontend origins
    CORS_ORIGINS: str = ""
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env"
    )
    
    def get_cors_origins(self) -> List[str]:
        """Parse the CORS_ORIGINS string into a list of URLs"""
        if not self.CORS_ORIGINS:
            return [
                "http://localhost:3000",  # React default
                "http://127.0.0.1:3000",
                "http://localhost:5173",  # Vite default
                "http://127.0.0.1:5173",
            ]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()
