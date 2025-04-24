import yfinance as yf
import pandas as pd

def fetch_stock_data(symbol: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        full_symbol = f"{symbol}" if exchange.upper() in ["NASDAQ", "NYSE"] else f"{symbol}.{exchange.upper()}"
        print(f"[DEBUG] Downloading: {full_symbol}, Period: {period}")
        data = yf.download(full_symbol, period="3mo", progress=False)

        # Ensure DataFrame is valid and has the expected structure
        if data is None or data.empty:
            
            print(f"[DEBUG] No data returned for {symbol}")
            return pd.DataFrame()

        if "Close" not in data.columns:
            print(f"[DEBUG] 'Close' column missing for {symbol}, columns found: {data.columns}")
            return pd.DataFrame()
        print(f"[DEBUG] Data sample for {symbol}:\n{data.head()}")
        data = data.dropna(subset=["Close"])  # Remove rows where Close is NaN

        return data

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return pd.DataFrame()
