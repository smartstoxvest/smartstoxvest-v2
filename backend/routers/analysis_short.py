from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from typing import List
from services.short_term_service import compute_short_term_signals

router = APIRouter()

@router.get("/api/short-term-predict")
async def get_short_term_predictions(
    symbols: str = Query(..., description="Comma-separated stock tickers (e.g. AAPL,TSLA,GOOGL)"),
    exchange: str = Query("LSE", description="Exchange, e.g., LSE, NASDAQ, NSE, Crypto"),
    risk_tolerance: float = Query(1.0, description="Risk tolerance between 0.1 and 2.0")
):
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        results = compute_short_term_signals(symbol_list, exchange, risk_tolerance)
        return results
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
