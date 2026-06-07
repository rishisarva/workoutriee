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

## Cron Job Setup

1. Go to [cron-job.org](https://cron-job.org) (free)
2. Create a job pointing to: `https://YOUR-APP.onrender.com/api/cron/trigger`
3. Set your schedule (e.g. daily at 6:00 AM)
4. Keep the app tab open on your phone — it auto-starts when triggered

**Keep-alive ping** (prevents Render free tier sleep):
- Also add a cron job for `https://YOUR-APP.onrender.com/api/cron/ping` every 14 minutes

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
| GET | `/api/cron/trigger` | Trigger workout auto-start |
| GET | `/api/cron/status` | Check last trigger time |
