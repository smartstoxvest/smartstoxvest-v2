import numpy as np
import pandas as pd
from typing import Dict

def monte_carlo_simulation(data: pd.DataFrame, period: str = "5y", simulations: int = 1000) -> Dict:
    returns = data['Close'].pct_change().dropna()
    mean_return = returns.mean()
    std_dev = returns.std()
    last_price = data['Close'].iloc[-1]

    years = int(period.replace("y", ""))
    days = 252 * years

    simulation_data = np.zeros((days, simulations))
    simulation_data[0] = last_price

    for t in range(1, days):
        random_returns = np.random.normal(mean_return, std_dev, simulations)
        simulation_data[t] = simulation_data[t - 1] * (1 + random_returns)

    end_prices = simulation_data[-1]
    worst_case = np.percentile(end_prices, 5)
    best_case = np.percentile(end_prices, 95)
    expected_return = np.mean(end_prices)

    data['SMA200'] = data['Close'].rolling(window=200).mean()
    sma200 = data['SMA200'].iloc[-1] if not data['SMA200'].isna().all() else None

    rolling_vol = returns.rolling(window=60).std()
    volatility = rolling_vol.iloc[-1] * np.sqrt(252) if not rolling_vol.isna().all() else None

    if worst_case > last_price * 0.9:
        decision = "Buy"
    elif worst_case > last_price * 0.75:
        decision = "Hold"
    else:
        decision = "Sell"

    return {
        "current_price": round(float(last_price), 2),
        "expected_return": round(float(expected_return), 2),
        "worst_case": round(float(worst_case), 2),
        "best_case": round(float(best_case), 2),
        "sma200": round(float(sma200), 2) if sma200 else None,
        "volatility": round(float(volatility), 4) if volatility else None,
        "decision": decision,
    }
