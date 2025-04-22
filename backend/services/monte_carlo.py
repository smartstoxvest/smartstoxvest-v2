import yfinance as yf
import numpy as np
import pandas as pd
from typing import Dict


def fetch_stock_data(symbol: str, period: str = "5y") -> pd.DataFrame:
    data = yf.download(symbol, period=period)
    if data.empty or "Close" not in data.columns:
        return pd.DataFrame()
    return data


def monte_carlo_simulation(data: pd.DataFrame, days: int = 252, simulations: int = 1000) -> Dict:
    returns = data['Close'].pct_change().dropna()
    mean_return = returns.mean()
    std_dev = returns.std()
    last_price = data['Close'].iloc[-1]

    simulation_data = np.zeros((days, simulations))
    simulation_data[0] = last_price

    for t in range(1, days):
        random_returns = np.random.normal(mean_return, std_dev, simulations)
        simulation_data[t] = simulation_data[t - 1] * (1 + random_returns)

    worst_case = np.percentile(simulation_data[-1], 5)
    best_case = np.percentile(simulation_data[-1], 95)

    return {
        "last_price": round(last_price, 2),
        "predicted_price": round(np.mean(simulation_data[-1]), 2),
        "worst_case": round(worst_case, 2),
        "best_case": round(best_case, 2),
        "decision": "✅ Buy" if worst_case > last_price * 0.9 else "⚠️ Hold" if worst_case > last_price * 0.75 else "❌ Sell"
    }
