import logging
import numpy as np
import pandas as pd

def compute_short_term_signals(stock_data):
    """
    Computes short-term trading signals using RSI and Volatility
    derived directly from stock_data.
    """
    try:
        close_prices = pd.Series(stock_data['Close'])

        # RSI calculation
        delta = close_prices.diff()
        gain = delta.where(delta > 0, 0).rolling(14).mean()
        loss = -delta.where(delta < 0, 0).rolling(14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        rsi_value = rsi.iloc[-1]

        # Volatility calculation
        volatility = close_prices.pct_change().rolling(14).std().iloc[-1]

        # Log calculated values
        logging.warning(f"🧪 Calculated RSI: {rsi_value}, Volatility: {volatility}")

        # Decision logic
        if rsi_value < 30:
            decision = "Buy"
            confidence_score = 0.9
        elif rsi_value > 70:
            decision = "Sell"
            confidence_score = 0.9
        else:
            decision = "Hold"
            confidence_score = 0.5

        return {
            "rsi": round(rsi_value, 2),
            "volatility": round(volatility, 4),
            "decision": decision,
            "confidence_score": confidence_score
        }

    except Exception as e:
        return {"error": str(e)}
