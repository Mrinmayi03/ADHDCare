# Steady Bloom

A full‑stack web application designed to help individuals manage their ADHD (Attention Deficit Hyperactivity Disorder) by tracking tasks, moods, medications, and sentiment from user feedback. It combines a Django REST API with JWT‑based authentication and a modern React/TypeScript front end, enriched with data‑science–driven visualizations.

---

## 🚀 Project Overview

**ADHD Care Tracker** allows users to:

- **Log & categorize tasks** with titles, notes, priority levels, and completion status  
- **Journal mood entries** along with optional notes and timestamps  
- **Track medication history**, dosage, and prescription dates  
- **Visualize sentiment** from user feedback via CSV‑driven bar charts and D3 word clouds  
- **Monitor mood trends** over time using interactive line charts  

All data is scoped to each user via secure JWT authentication—so every individual only sees their own dashboard.

---

## 💡 Motivation & Real‑World Impact

Managing ADHD often involves juggling multiple self‑care routines (task lists, mood awareness, medication adherence). Existing tools either focus narrowly on one aspect or lack meaningful insights. **Steady Bloom** solves this by:

- **Centralizing** task, mood, and medication logging in one place  
- **Empowering self‑reflection** with data‑driven charts (e.g., average mood scores, positive/negative sentiment)  
- **Enhancing accountability** through secure, per‑user dashboards  

Beyond ADHD, this tool can benefit caregivers, therapists, and anyone seeking to better understand personal productivity and emotional patterns.

---

## 🎯 Audience & Use Cases

- **ADHD Individuals**: Stay organized, track mood swings, manage medications  
- **Caregivers & Therapists**: Monitor progress remotely, identify patterns  
- **Productivity Enthusiasts**: Leverage task tracking + analytics for better time management  
- **Mental‑Health Researchers**: Gather anonymized insights on medication effects and user feedback  

---

## 🛠️ Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| **Backend**      | Django 5.2, Django REST Framework, Simple JWT  |
| **Database**     | PostgreSQL (SQLite for dev)          |
| **Auth**         | JWT tokens, DRF `IsAuthenticated` + custom `IsOwner` permissions |
| **Frontend**     | React 18, Vite, TypeScript           |
| **Styling**      | Tailwind CSS                         |
| **Routing**      | React Router v6                      |
| **HTTP Client**  | Axios with `VITE_API_BASE` env var   |
| **Charts**       | Recharts (bar/line) & D3 for word clouds |
| **Deployment**   | Render (backend), Netlify (frontend) |

---

## 📊 Data Science & Analytics

1. **Sentiment Analysis**  
   - Reads `medication_analysis/sentiment_analysis_results.csv`  
   - Produces bar charts of POSITIVE vs. NEGATIVE review counts per medication  

2. **Word Cloud Generation**  
   - Tokenizes and filters comments, removes stopwords  
   - Displays top 100 most frequent words in a D3 word cloud  

3. **Mood Trend Scoring**  
   - Maps mood labels (e.g. “Happy” → 10, “Anxious” → 6)  
   - Averages scores daily/weekly/monthly and renders an interactive line chart  

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** ≥ 18 & **npm** (or yarn)  
- **Python** ≥ 3.10 & **pip**, **virtualenv**  
- PostgreSQL (or SQLite for local dev)

### Backend Setup

```bash
git clone https://github.com/yourusername/adhd-care-tracker.git
cd adhd-care-tracker/backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Environment variables (.env or Render dashboard):
SECRET_KEY, DATABASE_URL, SIMPLE_JWT settings, etc.

Frontend Setup
```bash
cd ../frontend
cp .env.example .env
```
# Edit .env → VITE_API_BASE=http://localhost:8000/api/
```
npm install
npm run dev
```
Open your browser at http://localhost:5173.

🎬 Usage
Sign Up for a new account.

Log In to receive your JWT and unlock your dashboard.

Navigate via the top‑nav to add tasks, mood logs, and medications.

Explore “Sentiment” and “Word Cloud” tabs for insights on feedback data.

Switch the “Mood Trends” time window (week/month) to see your emotional journey.

🌐 Live Demo
Frontend (Netlify): https://steadybloom.netlify.app/
