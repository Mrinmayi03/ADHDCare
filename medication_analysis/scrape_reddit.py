import praw
import os
import json
import time

# ========== STEP 1: Reddit API Setup ==========
reddit = praw.Reddit(
    client_id="iIlChpn_MrDFbUVKrOq23w",
    client_secret="EpTXmF8But5t4MmPiEAMQBQ3BPed4A",
    user_agent="adhd-med-sentiment-script by u/MrinmayiKatti"
)

# ========== STEP 2: ADHD Medication List ==========
ADHD_MEDICATIONS = [
    "Vyvanse", "Adderall", "Concerta", "Ritalin", "Strattera",
    "Dexedrine", "Intuniv", "Kapvay", "Qelbree", "Jornay PM",
    "Evekeo", "Mydayis", "Focalin"
]

# ========== STEP 3: Scrape Function ==========
def scrape_comments(med_name, subreddit='ADHD', limit=100):
    comments = []
    print(f"\n🔍 Scraping posts for: {med_name}")

    try:
        for post in reddit.subreddit(subreddit).search(med_name, limit=limit):
            post.comments.replace_more(limit=0)
            for comment in post.comments.list():
                text = comment.body.strip()
                if len(text.split()) >= 6:
                    comments.append({
                        "medication": med_name,
                        "comment": text
                    })
        print(f"✅ {med_name}: Collected {len(comments)} comments.")
        return comments

    except Exception as e:
        print(f"❌ Error while scraping {med_name}: {e}")
        return []

# ========== STEP 4: Main Runner ==========
if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)

    for med in ADHD_MEDICATIONS:
        results = scrape_comments(med, limit=50)  # You can increase limit if needed
        output_path = f"data/comments_{med.lower().replace(' ', '_')}.json"

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        time.sleep(2)  # Pause between meds to avoid triggering Reddit rate limit
