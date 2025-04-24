import logging

def compute_short_term_signals(stock_data, rsi, volatility):
    """
    Dummy implementation for computing short-term trading signals.
    Replace this logic with real technical indicator-based analysis.
    """
    # Log the received input for debugging
    logging.warning(f"🧪 Received RSI: {rsi}, Volatility: {volatility}")

    # Ensure proper types (fail-safe for API misuse)
    try:
        rsi = float(rsi)
        volatility = float(volatility)
    except ValueError:
        return {
            "error": "Invalid input type for RSI or Volatility. Must be float-compatible."
        }

    # Example logic (can be replaced with SMA/EMA crossover, MACD, etc.)
    if rsi < 30:
        decision = "Buy"
        confidence_score = 0.9
    elif rsi > 70:
        decision = "Sell"
        confidence_score = 0.9
    else:
        decision = "Hold"
        confidence_score = 0.5

    return {
        "decision": decision,
        "confidence_score": confidence_score
    }
