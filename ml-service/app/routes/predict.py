from fastapi import APIRouter
from app.models.schemas import PredictionRequest, PredictionResponse
from app.services.predictor import predictor

router = APIRouter(prefix="", tags=["Machine Learning Prediction"])

@router.post("/predict", response_model=PredictionResponse)
def get_prediction(payload: PredictionRequest):
    result = predictor.predict(
        symbol=payload.symbol,
        current_price=payload.currentPrice,
        historical_data=payload.historicalData
    )
    return PredictionResponse(**result)
