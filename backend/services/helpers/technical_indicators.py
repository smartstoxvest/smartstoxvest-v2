# backend/services/helpers/technical_indicators.py

import pandas as pd
import numpy as np

def calculate_rsi(data, window=14):
    delta = data['Close'].diff()
    gain = np.where(delta > 0, delta, 0)
    loss = np.where(delta < 0, -delta, 0)

    avg_gain = pd.Series(gain).rolling(window=window, min_periods=1).mean()
    avg_loss = pd.Series(loss).rolling(window=window, min_periods=1).mean()

    # Avoid division by zero
    avg_loss = np.where(avg_loss == 0, np.nan, avg_loss)
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    data['RSI'] = pd.Series(rsi).bfill()
    return data

def calculate_atr(data, window=14):
    high_low = data['High'] - data['Low']
    high_close = np.abs(data['High'] - data['Close'].shift())
    low_close = np.abs(data['Low'] - data['Close'].shift())

    true_range = pd.DataFrame({
        'HL': high_low,
        'HC': high_close,
        'LC': low_close
    }).max(axis=1)

    atr = true_range.rolling(window=window).mean()
    data['ATR'] = atr
    return data
