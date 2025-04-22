import numpy as np
import pandas as pd

def calculate_rsi(data, window=14):
    try:
        if 'Close' not in data.columns or data['Close'].dropna().empty:
            print("⚠️ No 'Close' data to calculate RSI.")
            return data

        delta = data['Close'].diff()

        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        avg_gain = gain.rolling(window=window, min_periods=window).mean()
        avg_loss = loss.rolling(window=window, min_periods=window).mean()

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

        # ✅ Set back into DataFrame properly
        data['RSI'] = rsi.bfill().ffill()

        # 🧪 Debugging
        print("🧠 RSI calculation complete")
        print(data[['Close', 'RSI']].tail(10))
        print("🧪 Non-NaN RSI count:", data['RSI'].notna().sum())

    except Exception as e:
        print("🔥 Exception in calculate_rsi:", str(e))

    return data

def calculate_sl_tp(data, risk_tolerance):
    high_low = data['High'] - data['Low']
    high_close = abs(data['High'] - data['Close'].shift())
    low_close = abs(data['Low'] - data['Close'].shift())

    true_range = pd.DataFrame({
        'HL': high_low,
        'HC': high_close,
        'LC': low_close
    }).max(axis=1)

    atr = true_range.rolling(window=14).mean()
    data['ATR'] = atr

    current_price = data['Close'].dropna().iloc[-1]

    atr_value = atr.dropna().iloc[-1] if not atr.dropna().empty else None

    if atr_value is None or atr_value == 0:
        return None, None

    # Define Stop-Loss & Take-Profit based on risk
    sl = current_price - atr_value * (2 - risk_tolerance)
    tp = current_price + atr_value * (2.5 * risk_tolerance)

    return sl, tp
