from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://milkby:milkby_secret@localhost:5432/milkby"
    gemini_api_key: str = ""
    public_base_url: str = "https://milk.by"
    frontend_index_url: str = ""
    media_dir: str = str(Path(__file__).resolve().parent.parent / "media")
    admin_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
