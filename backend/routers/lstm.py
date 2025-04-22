import base64
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from services.lstm import generate_lstm_prediction_chart

router = APIRouter()

@router.get("/api/lstm-predict")
async def get_lstm_chart(symbol: str = Query(..., description="Stock symbol")):
    try:
        # 🔁 Still use your chart generation function
        chart_base64 = generate_lstm_prediction_chart(symbol)

        # 🔧 Mock logic for now (replace later with real values)
        predicted_price = 250.0 + hash(symbol) % 20  # randomish mock value
        confidence_low = predicted_price - 10
        confidence_high = predicted_price + 10
        recommendation = "Buy" if predicted_price > 255 else "Hold"

        return {
            "predicted_price": round(predicted_price, 2),
            "confidence_low": round(confidence_low, 2),
            "confidence_high": round(confidence_high, 2),
            "recommendation": recommendation,
            "chart_base64": chart_base64
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
