from fastapi import APIRouter, Query
from backend.services.indicators import calculate_rsi
from backend.services.data_service import apply_exchange_suffix, fetch_stock_data
import pandas as pd

router = APIRouter()

@router.get("/api/short-term-chart-data/{symbol}")
def get_chart_data(symbol: str, exchange: str = Query("NASDAQ")):
    symbol_with_suffix = apply_exchange_suffix(symbol, exchange)
    df = fetch_stock_data(symbol_with_suffix, period="60d", exchange=exchange, interval="60m")

    if df is None or df.empty or 'Close' not in df.columns:
        return {"error": "No data available"}

    df['SMA50'] = df['Close'].rolling(window=50).mean()
    df['SMA200'] = df['Close'].rolling(window=200).mean()
    df = calculate_rsi(df)
    df = df.dropna(subset=["SMA50", "SMA200", "RSI"])

    return {
        "dates": df.index.strftime('%Y-%m-%d').tolist(),
        "open": df['Open'].tolist(),
        "high": df['High'].tolist(),
        "low": df['Low'].tolist(),
        "close": df['Close'].tolist(),
        "sma50": df['SMA50'].tolist(),
        "sma200": df['SMA200'].tolist(),
        "rsi": df['RSI'].tolist()
    }
