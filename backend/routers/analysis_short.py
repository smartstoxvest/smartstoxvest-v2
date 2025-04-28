from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.indicators import compute_short_term_signals
from backend.services.data_service import fetch_stock_data
from backend.services.indicators import calculate_rsi, calculate_atr
from backend.services.sentiment import get_news_decision, clean_decision_text

router = APIRouter()

class ShortTermRequest(BaseModel):
    symbols: str
    exchange: str
    asset_type: str
    risk_tolerance: float = 1.0

# NEW: Smart suffix function
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
        # NEW: Apply smart suffix before fetching
        smart_symbol = apply_exchange_suffix(symbol, data.exchange)
        print(f"🚀 Fetching short-term data for {smart_symbol} (original: {symbol})")

        df = fetch_stock_data(smart_symbol, "1y", data.exchange)

        if df is None or df.empty or "Close" not in df.columns:
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        # Calculate indicators
        df['SMA50'] = df['Close'].rolling(window=50).mean()
        df['SMA200'] = df['Close'].rolling(window=200).mean()
        df = calculate_rsi(df)
        df['Volatility'] = df['Close'].pct_change().rolling(14).std()

        current_price = df['Close'].iloc[-1]
        predicted_price = current_price * 1.02  # simple +2% model
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

        # News Decision
        news_decision, sentiment = get_news_decision(symbol)

        # Score Calculation
        tech_score_map = {"Invest": 7, "Invest (Buy Opportunity)": 9, "Hold (Overbought)": 4, "Hold": 3, "Avoid": 1}
        news_score_map = {"Positive News - Consider Buying": 8, "Neutral News - Hold": 5, "Negative News - Consider Selling": 2}

        tech_clean = clean_decision_text(decision)
        news_clean = clean_decision_text(news_decision)

        tech_score = tech_score_map.get(tech_clean, 0)
        news_score = news_score_map.get(news_clean, 0)

        total_score = tech_score + news_score

        # Final Decision
        if total_score >= 14:
            final_decision = "🚀 Invest Strongly"
        elif total_score >= 11:
            final_decision = "✅ Invest"
        elif total_score >= 8:
            final_decision = "🤔 Review Further"
        else:
            final_decision = "❌ Hold or Avoid"

        # Mixed Signal Downgrade Rule
        signal_conflict = "✅ No Conflict"
        if rsi > 70 and "Positive News" in news_decision:
            signal_conflict = "⚠️ Mixed Signal"
            final_decision = "🤔 Review Further"

        results.append({
            "symbol": symbol,  # keep original symbol
            "current_price": round(current_price, 2),
            "predicted_price": round(predicted_price, 2),
            "rsi": round(rsi, 2),
            "volatility": round(volatility, 4),
            "stop_loss": round(stop_loss, 2),
            "take_profit": round(take_profit, 2),
            "decision": decision,
            "news_sentiment": news_decision,
            "final_decision": final_decision,
            "signal_conflict": signal_conflict,
        })

    return results
