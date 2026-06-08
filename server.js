const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "workouts.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== LOAD / SAVE =====
function loadWorkouts() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) { console.error("Load error:", e); }
  return [];
}

function saveWorkouts(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Init from CSV if no data file
if (!fs.existsSync(DATA_FILE)) {
  const csvPath = path.join(__dirname, "workout.csv");
  if (fs.existsSync(csvPath)) {
    const lines = fs.readFileSync(csvPath, "utf8").split("\n");
    const exercises = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim().replace(/\r/g, "");
      if (!line) continue;
      const p = line.split(",");
      exercises.push({
        id: Date.now() + i,
        name: (p[0] || "").trim(),
        duration: parseInt(p[1]) || 0,
        rest: parseInt(p[2]) || 0,
        reps: (p[3] || "").trim(),
        unit: (p[4] || "sec").trim().toLowerCase(),
      });
    }
    saveWorkouts(exercises);
    console.log("Loaded " + exercises.length + " exercises from CSV");
  }
}

// ===== TTS PROXY =====
// Proxies Google Translate TTS — works on EVERY device
app.get("/api/tts", (req, res) => {
  const text = (req.query.text || "").substring(0, 200);
  if (!text) return res.status(400).send("No text");

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;

  https.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
      "Referer": "https://translate.google.com/",
    }
  }, (upstream) => {
    res.set("Content-Type", upstream.headers["content-type"] || "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    upstream.pipe(res);
  }).on("error", (e) => {
    console.error("TTS proxy error:", e.message);
    res.status(500).send("TTS error");
  });
});

// ===== API =====
app.get("/api/workouts", (req, res) => res.json(loadWorkouts()));

app.post("/api/workouts", (req, res) => {
  const workouts = loadWorkouts();
  const ex = {
    id: Date.now(),
    name: req.body.name || "",
    duration: parseInt(req.body.duration) || 0,
    rest: parseInt(req.body.rest) || 0,
    reps: req.body.reps || "",
    unit: req.body.unit || "sec",
  };
  workouts.push(ex);
  saveWorkouts(workouts);
  res.json(ex);
});

app.put("/api/workouts/:id", (req, res) => {
  const workouts = loadWorkouts();
  const idx = workouts.findIndex((w) => w.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  workouts[idx] = { ...workouts[idx], ...req.body, id: workouts[idx].id };
  saveWorkouts(workouts);
  res.json(workouts[idx]);
});

app.delete("/api/workouts/:id", (req, res) => {
  let workouts = loadWorkouts();
  workouts = workouts.filter((w) => w.id != req.params.id);
  saveWorkouts(workouts);
  res.json({ ok: true });
});

app.put("/api/workouts-reorder", (req, res) => {
  const { ids } = req.body;
  const workouts = loadWorkouts();
  const ordered = ids.map((id) => workouts.find((w) => w.id == id)).filter(Boolean);
  saveWorkouts(ordered);
  res.json(ordered);
});

app.post("/api/workouts/bulk", (req, res) => {
  const { exercises } = req.body;
  if (!Array.isArray(exercises)) return res.status(400).json({ error: "Bad data" });
  const mapped = exercises.map((ex, i) => ({
    id: Date.now() + i,
    name: ex.name || "",
    duration: parseInt(ex.duration) || 0,
    rest: parseInt(ex.rest) || 0,
    reps: ex.reps || "",
    unit: ex.unit || "sec",
  }));
  saveWorkouts(mapped);
  res.json(mapped);
});

// ===== CRON KEEP-ALIVE =====
app.get("/api/cron/ping", (req, res) => {
  console.log(`[CRON] Ping at ${new Date().toISOString()}`);
  res.json({ status: "alive", time: new Date().toISOString() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Workout app on port ${PORT}`));
