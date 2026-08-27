# ROGUE
https://trl-gger.github.io/Rogue/
### Weighted Calisthenics Tracker

Built this for myself. Tired of doing increment math in my notes app between sets.

Log your reps and RIR. App tells you what weight to use next session. That's it.

---

## The Programme

Based on my own weighted calisthenics programme, which draws heavily from the Mathew Zlat system. The increment tables and phase structure are adapted from his work but tweaked for how I actually train.

---

## Exercises

| Exercise | Day | Type |
|---|---|---|
| Weighted Pull-ups | Monday / Friday | Heavy |
| Weighted Dips | Monday / Friday | Heavy |
| Weighted Chin-ups | Wednesday | Assistance |
| Paused Weighted Dips | Wednesday | Assistance |
| Muscle-ups / OAC / OAP | Saturday | Skill |

Paused Dips weight derives automatically from Dips. Chin-ups and Pull-ups progress independently.

Accessory Pull-ups on Tuesday/Thursday and Accessory Chin-ups on weekends are logged as completion-only — no weight, no reps, just done.

Saturday Skill Sessions unlock when pull-ups or chin-ups reach Intermediate. Muscle-ups every week, alternating between One-Arm Chin-up and One-Arm Pull-up. Reps-only logging — no progression engine, no stall detection.

---

## How Progression Works

Onboarding places you in Novice or Advanced Novice. Intermediate is earned through the stall detection system, not assigned upfront — you move up when deloads genuinely stop working, not before.

The engine tracks stalls per exercise, suggests deloads, and flags phase transitions. Nothing changes without your confirmation.

---

## Features

- RIR-based autoregulation
- Per-exercise stall detection and deload suggestions
- Phase transitions you confirm manually
- Bodyweight tracking with % BW lifted graph per exercise
- 1RM estimate updated after every session
- Saturday skill sessions (Muscle-ups, OAC/OAP) with form-break exit
- Full session history filtered by Heavy / Assistance / Skill
- JSON export and import — including on the onboarding screen
- Automatic backup reminder every 10 sessions
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

## Credit

Progression logic adapted from the Mathew Zlat weighted calisthenics system. Buy his programme if you're serious about this.

---

This project is licensed under CC BY-NC 4.0 — free for personal use, not for commercial purposes.
https://creativecommons.org/licenses/by-nc/4.0/

