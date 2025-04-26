# backend/routers/analysis_long.py

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from backend.services.helpers.monte_carlo import fetch_stock_data, monte_carlo_simulation

router = APIRouter(prefix="/long", tags=["Long-Term Analysis"])

class LongTermRequest(BaseModel):
    symbol: str
    exchange: str = "NASDAQ"
    period: str = "5y"
    simulations: int = 1000

@router.post("/predict")
async def predict_long_term(request: LongTermRequest):
    try:
        data = fetch_stock_data(request.symbol, period=request.period, exchange=request.exchange)
        
        if data is None or data.empty:
            return {"error": "No stock data found."}

        simulation_results = monte_carlo_simulation(data, simulations=request.simulations)

        return {
            "symbol": request.symbol,
            "current_price": simulation_results["current_price"],
            "worst_case": simulation_results["worst_case"],
            "best_case": simulation_results["best_case"],
            "expected_return": simulation_results["expected_return"],
            "decision": simulation_results["decision"],
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
