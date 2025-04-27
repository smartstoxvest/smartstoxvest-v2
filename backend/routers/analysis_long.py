from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.monte_carlo import fetch_stock_data, monte_carlo_simulation

router = APIRouter(prefix="/long", tags=["Long-Term Analysis"])

class LongTermRequest(BaseModel):
    symbol: str
    period: str = "5y"
    simulations: int = 1000
    exchange: str
    asset_type: str

@router.post("/predict")
async def predict_long_term(data: LongTermRequest):
    try:
        stock_data = fetch_stock_data(data.symbol, period=data.period, exchange=data.exchange)
        
        if stock_data is None or stock_data.empty:
            return {"error": "No stock data found."}

        simulation_results = monte_carlo_simulation(stock_data, simulations=data.simulations)

        return {
            "symbol": data.symbol,
            "current_price": simulation_results["current_price"],
            "worst_case": simulation_results["worst_case"],
            "best_case": simulation_results["best_case"],
            "expected_return": simulation_results["expected_return"],
            "decision": simulation_results["decision"],
        }

    except Exception as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": str(e)})
