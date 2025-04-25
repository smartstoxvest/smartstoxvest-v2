import yfinance as yf
import pandas as pd

def fetch_stock_data(symbol: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        full_symbol = f"{symbol}" if exchange.upper() in ["NASDAQ", "NYSE"] else f"{symbol}.{exchange.upper()}"
        print(f"[DEBUG] Downloading: {full_symbol}, Period: {period}")

        data = yf.download(tickers=full_symbol, period=period, progress=False)

        if data is None or data.empty:
            print(f"[DEBUG] No data returned for {symbol}")
            return pd.DataFrame()

        if isinstance(data.columns, pd.MultiIndex):
            print(f"[DEBUG] MultiIndex detected. Flattening to use only second level.")
            data.columns = data.columns.get_level_values(1)

        if "Close" not in data.columns:
            print(f"[DEBUG] 'Close' column missing for {symbol}, columns found: {data.columns}")
            return pd.DataFrame()

        data = data.dropna(subset=["Close"])
        print(f"[DEBUG] Data sample for {symbol}:\n{data.head()}")
        return data

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return pd.DataFrame()
