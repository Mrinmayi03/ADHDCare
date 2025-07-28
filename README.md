# STEADYBLOOM

A full-stack web application designed to help individuals manage their ADHD (Attention Deficit Hyperactivity Disorder) by tracking tasks, moods, medications, and sentiment from user feedback. It combines a Django REST API with JWT‑based authentication and a modern React/TypeScript front end, enriched with data‑science–driven visualizations (word clouds, sentiment charts, mood trends).

🚀 Project Overview
SteadyBloom allows users to:

Log & categorize tasks with titles, notes, priority levels, and completion status.

Journal mood entries along with optional notes and timestamps.

Track medication history, dosage, and prescription dates.

Visualize sentiment from user feedback via CSV‑driven bar charts and D3 word clouds.

Monitor mood trends over time using interactive line charts.

All data is scoped to each user via secure JWT authentication—so every individual only sees their own dashboard.

💡 Motivation & Real‑World Impact
Managing ADHD often involves juggling multiple self‑care routines (task lists, mood awareness, medication adherence). Existing tools either focus narrowly on one aspect or lack meaningful insights from user feedback. SteadyBloom solves this by:

Centralizing task, mood, and medication logging in one place.

Empowering self‑reflection with data‑driven charts (e.g. average mood scores, positive/negative sentiment).

Enhancing accountability through secure, per‑user dashboards.

Beyond ADHD, this tool can benefit caregivers, therapists, and anyone seeking to better understand personal productivity and emotional patterns.

🎯 Audience & Use Cases
ADHD Individuals: Stay organized, track mood swings, and manage medications.

Caregivers & Therapists: Monitor progress remotely, identify patterns in sentiment and mood.

Productivity Enthusiasts: Leverage task tracking + analytics for better time management.

Mental‑Health Researchers: Gather anonymized insights on medication effects and user feedback.

🛠️ Tech Stack
Layer	Technology
Backend	Django 5.2, Django REST Framework, JWT (SimpleJWT)
Database	PostgreSQL (or SQLite for dev)
Authentication	JWT tokens, DRF IsAuthenticated + custom IsOwner permissions
Frontend	React 18, Vite, TypeScript
Styling	Tailwind CSS
Routing	React Router v6
HTTP Client	Axios with a VITE_API_BASE env var
Charts	Recharts (bar/line) & D3 for word clouds
Deployment	Render (backend), Netlify (frontend)

📊 Data Science & Analytics
Sentiment Analysis

Source: medication_analysis/sentiment_analysis_results.csv

Bar charts summarize counts of POSITIVE/NEGATIVE reviews per medication.

Word Cloud Generation

Filters out stopwords, tokenizes user comments, and displays the top 100 most frequent words.

Mood Trend Scoring

Maps discreet mood labels (e.g. “Happy” → 10, “Anxious” → 6)

Averages scores over daily/weekly or monthly buckets and plots an interactive line chart.

🏁 Getting Started
Prerequisites
Node.js ≥ 18, npm (or yarn)

Python ≥ 3.10, pip, virtualenv

A PostgreSQL database (or accept SQLite for local dev)

Backend Setup
Clone and enter the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/ADHDCare.git
cd ADHDCare/backend
Create & activate a virtual environment:

bash
Copy
Edit
python -m venv .venv
source .venv/bin/activate
Install dependencies & run migrations:

bash
Copy
Edit
pip install -r requirements.txt
python manage.py migrate
Run the development server:

bash
Copy
Edit
python manage.py runserver
Environment:

SECRET_KEY, DATABASE_URL, etc. in .env (Render uses its dashboard settings)

Frontend Setup
From the root, enter the frontend folder:

bash
Copy
Edit
cd ../frontend
Create a .env file:

env
Copy
Edit
VITE_API_BASE=http://localhost:8000/api/
Install & start:

bash
Copy
Edit
npm install
npm run dev
Open your browser at http://localhost:5173.

🎬 Usage
Sign Up for a new account.

Log In to receive your JWT and unlock your dashboard.

Navigate via the top‑nav to add tasks, mood logs, and medications.

Explore the “Sentiment” and “Word Cloud” tabs for insights on feedback data.

Adjust the “Mood Trends” time window (week/month) to see your emotional journey.

🌐 Live Demo
🔗 Frontend deployed on Netlify:
https://steadybloom.netlify.app/