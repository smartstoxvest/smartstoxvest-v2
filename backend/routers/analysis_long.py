# backend/routers/analysis_long.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import yfinance as yf
import pandas as pd
from backend.services.indicators import get_sma200_and_volatility

router = APIRouter()

class LongTermRequest(BaseModel):
    symbols: List[str]
    period: str = "5y"
    simulations: int = 1000

class StockSimulationResult(BaseModel):
    symbol: str
    current_price: float
    worst_case: float
    best_case: float
    decision: str
    price_paths: List[List[float]]
    sma200: float | None = None
    volatility: float | None = None

class LongTermResponse(BaseModel):
    results: List[StockSimulationResult]

def monte_carlo_simulation(data, days=252, simulations=1000):
    returns = data['Close'].pct_change().dropna()
    mean_return = returns.mean()
    std_dev = returns.std()

    last_price = data['Close'].iloc[-1]
    price_paths = np.zeros((days, simulations))
    price_paths[0] = last_price

    for t in range(1, days):
        random_returns = np.random.normal(mean_return, std_dev, simulations)
        price_paths[t] = price_paths[t - 1] * (1 + random_returns)

    worst_case = np.percentile(price_paths[-1], 5)
    best_case = np.percentile(price_paths[-1], 95)
    return price_paths.tolist(), worst_case, best_case

@router.post("/longterm", response_model=LongTermResponse)
def long_term_analysis(req: LongTermRequest):
    results = []

    for symbol in req.symbols:
        stock = yf.Ticker(symbol)
        df = stock.history(period=req.period)

        if df.empty or 'Close' not in df.columns:
            continue

        price_paths, worst_case, best_case = monte_carlo_simulation(df, simulations=req.simulations)
        current_price = df['Close'].iloc[-1]

        if worst_case > current_price * 0.9:
            decision = "Buy"
        elif worst_case > current_price * 0.75:
            decision = "Hold"
        else:
            decision = "Sell"
            
        sma200, volatility = get_sma200_and_volatility(symbol, period="1y", exchange="")

        results.append(StockSimulationResult(
            symbol=symbol,
            current_price=current_price,
            worst_case=worst_case,
            best_case=best_case,
            sma200=sma200,
            volatility=volatility,
            decision=decision,
            price_paths=price_paths
        ))

    if not results:
        raise HTTPException(status_code=404, detail="No valid stock data found.")

    return LongTermResponse(results=results)
