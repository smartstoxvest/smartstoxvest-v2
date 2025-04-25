from textblob import TextBlob
import requests
import re

def fetch_news(stock):
    url = f"https://newsapi.org/v2/everything?q={stock}&sortBy=publishedAt&apiKey=YOUR_NEWS_API_KEY"
    response = requests.get(url)
    articles = response.json().get("articles", [])
    return articles[:5]

def analyze_sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

def get_news_decision(stock):
    articles = fetch_news(stock)
    sentiment_scores = [
        analyze_sentiment((article.get('title') or '') + " " + (article.get('description') or ''))
        for article in articles
    ]

    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

    if avg_sentiment > 0.15:
        return "🟢 Positive News - Consider Buying", avg_sentiment
    elif avg_sentiment < -0.15:
        return "🔴 Negative News - Consider Selling", avg_sentiment
    else:
        return "🟡 Neutral News - Hold", avg_sentiment

def clean_decision_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r"[^\w\s()\-]", "", text)
    text = text.replace("\n", " ").strip()
    return text
