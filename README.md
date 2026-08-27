# ODIN
https://trl-gger.github.io/Odin/
### Weighted Calisthenics Tracker
Built this for myself. Tracking four sessions a week across two different training stimuli got messy in notes.
Log your reps and RIR on skill days. App tells you what weight to use next session. That's it.
---
## The Programme
Four training days a week built around weighted pull-ups and dips. Two skill sessions, two hypertrophy sessions, three rest days.
| Day | Session |
|---|---|
| Monday | Skill A |
| Tuesday | Rest |
| Wednesday | Skill B |
| Thursday | Rest |
| Friday | Hypertrophy A |
| Saturday | Hypertrophy B |
| Sunday | Rest |
---
## Sessions
**Skill A** — Weighted pull-ups 3×6, weighted dips 3×6, high pull-ups 4×1. The only session where weight progresses.
**Skill B** — Same movements, cluster structure: 6×3. Weight mirrors Skill A automatically. No RIR logging.
**Hypertrophy A** — Pull-ups EMOM (configurable reps and duration in Settings), weighted dips 10×6 at a fixed hypertrophy weight.
**Hypertrophy B** — Pull-up pyramid (1→2→3→4→5→4→3→2→1, done twice = 50 reps), weighted dips 10×2 at the same fixed hypertrophy weight.
---
## How Progression Works
Only Skill A progresses. After each session, pull-up and dip weight update independently based on the lowest RIR logged that session.
| RIR | Increment |
|---|---|
| 3+ | +2.5 kg |
| 2 | +1.25 kg |
| 1 | +0.5 kg |
| 0 or failed | hold |
---
## Features
- RIR-based autoregulation on Skill A
- Skill B weight mirrors Skill A automatically
- Configurable EMOM prescription (reps per minute, duration)
- Bodyweight tracking with % BW lifted graph
- 1RM estimate updated after every Skill A session
- Full session history
- JSON export and import — including on the onboarding screen
- Works offline, PWA, add to home screen
---
## Installation
Open the URL in Safari, tap Share → Add to Home Screen. Works offline after first load.
To run your own copy — fork the repo, enable GitHub Pages on main branch, done.
---
## Your Data
Everything in localStorage. Nothing sent anywhere. Export JSON regularly — Settings has a one-tap export. If you clear browser data you lose everything.
---
## Tech
Single HTML file. Vanilla JS. No frameworks. No build step. Service Worker for offline. GitHub Pages for hosting.
---
## Related
Forked from [Rogue](https://github.com/trl-gger/Rogue) — my Mathew Zlat based tracker.
---
This project is licensed under CC BY-NC 4.0 — free for personal use, not for commercial purposes.
https://creativecommons.org/licenses/by-nc/4.0/
