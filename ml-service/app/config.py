import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    app_name: str = "StockSense ML Microservice"
    port: int = int(os.getenv("PORT", 8000))
    host: str = os.getenv("HOST", "0.0.0.0")
    model_path: str = os.getenv("MODEL_PATH", "saved_models/")
    env: str = os.getenv("ENV", "development")

settings = Settings()
