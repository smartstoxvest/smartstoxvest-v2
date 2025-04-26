import yfinance as yf
import numpy as np
import pandas as pd
from typing import Dict

# 🔥 Add Exchange Mapping
exchange_suffix = {
    "LSE": ".L",
    "NASDAQ": "",
    "NYSE": "",
    "NSE": ".NS",
    "Crypto": "-USD"
}

def fetch_stock_data(symbol: str, period: str = "5y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        symbol_with_suffix = symbol + exchange_suffix.get(exchange.upper(), "")
        data = yf.download(symbol_with_suffix, period=period, progress=False)

        if data.empty or "Close" not in data.columns:
            return pd.DataFrame()

        return data.dropna(subset=["Close"])
    except Exception as e:
        print(f"[ERROR] Failed to fetch data for {symbol}: {e}")
        return pd.DataFrame()

def monte_carlo_simulation(data: pd.DataFrame, period: str = "5y", simulations: int = 1000) -> Dict:
    returns = data['Close'].pct_change().dropna()
    mean_return = returns.mean()
    std_dev = returns.std()
    last_price = data['Close'].iloc[-1]

    years = int(period.replace("y", ""))
    days = 252 * years  # Fix here

    simulation_data = np.zeros((days, simulations))
    simulation_data[0] = last_price

    for t in range(1, days):
        random_returns = np.random.normal(mean_return, std_dev, simulations)
        simulation_data[t] = simulation_data[t - 1] * (1 + random_returns)

    end_prices = simulation_data[-1]
    worst_case = np.percentile(end_prices, 5)
    best_case = np.percentile(end_prices, 95)
    expected_return = np.mean(end_prices)

    return {
        "current_price": round(float(last_price), 2),
        "expected_return": round(float(expected_return), 2),
        "worst_case": round(float(worst_case), 2),
        "best_case": round(float(best_case), 2),
        "decision": "Buy" if worst_case > last_price * 0.9 else ("Hold" if worst_case > last_price * 0.75 else "Sell")
    }
