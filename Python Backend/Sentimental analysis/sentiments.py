import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import os

# === SETTINGS ===
model_name = 'distilbert-base-uncased-finetuned-sst-2-english'
saved_model_dir = './saved_distilbert_sentiment_model'
output_csv = 'Twitter_Data_with_sentiment.csv'

# === FUNCTION: LOAD OR DOWNLOAD MODEL ===
def load_or_download_pipeline():
    if os.path.exists(saved_model_dir):
        print("✅ Loading model from local saved directory...")
        tokenizer = AutoTokenizer.from_pretrained(saved_model_dir)
        model = AutoModelForSequenceClassification.from_pretrained(saved_model_dir)
    else:
        print("⬇️ Downloading model from Hugging Face...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        os.makedirs(saved_model_dir, exist_ok=True)
        tokenizer.save_pretrained(saved_model_dir)
        model.save_pretrained(saved_model_dir)
        print("✅ Model saved locally for future use!")

    device = 0 if torch.cuda.is_available() else -1
    print(f"🚀 Using {'GPU' if device == 0 else 'CPU'} for inference.")
    return pipeline('sentiment-analysis', model=model, tokenizer=tokenizer, device=device)

# === FUNCTION: ANALYZE DATASET ===
def analyze_dataset(sentiment_pipe, csv_path, output_path, batch_size=32):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=['clean_text'])
    texts = df['clean_text'].tolist()

    sentiments, scores = [], []

    print("⏳ Running sentiment analysis in batches...")
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        results = sentiment_pipe(batch)
        sentiments.extend([r['label'] for r in results])
        scores.extend([r['score'] for r in results])
        print(f"✅ Processed batch {i // batch_size + 1}/{(len(texts) + batch_size - 1) // batch_size}")

    df['sentiment'] = sentiments
    df['score'] = scores

    df.to_csv(output_path, index=False)
    print(f"✅ Sentiment analysis complete! Results saved to {output_path}")

# === FUNCTION: ANALYZE SINGLE SENTENCE ===
def analyze_single_sentence(sentiment_pipe, prompt):
    result = sentiment_pipe(prompt)
    print(f"Sentence: {prompt}")
    print(f"Sentiment: {result[0]['label']} (score: {result[0]['score']:.4f})")

# === MAIN EXECUTION ===
if __name__ == "__main__":
    # Load or download model pipeline
    sentiment_pipe = load_or_download_pipeline()

    # Get base path and dataset path
    base_path = os.path.dirname(__file__)
    dataset_path = os.path.join(base_path, 'Twitter_Data.csv')

    # Analyze dataset and save to CSV
    analyze_dataset(sentiment_pipe, dataset_path, output_csv)

    # Example: Analyze a custom sentence
    analyze_single_sentence(sentiment_pipe, "What if dinosaur age comes back?")
