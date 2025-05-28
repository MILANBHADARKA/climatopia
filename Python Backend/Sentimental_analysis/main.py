# main.py

import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import os
from fastapi import FastAPI
from pydantic import BaseModel

# === NLTK Setup ===
NLTK_DATA_DIR = os.path.join(os.path.dirname(__file__), 'nltk_data')
nltk.data.path.append(NLTK_DATA_DIR)
sid = SentimentIntensityAnalyzer()

# === Sentiment Function ===
def get_sentiment(text):
    scores = sid.polarity_scores(text)
    compound = scores['compound']
    label = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE' if compound <= -0.05 else 'NEUTRAL'
    return label, compound

# === Dataset Analysis (for offline use) ===
def analyze_dataset(input_csv, output_csv):
    df = pd.read_csv(input_csv)
    df = df.dropna(subset=['clean_text'])
    results = df['clean_text'].apply(get_sentiment)
    df['sentiment'], df['score'] = zip(*results)
    df.to_csv(output_csv, index=False)
    print(f"✅ Sentiment analysis complete. Results saved to: {output_csv}")

# === API Setup ===
app = FastAPI()

class InputText(BaseModel):
    text: str

@app.post("/analyze_sentimental_report")
def analyze_text(data: InputText):
    sentiment, compound = get_sentiment(data.text)
    return {
        "text": data.text,
        "sentiment": sentiment,
        "score": compound
    }
