from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from services.lstm import generate_lstm_prediction_chart

router = APIRouter()

@router.get("/api/lstm-predict")
async def get_lstm_chart(symbol: str = Query(..., description="Stock symbol")):
    try:
        chart_base64 = generate_lstm_prediction_chart(symbol)
        return {"chart_base64": chart_base64}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
