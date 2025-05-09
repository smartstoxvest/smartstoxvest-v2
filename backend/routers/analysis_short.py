# ✅ Updated backend/routers/analysis_short.py
from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.indicators import calculate_rsi, calculate_atr
from backend.services.data_service import fetch_stock_data
from backend.services.sentiment import get_news_decision
import yfinance as yf
import math

router = APIRouter()

def safe_float(val):
    return round(val, 2) if val is not None and math.isfinite(val) else 0.0

def safe_float_vtlity(val):
    return round(val, 4) if val is not None and math.isfinite(val) else 0.0

def safe_float_SLTP(val):
    return round(val, 0) if val is not None and math.isfinite(val) else 0.0

class ShortTermRequest(BaseModel):
    symbols: str
    exchange: str
    asset_type: str
    risk_tolerance: float = 1.0

def apply_exchange_suffix(symbol: str, exchange: str) -> str:
    if exchange == "LSE" and not symbol.endswith(".L"):
        return f"{symbol}.L"
    if exchange == "NSE" and not symbol.endswith(".NS"):
        return f"{symbol}.NS"
    if exchange == "BSE" and not symbol.endswith(".BO"):
        return f"{symbol}.BO"
    if exchange == "HKEX" and not symbol.endswith(".HK"):
        return f"{symbol}.HK"
    return symbol

@router.post("/api/short-term-predict")
def short_term_predict(data: ShortTermRequest):
    try:
        symbol_list = [s.strip().upper() for s in data.symbols.split(",")]
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

    results = []

    for symbol in symbol_list:
        smart_symbol = apply_exchange_suffix(symbol, data.exchange)
        print(f"🚀 Fetching short-term data for {smart_symbol} (original: {symbol})")

        # Use full history like long-term logic to ensure current price is valid
        stock = yf.Ticker(smart_symbol)
        df = stock.history(period="1mo", interval="1d")


        if df is None or df.empty or "Close" not in df.columns:
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        df = df.dropna(subset=["Close"])
        df['SMA50'] = df['Close'].rolling(window=50).mean()
        df['SMA200'] = df['Close'].rolling(window=200).mean()
        df = calculate_rsi(df)
        df['Volatility'] = df['Close'].pct_change().rolling(14).std()

        current_price = df['Close'].iloc[-1]
        predicted_price = current_price * 1.02
        rsi = df['RSI'].iloc[-1]
        volatility = df['Volatility'].iloc[-1]

        atr_data = calculate_atr(df)
        atr = atr_data['ATR'].iloc[-1]
        stop_loss = current_price - (atr * 1.5 * (2 - data.risk_tolerance))
        take_profit = current_price + (atr * 2.5 * data.risk_tolerance)

        if predicted_price > current_price:
            if rsi < 30:
                decision = "✅ Invest (Buy Opportunity)"
            elif rsi > 70:
                decision = "⚠️ Hold (Overbought)"
            else:
                decision = "✅ Invest"
        else:
            decision = "❌ Avoid"

        news_decision, sentiment = get_news_decision(symbol)

        if "Avoid" in decision:
            final_decision = "❌ Hold or Avoid"
        elif "Hold" in decision:
            final_decision = "🤔 Review Further"
        elif "Invest" in decision:
            if "Positive News" in news_decision:
                final_decision = "🚀 Invest Strongly"
            elif "Neutral News" in news_decision:
                final_decision = "✅ Invest"
            else:
                final_decision = "✅ Invest"
        else:
            final_decision = "🤔 Review Further"

        signal_conflict = "✅ No Conflict"
        if rsi > 70 and "Positive News" in news_decision:
            signal_conflict = "⚠️ Mixed Signal"
            final_decision = "🤔 Review Further"

        results.append({
            "symbol": symbol,
            "current_price": safe_float(current_price),
            "predicted_price": safe_float(predicted_price),
            "rsi": safe_float(rsi),
            "volatility": safe_float_vtlity(volatility),
            "stop_loss": safe_float_SLTP(stop_loss),
            "take_profit": safe_float_SLTP(take_profit),
            "decision": decision,
            "news_sentiment": news_decision,
            "final_decision": final_decision,
            "signal_conflict": signal_conflict,
            
        })

    return results
