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
