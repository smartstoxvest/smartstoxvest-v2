from fastapi import APIRouter, Query
from backend.services.data_service import fetch_stock_data
from backend.services.indicators import calculate_rsi, calculate_atr
from backend.services.sentiment import get_news_decision, clean_decision_text

router = APIRouter()

@router.get("/api/short-term-predict")
def short_term_predict(symbols: str = Query(...), exchange: str = "NASDAQ", risk_tolerance: float = 1.0):
    results = []

    for symbol in symbols.split(","):
        symbol = symbol.strip().upper()
        data = fetch_stock_data(symbol, "1y", exchange)

        if data is None or data.empty or "Close" not in data:
            print(f"[WARN] No data found for {symbol}")
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        # Calculate indicators
        data['SMA50'] = data['Close'].rolling(window=50).mean()
        data['SMA200'] = data['Close'].rolling(window=200).mean()
        data = calculate_rsi(data)
        data['Volatility'] = data['Close'].pct_change().rolling(14).std()

        current_price = data['Close'].iloc[-1]
        predicted_price = current_price * 1.02  # basic model
        rsi = data['RSI'].iloc[-1]
        volatility = data['Volatility'].iloc[-1]

        atr_data = calculate_atr(data)
        atr = atr_data['ATR'].iloc[-1]
        stop_loss = current_price - (atr * 1.5 * (2 - risk_tolerance))
        take_profit = current_price + (atr * 2.5 * risk_tolerance)

        # Basic decision logic
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

        # Scoring
        tech_score = {"Invest": 7, "Invest (Buy Opportunity)": 9, "Hold (Overbought)": 4, "Hold": 3, "Avoid": 1}
        news_score = {"Positive News - Consider Buying": 8, "Neutral News - Hold": 5, "Negative News - Consider Selling": 2}

        tech_clean = clean_decision_text(decision)
        news_clean = clean_decision_text(news_decision)

        total_score = tech_score.get(tech_clean, 0) + news_score.get(news_clean, 0)

        if total_score >= 14:
            final_decision = "Invest Strongly"
        elif total_score >= 11:
            final_decision = "Invest"
        elif total_score >= 8:
            final_decision = "Review Further"
        else:
            final_decision = "Hold"

        signal_conflict = "⚠️ Mixed Signal" if rsi > 70 and "Positive News" in news_decision else "✅ No Conflict"

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
            "signal_conflict": signal_conflict,
        })

    return results
