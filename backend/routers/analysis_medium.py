from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.lstm_model import predict_lstm

router = APIRouter(prefix="/medium", tags=["Medium-Term Analysis"])

class MediumTermRequest(BaseModel):
    symbol: str
    period: str
    epochs: int = 5
    future_days: int = 30
    exchange: str
    asset_type: str

# 👉 ADD THIS small function right **below** your `MediumTermRequest` class (before @router.post)
def apply_exchange_suffix(symbol: str, exchange: str) -> str:
    if exchange == "LSE" and not symbol.endswith(".L"):
        return f"{symbol}.L"
    if exchange == "NSE" and not symbol.endswith(".NS"):
        return f"{symbol}.NS"
    if exchange == "BSE" and not symbol.endswith(".BO"):
        return f"{symbol}.BO"
    if exchange == "HKEX" and not symbol.endswith(".HK"):
        return f"{symbol}.HK"
    return symbol

@router.post("/predict")
async def predict_medium_term(data: MediumTermRequest):
    print("📥 Incoming medium-term request:", data.dict())

    symbol_list = [s.strip().upper() for s in data.symbol.split(",")]

    all_predictions = []

    for symbol in symbol_list:
        # ✅ UPDATE HERE: apply suffix
        smart_symbol = apply_exchange_suffix(symbol, data.exchange)
        print(f"🔥 Predicting for: {smart_symbol} (Original: {symbol})")

        result = predict_lstm(
            symbol=smart_symbol,
            period=data.period,
            future_days=data.future_days
        )

        if result is None or (isinstance(result, tuple) and len(result) == 2):
            error_message = result[1] if isinstance(result, tuple) else "Unknown Error"
            all_predictions.append({
                "symbol": symbol,
                "error": error_message
            })
            continue

        # ✅ Now unpacking 7 values (new version)
        predicted_prices, summary, confidence, chart_base64, upper_bounds, lower_bounds, current_price = result

        chart_data = [
            {
                "day": i + 1,
                "price": float(predicted_prices[i]),
                "upper": float(upper_bounds[i]),
                "lower": float(lower_bounds[i])
            }
            for i in range(len(predicted_prices))
        ]

        all_predictions.append({
            "symbol": symbol,  # Keep original symbol for display
            "predicted_prices": predicted_prices,
            "future_days": data.future_days,
            "trend": summary["trend"],
            "recommendation": summary["recommendation"],
            "percentage_change": summary["percentage_change"],
            "start_price": summary["start_price"],
            "end_price": summary["end_price"],
            "current_price": current_price,
            "chart_data": chart_data,
            "confidence": f"{confidence}%",
            "chart_base64": chart_base64,
            "upper_bounds": upper_bounds,
            "lower_bounds": lower_bounds
        })

    return all_predictions
