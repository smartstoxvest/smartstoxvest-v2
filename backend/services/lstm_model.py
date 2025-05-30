import matplotlib.pyplot as plt
import io
import base64
import numpy as np
import pandas as pd
import yfinance as yf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler

def prepare_lstm_data(df, look_back=60):
    df_close = df['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df_close)

    x_train, y_train = [], []
    for i in range(look_back, len(scaled_data)):
        x_train.append(scaled_data[i-look_back:i, 0])
        y_train.append(scaled_data[i, 0])

    x_train = np.array(x_train)
    y_train = np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    return x_train, y_train, scaler, df_close


def summarize_predictions(predicted_prices):
    start_price = predicted_prices[0]
    end_price = predicted_prices[-1]
    pct_change = ((end_price - start_price) / start_price) * 100

    if pct_change > 5:
        trend = "Uptrend"
        recommendation = "Buy"
    elif pct_change < -5:
        trend = "Downtrend"
        recommendation = "Sell"
    else:
        trend = "Sideways"
        recommendation = "Hold"

    summary = {
        "start_price": round(start_price, 2),
        "end_price": round(end_price, 2),
        "percentage_change": round(pct_change, 2),
        "trend": trend,
        "recommendation": recommendation
    }

    return summary


def predict_lstm(symbol: str, period: str = "2y", lookback: int = 60, future_days: int = 30):
        print(f"🛠 predict_lstm: Running prediction for {symbol}")
        df = yf.download(symbol, period=period)

        if df.empty:
            print(f"❌ No data found for {symbol}")
            return None, "No data found."

        data = df[['Close']].dropna()

        if data.empty or len(data) < lookback:
            print(f"❌ Not enough data for {symbol}. Found {len(data)} rows, need at least {lookback}.")
            return None, "Not enough data to train the model."

        # Proceed safely after validation
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        X, y = [], []
        for i in range(lookback, len(scaled_data)):
            X.append(scaled_data[i - lookback:i, 0])
            y.append(scaled_data[i, 0])
        X, y = np.array(X), np.array(y)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))

        if len(X) < 1:
            return None, "Not enough data to train the model."

        model = Sequential([
            LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)),
            Dropout(0.2),
            LSTM(units=50),
            Dropout(0.2),
            Dense(units=1)
        ])

        model.compile(optimizer='adam', loss='mean_squared_error')

        early_stop = EarlyStopping(monitor='loss', patience=3, restore_best_weights=True)

        model.fit(X, y, epochs=10, batch_size=32, verbose=0, callbacks=[early_stop])

        input_seq = scaled_data[-lookback:, 0].reshape(1, lookback, 1)


        predictions = []
        for _ in range(future_days):
            pred = model.predict(input_seq, verbose=0)
            predictions.append(pred[0][0])
            input_seq = np.concatenate([input_seq[:, 1:, :], np.expand_dims(pred, axis=1)], axis=1)

        predicted_prices = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten().tolist()

        upper_bounds = [round(p * 1.01, 2) for p in predicted_prices]
        lower_bounds = [round(p * 0.99, 2) for p in predicted_prices]

        summary = summarize_predictions(predicted_prices)
        loss = model.evaluate(X, y, verbose=0)
        confidence = round(100 - loss * 100, 2)

        chart_base64 = generate_chart(symbol, predicted_prices, upper_bounds, lower_bounds)
        current_price = round(df['Close'].iloc[-1], 2)  # fetch last close price
        return predicted_prices, summary, confidence, chart_base64, upper_bounds, lower_bounds, current_price


def generate_chart(symbol, predicted_prices, upper_bounds=None, lower_bounds=None):
    plt.figure(figsize=(10, 5))
    plt.plot(predicted_prices, label="Predicted", color='blue')

    if upper_bounds and lower_bounds:
        plt.fill_between(range(len(predicted_prices)), lower_bounds, upper_bounds, color='lightblue', alpha=0.3, label='Confidence Band')

    plt.title(f"{symbol} Medium-Term LSTM Price Prediction")
    plt.xlabel("Days Ahead")
    plt.ylabel("Price")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    chart_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    plt.close()

    return chart_base64
