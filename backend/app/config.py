from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./urbanease_delivery.db"

    class Config:
        env_file = ".env"
