from fastapi import APIRouter
from pydantic import BaseModel
from services.lstm_model import predict_lstm

router = APIRouter(prefix="/medium", tags=["Medium-Term Analysis"])

class MediumTermRequest(BaseModel):
    symbol: str
    period: str
    epochs: int = 5
    future_days: int = 30

@router.post("/predict")
def predict_medium_term(data: MediumTermRequest):
    print("📥 Incoming medium-term request:", data.dict())

    # ✅ Basic input validation
    if data.symbol.lower() == "string" or data.period.lower() == "string":
        return {"error": "Please enter a valid stock symbol and period."}

    # ✅ Assuming default exchange NASDAQ, and NO suffix required
    symbol_with_suffix = data.symbol  # No suffix needed now

    predicted_prices, summary, confidence, chart_base64, upper_bounds, lower_bounds = predict_lstm(
        symbol=symbol_with_suffix,
        period=data.period,
        future_days=data.future_days
    )

    if predicted_prices is None:
        return {"error": confidence}

    # ✅ Build chart data correctly
    chart_data = [
        {
            "day": i + 1,
            "price": float(predicted_prices[i]),
            "upper": float(upper_bounds[i]),
            "lower": float(lower_bounds[i])
        }
        for i in range(len(predicted_prices))
    ]

    return {
        "symbol": data.symbol,
        "predicted_prices": predicted_prices,
        "future_days": data.future_days,
        "trend": summary["trend"],
        "recommendation": summary["recommendation"],
        "percentage_change": summary["percentage_change"],
        "start_price": summary["start_price"],
        "end_price": summary["end_price"],
        "chart_data": chart_data,
        "confidence": f"{confidence}%",
        "chart_base64": chart_base64,
        "upper_bounds": upper_bounds,
        "lower_bounds": lower_bounds
    }
