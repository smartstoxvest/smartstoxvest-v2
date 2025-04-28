# ✅ Fully Corrected backend/routers/analysis_short.py

from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.indicators import calculate_rsi, calculate_atr
from backend.services.data_service import fetch_stock_data
from backend.services.sentiment import get_news_decision, clean_decision_text

router = APIRouter()

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

        df = fetch_stock_data(smart_symbol, "1y", data.exchange)

        if df is None or df.empty or "Close" not in df.columns:
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        # Indicators
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

        # Technical Decision
        if predicted_price > current_price:
            if rsi < 30:
                decision = "✅ Invest (Buy Opportunity)"
            elif rsi > 70:
                decision = "⚠️ Hold (Overbought)"
            else:
                decision = "✅ Invest"
        else:
            decision = "❌ Avoid"

        # News Sentiment
        news_decision, sentiment = get_news_decision(symbol)

        # 🔥 New Final Decision Logic
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

        # Conflict Check
        signal_conflict = "✅ No Conflict"
        if rsi > 70 and "Positive News" in news_decision:
            signal_conflict = "⚠️ Mixed Signal"
            final_decision = "🤔 Review Further"

        results.append({
            "symbol": symbol,
            "current_price": round(current_price, 2),
            "predicted_price": round(predicted_price, 2),
            "rsi": round(rsi, 2),
            "volatility": round(volatility, 4),
            "stop_loss": round(stop_loss, 2),
            "take_profit": round(take_profit, 2),
            "decision": decision,
            "news_sentiment": news_decision,
            "final_decision": final_decision,
            "signal_conflict": signal_conflict
        })

    return results
