import logging
import numpy as np
import pandas as pd

def compute_short_term_signals(stock_data):
    try:
        # Calculate RSI
        delta = stock_data["Close"].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

        # Calculate volatility
        log_returns = np.log(stock_data["Close"] / stock_data["Close"].shift(1))
        volatility = log_returns.rolling(window=14).std() * np.sqrt(252)

        # Handle NaNs
        latest_rsi = rsi.dropna().iloc[-1] if not rsi.dropna().empty else None
        latest_vol = volatility.dropna().iloc[-1] if not volatility.dropna().empty else None

        if latest_rsi is None or latest_vol is None:
            return {"error": "Not enough data to compute indicators."}

        # Simple prediction logic
        if latest_rsi < 30:
            decision = "Buy"
        elif latest_rsi > 70:
            decision = "Sell"
        else:
            decision = "Hold"

        confidence_score = round(1 - abs(latest_rsi - 50) / 50, 2)

        return {
            "rsi": round(latest_rsi, 2),
            "volatility": round(latest_vol, 4),
            "decision": decision,
            "confidence_score": confidence_score
        }
    except Exception as e:
        return {"error": f"Failed to compute indicators: {str(e)}"}

