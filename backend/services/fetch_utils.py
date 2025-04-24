import yfinance as yf
import pandas as pd

def fetch_stock_data(symbol: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        full_symbol = f"{symbol}" if exchange.upper() in ["NASDAQ", "NYSE"] else f"{symbol}.{exchange.upper()}"
        data = yf.download(full_symbol, period=period, progress=False)
        return data
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return pd.DataFrame()
