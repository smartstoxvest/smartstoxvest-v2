from fastapi import APIRouter
from services.fetch_data import fetch_stock_data
from services.indicators import calculate_rsi, calculate_sl_tp


router = APIRouter(prefix="/short", tags=["Short-Term Analysis"])

from pydantic import BaseModel

class StockRequest(BaseModel):
    symbol: str
    exchange: str
    period: str
    risk_tolerance: float


@router.post("/analyze")
def analyze_short_term(data: StockRequest):
    print("📥 Incoming request:", data.dict())

    df = fetch_stock_data(data.symbol, data.period, data.exchange)
    if df is None or df.empty:
        print("❌ Data not found or empty")
        return {"error": "Invalid or missing data for the stock."}

    print("✅ Data shape:", df.shape)

    # ✅ Properly apply RSI from imported service
    df = calculate_rsi(df)

    # ✅ Sanity check for RSI values
    if 'RSI' not in df.columns or df['RSI'].dropna().empty:
        print("🚫 RSI calculation failed — all values are NaN or missing.")
        return {"error": "RSI calculation failed — not enough data or invalid structure."}

    df['Volatility'] = df['Close'].pct_change().rolling(14).std()
    print("📊 RSI + Volatility calculated")

    # ✅ Validate 'Close' column too
    if 'Close' not in df.columns or df['Close'].dropna().empty:
        return {"error": "No valid 'Close' price data available."}

    current_price = df['Close'].dropna().iloc[-1]
    rsi = df['RSI'].dropna().iloc[-1]
    volatility = df['Volatility'].dropna().iloc[-1]

    print(f"💰 Price = {current_price}, RSI = {rsi}, Vol = {volatility}")

    stop_loss, take_profit = calculate_sl_tp(df, data.risk_tolerance)
    print(f"📉 SL = {stop_loss}, 🤑 TP = {take_profit}")

    if stop_loss is None or take_profit is None:
        print("⚠️ SL/TP couldn't be calculated")
        return {"error": "Could not calculate SL/TP"}

    # ✅ Simple decision logic
    if rsi < 30:
        decision = "Buy"
    elif rsi > 70:
        decision = "Sell"
    else:
        decision = "Hold"

    print("✅ Decision:", decision)

    return {
        "symbol": data.symbol,
        "current_price": current_price,
        "rsi": rsi,
        "volatility": volatility,
        "stop_loss": stop_loss,
        "take_profit": take_profit,
        "decision": decision
    }

