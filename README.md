# GRIND — Workout App

Mobile-first workout timer with TTS voice coaching, deployable on Render free tier.

## Features
- **TTS Voice Coaching** — announces exercises, countdowns, combos repeated every 4s, rest warnings
- **Boxing Combo Support** — combos with dashes/slip/roll are spoken repeatedly
- **Edit Tab** — add, edit, delete, drag-reorder exercises
- **CSV Import** — upload your workout CSV anytime
- **Cron Trigger** — external cron hits `/api/cron/trigger` to auto-start workout
- **Wake Lock** — keeps screen on during workouts
- **Fully Mobile-First** — designed for phone use

## Deploy to Render (Free)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Settings will auto-detect from `render.yaml`:
   - Build: `npm install`
   - Start: `npm start`
5. Deploy!

## Cron Job Setup (Keep-Alive Only)

Render free tier sleeps after 15 min of inactivity. Use a free cron to keep it alive:

1. Go to [cron-job.org](https://cron-job.org) (free)
2. Create a job: `https://YOUR-APP.onrender.com/api/cron/ping`
3. Set schedule: **every 14 minutes**
4. That's it — cron only keeps the server awake. Workouts start only when YOU press Start.

## Voice Settings

Go to the ⚙ Settings tab to:
- **Pick a voice** — the app auto-ranks English male voices, best first (starred ★)
- **Lower the pitch** — default 0.75 for a deep gym-trainer sound
- **Adjust rate** — default 0.95, slightly slower for authority
- **Test it** — tap "Test Voice" before starting a workout

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/workouts` | List all exercises |
| POST | `/api/workouts` | Add exercise |
| PUT | `/api/workouts/:id` | Update exercise |
| DELETE | `/api/workouts/:id` | Delete exercise |
| PUT | `/api/workouts-reorder` | Reorder exercises |
| POST | `/api/workouts/bulk` | Replace all exercises (CSV import) |
| GET | `/api/cron/ping` | Keep-alive ping |
