# Enhanced backend decision logic for better balance between strict filtering and opportunity

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
    all_final_decisions = []

    for symbol in symbol_list:
        smart_symbol = apply_exchange_suffix(symbol, data.exchange)
        stock = yf.Ticker(smart_symbol)
        df = stock.history(period="1mo", interval="1d")

        if df is None or df.empty or "Close" not in df.columns:
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        df = df.dropna(subset=["Close", "Volume"])
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

        latest_volume = df["Volume"].iloc[-1]
        avg_volume = df["Volume"].mean()
        volume_spike = round((latest_volume - avg_volume) / avg_volume * 100, 1)
        volume_spike_str = f"{volume_spike:+.1f}% vs avg"

        last_3 = df["Close"].tail(3).tolist()
        if last_3[2] > last_3[1] > last_3[0]:
            trend = "3D Bullish"
        elif last_3[2] < last_3[1] < last_3[0]:
            trend = "3D Bearish"
        elif last_3[2] > last_3[1] < last_3[0]:
            trend = "Rebound forming"
        else:
            trend = "Flat or No Clear Trend"

        news_decision, sentiment = get_news_decision(symbol)
        sentiment_score = 88 if "Positive" in news_decision else (70 if "Neutral" in news_decision else 50)

        confidence = "🔴 Low"
        if sentiment_score >= 85 and volume_spike > 50 and "Bullish" in trend and rsi < 70:
            confidence = "🟢 High"
        elif sentiment_score >= 70 and volume_spike > 10 and "Bullish" in trend:
            confidence = "🟡 Medium"
        elif "Rebound" in trend and sentiment_score >= 70 and rsi < 65:
            confidence = "🟡 Medium"
        elif "Rebound" in trend and "Positive" in news_decision and rsi < 75 and volume_spike > -70:
            confidence = "🟡 Medium"
        elif "Positive" in news_decision and volume_spike > -50:
            confidence = "🟡 Medium"

        score = 0
        if "Bullish" in trend: score += 2
        if rsi < 30: score += 1
        if sentiment_score > 80: score += 2
        if volume_spike > 10: score += 1
        if confidence == "🟢 High": score += 2
        if confidence == "🟡 Medium": score += 1
        if "Rebound" in trend and rsi < 40: score += 1

        if volume_spike < -50 or ("Bearish" in trend and confidence == "🔴 Low"):
            final_decision = "❌ Avoid (Low Interest or Bearish)"
        else:
            if score >= 6:
                final_decision = "🚀 Invest Strongly"
            elif score >= 4:
                final_decision = "✅ Invest"
            elif score >= 2:
                final_decision = "🤔 Review Further"
            else:
                final_decision = "❌ Avoid"

        all_final_decisions.append((symbol, score, final_decision))

        results.append({
            "symbol": symbol,
            "current_price": safe_float(current_price),
            "predicted_price": safe_float(predicted_price),
            "rsi": safe_float(rsi),
            "volatility": safe_float_vtlity(volatility),
            "stop_loss": safe_float_SLTP(stop_loss),
            "take_profit": safe_float_SLTP(take_profit),
            "decision": "Invest" if predicted_price > current_price else "Avoid",
            "news_sentiment": news_decision,
            "sentiment_score": sentiment_score,
            "volume_spike": volume_spike_str,
            "trend": trend,
            "confidence": confidence,
            "final_decision": final_decision,
            "signal_conflict": "✅ No Conflict"
        })

    if all([r[2].startswith("❌") for r in all_final_decisions]) and len(all_final_decisions) > 0:
        best = sorted(all_final_decisions, key=lambda x: x[1], reverse=True)[0]
        for r in results:
            if r["symbol"] == best[0] and best[1] >= 2:
                r["final_decision"] = "🤔 Review Further"

    return results
