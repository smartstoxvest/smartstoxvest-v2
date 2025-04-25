import yfinance as yf
import pandas as pd

# Exchange suffix mapping just like v1
exchange_suffix = {
    "LSE": ".L",
    "NASDAQ": "",
    "NYSE": "",
    "NSE": ".NS",
    "Crypto": "-USD"
}

def fetch_stock_data(symbol: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        # Apply suffix mapping like in Streamlit
        
        stock_with_suffix = symbol + exchange_suffix.get(exchange.upper(), "")
        print(f"[DEBUG] Final ticker for yfinance download: {stock_with_suffix}")

        print(f"[DEBUG] Downloading: {stock_with_suffix}, Period: {period}")

        data = yf.download(stock_with_suffix, period=period, progress=False)

        if data.empty:
            print(f"[DEBUG] No data returned for {symbol}")
            return pd.DataFrame()

        # Flatten columns if MultiIndex (rarely happens for single ticker, but safe)
        if isinstance(data.columns, pd.MultiIndex):
            print(f"[DEBUG] Flattening MultiIndex columns for {symbol}")
            try:
                data = data.droplevel(0, axis=1)
            except Exception as e:
                print(f"[ERROR] Failed to flatten columns for {symbol}: {e}")
                return pd.DataFrame()

        if "Close" not in data.columns:
            print(f"[DEBUG] 'Close' column missing for {symbol}, columns: {data.columns}")
            return pd.DataFrame()

        data = data.dropna(subset=["Close"])
        print(f"[DEBUG] Sample data for {symbol}:\n{data.head()}")
        return data

    except Exception as e:
        print(f"[ERROR] Failed to fetch data for {symbol}: {e}")
        return pd.DataFrame()
