import os
import json
import pandas as pd
from transformers import pipeline
from tqdm import tqdm

# Load sentiment model with batching
sentiment_pipeline = pipeline("sentiment-analysis", batch_size=20)

# Directory containing JSON files (adjust if needed)
DATA_DIR = "data"
OUTPUT_CSV = "sentiment_analysis_results.csv"

# Collect all comment JSON files
json_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json")]
all_results = []

# Helper: break list into chunks
def chunked(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i + size]

# Process each medication file
for file in json_files:
    med_name = file.replace("comments_", "").replace(".json", "").replace("_", " ").title()
    path = os.path.join(DATA_DIR, file)

    with open(path, "r", encoding="utf-8") as f:
        comments_raw = json.load(f)

    comments = [c["comment"] for c in comments_raw if len(c["comment"].split()) >= 6]
    print(f"\n🔍 {med_name}: {len(comments)} comments")

    for i, batch in enumerate(tqdm(chunked(comments, 20), desc=f"Analyzing {med_name}", unit="batch")):
        try:
            results = sentiment_pipeline(batch, truncation=True)
            for text, result in zip(batch, results):
                all_results.append({
                    "medication": med_name,
                    "comment": text,
                    "sentiment": result["label"],
                    "confidence": round(result["score"], 4)
                })
        except Exception as e:
            print(f"⚠️ Error in batch {i} for {med_name}: {e}")
            continue

# Save all results to CSV
df = pd.DataFrame(all_results)
df.to_csv(OUTPUT_CSV, index=False)
print(f"\n✅ Sentiment results saved to: {OUTPUT_CSV}")
