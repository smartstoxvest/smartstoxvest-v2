import yfinance as yf
import pandas as pd

# 🌍 Exchange suffix mapping
EXCHANGE_SUFFIX = {
    "LSE": ".L",
    "NASDAQ": "",
    "NYSE": "",
    "NSE": ".NS",
    "Crypto": "-USD"
}


def apply_exchange_suffix(symbol: str, exchange: str) -> str:
    return symbol + EXCHANGE_SUFFIX.get(exchange.upper(), "")


def clean_yfinance_columns(df: pd.DataFrame, symbol_with_suffix: str) -> pd.DataFrame:
    if isinstance(df.columns, pd.MultiIndex):
        print(f"[DEBUG] Flattening MultiIndex columns for {symbol_with_suffix}")
        df.columns = df.columns.get_level_values(1)

    # Handle case where all columns are just the ticker symbol
    if all(col == symbol_with_suffix for col in df.columns):
        print(f"[DEBUG] All column names match symbol ({symbol_with_suffix}). Attempting to reset headers.")

        possible_headers = [
            ['Open', 'High', 'Low', 'Close', 'Volume'],  # 5 cols
            ['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']  # 6 cols
        ]

        for headers in possible_headers:
            if len(headers) == len(df.columns):
                df.columns = headers
                print(f"[DEBUG] Headers reset successful: {headers}")
                return df

        raise ValueError("Column header mismatch after yfinance fetch.")

    return df


def fetch_stock_data(symbol: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame:
    try:
        symbol_with_suffix = apply_exchange_suffix(symbol, exchange)
        print(f"[DEBUG] Final ticker for yfinance download: {symbol_with_suffix}")
        print(f"[DEBUG] Downloading: {symbol_with_suffix}, Period: {period}")

        df = yf.download(symbol_with_suffix, period=period, progress=False)

        if df.empty:
            print(f"[DEBUG] No data returned for {symbol}")
            return pd.DataFrame()

        df = clean_yfinance_columns(df, symbol_with_suffix)
        df = df.dropna(subset=["Close"])

        print(f"[DEBUG] Sample data for {symbol}:\n{df.head()}")
        return df

    except Exception as e:
        print(f"[ERROR] Failed to fetch data for {symbol}: {e}")
        return pd.DataFrame()
