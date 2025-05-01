import yfinance as yf
import numpy as np
import pandas as pd
from backend.services.data_service import fetch_stock_data
from backend.services.helpers.technical_indicators import calculate_rsi, calculate_atr
from backend.services.sentiment import get_news_decision, clean_decision_text

def safe_float(value):
    if pd.isna(value) or np.isinf(value):
        return None
    return round(float(value), 2)

def compute_short_term_signals(symbols, exchange, risk_tolerance):
    results = []

    for symbol in symbols:
        data = fetch_stock_data(symbol, "1y", exchange)
        if data is None or data.empty or 'Close' not in data:
            results.append({"symbol": symbol, "error": "No data found"})
            continue

        if len(data['Close'].dropna()) < 20:
            results.append({
                "symbol": symbol,
                "error": "Not enough data to compute indicators (need at least 20 days)."
            })
            continue

        data['SMA50'] = data['Close'].rolling(window=50).mean()
        data['SMA200'] = data['Close'].rolling(window=200).mean()
        data = calculate_rsi(data, window=14)
        data['Volatility'] = data['Close'].pct_change().rolling(14).std()

        rsi_series = data['RSI'].dropna()
        vol_series = data['Volatility'].dropna()
        close_series = data['Close'].dropna()

        if rsi_series.empty or vol_series.empty or close_series.empty:
            print(f"[DEBUG] RSI tail for {symbol}: {data['RSI'].tail()}")
            print(f"[DEBUG] Volatility tail for {symbol}: {data['Volatility'].tail()}")
            print(f"[DEBUG] Close tail for {symbol}: {data['Close'].tail()}")
            results.append({
                "symbol": symbol,
                "error": "Failed to compute indicators: Too many missing RSI, Volatility or Close values."
            })
            continue

        rsi = rsi_series.iloc[-1]
        volatility = vol_series.iloc[-1]
        current_price = close_series.iloc[-1]
        predicted_price = current_price * 1.02  # Placeholder +2% model

        atr_data = calculate_atr(data)
        atr = atr_data['ATR'].iloc[-1]
        stop_loss = current_price - (atr * 1.5 * (2 - risk_tolerance))
        take_profit = current_price + (atr * 2.5 * risk_tolerance)

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
            final_decision = "Hold or Avoid"

        signal_conflict = "⚠️ Mixed Signal" if rsi > 70 and "Positive News" in news_decision else "✅ No Conflict"

        results.append({
            "symbol": symbol,
            "current_price": safe_float(current_price),
            "predicted_price": safe_float(predicted_price),
            "rsi": safe_float(rsi),
            "volatility": safe_float(volatility),
            "stop_loss": safe_float(stop_loss),
            "take_profit": safe_float(take_profit),
            "decision": decision,
            "news_sentiment": news_decision,
            "final_decision": final_decision,
            "signal_conflict": signal_conflict,
        })

    return results

def get_sma200_and_volatility(symbol, period="1y", exchange=""):
    try:
        df = yf.Ticker(symbol).history(period=period, interval="1d")
        if df.empty or "Close" not in df:
            print(f"[WARN] No 1d data for {symbol}, trying 60m interval.")
            df = yf.Ticker(symbol).history(period=period, interval="60m")

        if df.empty or "Close" not in df:
            print(f"[ERROR] Still no valid Close data for {symbol}")
            return None, None

        df['SMA200'] = df['Close'].rolling(window=200).mean()
        df['Volatility'] = df['Close'].pct_change().rolling(window=14).std()

        sma200 = df['SMA200'].dropna().iloc[-1] if not df['SMA200'].dropna().empty else None
        volatility = df['Volatility'].dropna().iloc[-1] if not df['Volatility'].dropna().empty else None

        return float(sma200) if sma200 else None, float(volatility) if volatility else None

    except Exception as e:
        print(f"[ERROR] Failed to compute SMA/Volatility for {symbol}: {e}")
        return None, None

