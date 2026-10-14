from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SentimentRequest(BaseModel):
    title: str = Field(..., description="Article headline or title")
    description: Optional[str] = Field(default="", description="Article body or summary")

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    confidence: float
    positive_terms: Optional[List[str]] = []
    negative_terms: Optional[List[str]] = []

class BatchSentimentRequest(BaseModel):
    articles: List[SentimentRequest]

class PredictionMetrics(BaseModel):
    mae: float
    rmse: float
    directionalAccuracy: float

class PredictionRequest(BaseModel):
    symbol: str
    currentPrice: float
    historicalData: List[Dict[str, Any]] = []

class PredictionResponse(BaseModel):
    symbol: str
    currentPrice: float
    predictedPrice: float
    predictedReturn: float
    lowerRange: float
    upperRange: float
    confidence: float
    modelName: str
    modelVersion: str
    metrics: PredictionMetrics
    importantFactors: List[str]
    riskFactors: List[str]
