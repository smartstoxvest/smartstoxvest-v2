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
    # These exchanges don't need a suffix
    if exchange in ["NASDAQ", "NYSE", "AMEX"]:
        return symbol
    suffix_map = {
        "LSE": ".L",
        "NSE": ".NS",
        "BSE": ".BO",
        "HKEX": ".HK",
        "Crypto": "-USD"
    }
    return symbol + suffix_map.get(exchange, "")


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

def fetch_stock_data(symbol: str, period="1d", exchange="LSE", interval="15m") -> pd.DataFrame | None:
    print(f"[DEBUG] Fetching: {symbol} with fallback intervals")

    intervals_to_try = [interval, "30m", "60m", "1d"]
    for intv in intervals_to_try:
        try:
            df = yf.download(symbol, period=period, interval=intv, progress=False)
            if not df.empty and "Close" in df.columns:
                print(f"[SUCCESS] Found data for {symbol} with interval {intv}")
                df = df.dropna(subset=["Close"])
                return df
            else:
                print(f"[WARN] No data for {symbol} at interval {intv}")
        except Exception as e:
            print(f"[ERROR] {symbol} failed on {intv}: {e}")
    return None


