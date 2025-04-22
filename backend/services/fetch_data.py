import yfinance as yf
import pandas as pd

exchange_suffix = {
    "LSE": ".L",
    "NASDAQ": "",
    "NYSE": "",
    "NSE": ".NS",
    "Crypto": "-USD"
}

def fetch_stock_data(symbol, period, exchange):
    symbol_with_suffix = symbol + exchange_suffix.get(exchange, "")
    df = yf.download(symbol_with_suffix, period=period)

    if df.empty:
        return None

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0] for col in df.columns]

    return df
