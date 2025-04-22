from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from typing import List
from services.monte_carlo import fetch_stock_data, monte_carlo_simulation

router = APIRouter()

@router.get("/api/long-term-predict")
async def get_long_term_predictions(
    symbols: str = Query(..., description="Comma-separated stock tickers, e.g. AAPL,TSLA"),
    exchange: str = Query("NASDAQ", description="Stock exchange (e.g. NASDAQ, LSE, NSE)"),
    period: str = Query("5y", description="Data period (e.g. 5y, 10y)"),
    simulations: int = Query(1000, description="Number of Monte Carlo simulations")
):
    try:
        tickers = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        results = []

        for symbol in tickers:
            data = fetch_stock_data(symbol, period)
            if data.empty:
                continue
            sim_result = monte_carlo_simulation(data, simulations=simulations)
            results.append({"symbol": symbol, **sim_result})

        return results
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
