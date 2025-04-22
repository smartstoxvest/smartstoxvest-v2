import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt
import base64
import io
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def generate_lstm_prediction_chart(symbol: str) -> str:
    # 1. Fetch historical data
    df = yf.download(symbol, period="1y", interval="1d")
    close_prices = df["Close"].values.reshape(-1, 1)

    # 2. Normalize
    scaler = MinMaxScaler()
    scaled_prices = scaler.fit_transform(close_prices)

    # 3. Prepare dataset (e.g., past 60 days → predict next 1 day)
    X, y = [], []
    for i in range(60, len(scaled_prices)):
        X.append(scaled_prices[i-60:i])
        y.append(scaled_prices[i])
    X, y = np.array(X), np.array(y)

    # 4. Build LSTM model
    model = Sequential()
    model.add(LSTM(50, return_sequences=False, input_shape=(X.shape[1], 1)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=5, batch_size=32, verbose=0)  # 🔄 Keep training light for now

    # 5. Make predictions (last 50 days)
    last_60_days = scaled_prices[-60:].reshape(1, 60, 1)
    predictions = []
    for _ in range(50):
        pred = model.predict(last_60_days)[0][0]
        predictions.append(pred)
        last_60_days = np.append(last_60_days[:, 1:, :], [[[pred]]], axis=1)

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

    # 6. Plot
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(predictions, label=f"LSTM Prediction for {symbol}", color="blue", linewidth=2)
    ax.set_title("Medium-Term Stock Forecast")
    ax.set_xlabel("Days")
    ax.set_ylabel("Price")
    ax.legend()
    ax.grid(True)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")
