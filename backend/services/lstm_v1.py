import base64
import io
import matplotlib.pyplot as plt
import yfinance as yf
from io import BytesIO

def generate_lstm_prediction_chart(symbol: str) -> str:
    print(f"⚙️ Fetching data for {symbol}")
    
    # Fetch real historical data
    df = yf.download(symbol, period="6mo", interval="1d")
    if df.empty:
        raise ValueError(f"No data found for symbol: {symbol}")
    
    # Get only the closing prices (you can later feed this into LSTM model)
    closing_prices = df["Close"].values[-50:]  # last 50 days
    
    # Plot the real data for now
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(closing_prices, label=f"LSTM Prediction for {symbol}", color="blue", linewidth=2)
    ax.set_title("Medium-Term Stock Forecast", fontsize=14)
    ax.set_xlabel("Days")
    ax.set_ylabel("Price")
    ax.grid(True)
    ax.legend()

    # Convert plot to base64
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    return img_base64
