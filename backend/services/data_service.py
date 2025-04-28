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

    if all(col == symbol_with_suffix for col in df.columns):
        print(f"[DEBUG] All columns are symbol for {symbol_with_suffix}, resetting headers.")
        possible_headers = [
            ['Open', 'High', 'Low', 'Close', 'Volume'],
            ['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']
        ]
        for headers in possible_headers:
            if len(headers) == len(df.columns):
                df.columns = headers
                return df
        raise ValueError(f"Header mismatch for symbol {symbol_with_suffix}")
    return df

def fetch_stock_data(symbol_with_suffix: str, period: str = "1y", exchange: str = "NASDAQ") -> pd.DataFrame | None:
    """
    Fetch stock data using a correctly suffixed symbol.
    Assumes smart symbol suffixing already happened BEFORE calling.
    """
    try:
        print(f"[INFO] Fetching data for {symbol_with_suffix} | Exchange: {exchange}")

        df = yf.download(symbol_with_suffix, period=period, progress=False)

        if df.empty:
            print(f"[WARN] No data returned for {symbol_with_suffix}")
            return None  # ← Return None (NOT empty DataFrame)

        df = clean_yfinance_columns(df, symbol_with_suffix)
        df = df.dropna(subset=["Close"])

        if df.empty:
            print(f"[WARN] Data has no usable 'Close' prices after cleaning: {symbol_with_suffix}")
            return None

        print(f"[SUCCESS] Fetched {len(df)} rows for {symbol_with_suffix}")
        return df

    except Exception as e:
        print(f"[ERROR] Exception while fetching {symbol_with_suffix}: {e}")
        return None
