import os
import requests
from textblob import TextBlob

def fetch_news(stock):
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        return []

    url = f"https://newsapi.org/v2/everything?q={stock}&sortBy=publishedAt&apiKey={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        articles = response.json().get("articles", [])
        return articles[:5]
    except Exception as e:
        print(f"⚠️ Failed to fetch news for {stock}: {e}")
        return []

def analyze_sentiment(text):
    return TextBlob(text).sentiment.polarity

def get_news_decision(stock):
    articles = fetch_news(stock)
    scores = [analyze_sentiment((a.get("title") or "") + " " + (a.get("description") or "")) for a in articles]
    avg_score = sum(scores) / len(scores) if scores else 0

    if avg_score > 0.15:
        return "🟢 Positive News - Consider Buying", avg_score
    elif avg_score < -0.15:
        return "🔴 Negative News - Consider Selling", avg_score
    else:
        return "🟡 Neutral News - Hold", avg_score

def clean_decision_text(text):
    import re
    return re.sub(r"[^\w\s()-]", "", text).strip().lower()
