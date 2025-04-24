from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from services.fetch_utils import fetch_stock_data
from services.short_term_service import compute_short_term_signals

router = APIRouter()

@router.get("/api/short-term-predict")
def short_term_predict(
    symbols: str = Query(..., description="Comma-separated tickers"),
    exchange: str = Query("NASDAQ", description="Exchange (e.g. NASDAQ)"),
    period: str = Query("1y", description="Period for analysis (e.g. 1y, 6mo)")
):
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        results = []

        for symbol in symbol_list:
            stock_data = fetch_stock_data(symbol, period=period, exchange=exchange)
            if stock_data is None or stock_data.empty:
                results.append({"symbol": symbol, "error": "No data found"})
                continue

            analysis = compute_short_term_signals(stock_data)

            if "error" in analysis:
                results.append({"symbol": symbol, **analysis})
                continue

            results.append({
                "symbol": symbol,
                "current_price": round(stock_data['Close'].iloc[-1], 2),
                "predicted_price": round(stock_data['Close'].iloc[-1] * 1.02, 2),
                "rsi": analysis["rsi"],
                "volatility": analysis["volatility"],
                "decision": analysis["decision"],
                "confidence_score": analysis["confidence_score"],
                "news_sentiment": "🟡 Neutral",
                "final_decision": analysis["decision"],
                "signal_conflict": "✅ No Conflict"
            })

        return results
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
