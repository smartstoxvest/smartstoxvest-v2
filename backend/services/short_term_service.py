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

        # Simple prediction logic (for demo)
        decision = "Buy" if rsi.iloc[-1] < 30 else "Sell" if rsi.iloc[-1] > 70 else "Hold"
        confidence_score = round(1 - abs(rsi.iloc[-1] - 50) / 50, 2)

        return {
            "rsi": round(rsi.iloc[-1], 2),
            "volatility": round(volatility.iloc[-1], 4),
            "decision": decision,
            "confidence_score": confidence_score
        }
    except Exception as e:
        return {"error": f"Failed to compute indicators: {str(e)}"}
