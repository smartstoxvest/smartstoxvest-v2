import numpy as np
import pandas as pd

def compute_short_term_signals(stock_data):
    try:
        if stock_data.empty or "Close" not in stock_data.columns:
            return {"error": "No valid 'Close' data available."}

        # Drop NaNs in 'Close'
        close = stock_data["Close"].dropna()

        if len(close) < 15:
            return {"error": "Not enough data to compute indicators."}

        # Calculate RSI
        delta = close.diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

        # Calculate volatility
        log_returns = np.log(close / close.shift(1))
        volatility = log_returns.rolling(window=14).std() * np.sqrt(252)

        if pd.isna(rsi.iloc[-1]) or pd.isna(volatility.iloc[-1]):
            return {"error": "Indicators resulted in NaN. Possibly insufficient data."}

        # Simple prediction logic
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
