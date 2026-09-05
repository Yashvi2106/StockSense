from fastapi import APIRouter
from app.models.schemas import SentimentRequest, SentimentResponse, BatchSentimentRequest
from app.services.sentiment import analyze_financial_sentiment
from typing import List

router = APIRouter(prefix="/nlp", tags=["Natural Language Processing"])

@router.post("/sentiment", response_model=SentimentResponse)
def get_sentiment(payload: SentimentRequest):
    result = analyze_financial_sentiment(payload.title, payload.description or "")
    return SentimentResponse(**result)

@router.post("/sentiment/batch", response_model=List[SentimentResponse])
def get_batch_sentiment(payload: BatchSentimentRequest):
    results = [
        SentimentResponse(**analyze_financial_sentiment(a.title, a.description or ""))
        for a in payload.articles
    ]
    return results
