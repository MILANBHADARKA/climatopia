import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import os

# === Download VADER Lexicon (only once) ===
nltk.download('vader_lexicon', quiet=True)

# === Initialize VADER Analyzer ===
sid = SentimentIntensityAnalyzer()

# === Sentiment Classification Function ===
def get_sentiment(text):
    scores = sid.polarity_scores(text)
    compound = scores['compound']
    label = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE' if compound <= -0.05 else 'NEUTRAL'
    return label, compound

# === Analyze a CSV Dataset ===
def analyze_dataset(input_csv, output_csv):
    df = pd.read_csv(input_csv)
    df = df.dropna(subset=['clean_text'])
    results = df['clean_text'].apply(get_sentiment)
    df['sentiment'], df['score'] = zip(*results)
    df.to_csv(output_csv, index=False)
    print(f"✅ Sentiment analysis complete. Results saved to: {output_csv}")

# === Analyze a Single Sentence ===
def analyze_sentence(sentence):
    label, score = get_sentiment(sentence)
    print(f"\n📌 Sentence: {sentence}")
    print(f"🔍 Sentiment: {label} (Compound Score: {score:.4f})")

# === Main ===
if __name__ == "__main__":
    base_path = os.path.dirname(__file__)
    dataset_path = os.path.join(base_path, 'Twitter_Data.csv')
    output_path = os.path.join(base_path, 'Twitter_Data_with_sentiment.csv')

    # Analyze the dataset
    analyze_dataset(dataset_path, output_path)

    # Analyze a new sentence
    # analyze_sentence("I'm not sure if I love it or hate it 😕")
