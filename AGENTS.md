# Odin — Agent Instructions

## What this app is

Odin is a single-file Progressive Web App (PWA) for tracking a 4-day weighted pull-up and dip programme. Built with vanilla HTML/CSS/JS, no frameworks, deployed on GitHub Pages, localStorage for all data persistence, and a Service Worker (`sw.js`) for offline support.

The app implements a fixed weekly schedule across four session types: Skill A (3×6, heavy, the only progression day), Skill B (6×3, mirrors Skill A weight, no independent progression), Hypertrophy A (EMOM pull-ups + cluster dips to failure), and Hypertrophy B (pyramid pull-ups + straight set dips). RIR is logged on Skill A only and drives all weight progression.

## Critical rules for every edit

### 1 — Always bump the version and timestamp

Every change to `index.html` or `sw.js` must:

1. Bump `APP_VERSION` in `index.html` and `CACHE` in `sw.js` to the next patch version (e.g. `1.0.1` → `1.0.2`). Without this the PWA will not update on users' devices.
2. Update `BUILD_TIMESTAMP` in `index.html` to the current date and time in `YYYY-MM-DD HH:MM` format (user's local time). This timestamp is displayed on the onboarding screen next to the version number so the user can verify they have the latest build.

### 2 — Never touch the progression engine without running tests

The progression logic is verified by an inline test suite that runs on page load. After any change, confirm the console shows:

* `ODIN TESTS: 8/8 passed`

If any tests fail, do not push. Do not claim tests will pass without running them.

### 3 — File structure

The repo contains four files that matter:

| File | Purpose |
|------|---------|
| `index.html` | All app logic — HTML, CSS, and JS in one file |
| `sw.js` | Service worker for offline support |
| `manifest.json` | PWA manifest (name, icons, theme colour) |
| `odin_logo.png` | App icon |

Do not create additional JS or CSS files. All app logic stays in `index.html`. If you need to change the app name, accent colour, or icon, `manifest.json` is the right place — not `index.html`.

### 4 — localStorage is the only data store

There is no backend, no API, no database. All user data is in localStorage. Be careful with any code that reads or writes localStorage — corrupted state cannot be recovered without DevTools access, which is unavailable on iOS PWA.

### 5 — Weight input fields

All weight input fields (onboarding and Settings) must use `type="text" inputmode="decimal"` instead of `type="number"`. This gives the numeric keyboard on iOS while allowing control over accepted characters.

Before parsing any weight value with `parseFloat()`, replace any comma with a dot using the project's `parseWeight()` helper:

```js
function parseWeight(val) { return parseFloat((val || '').replace(',', '.')); }
```

Use `parseWeight(input.value)` instead of `parseFloat(input.value)` for all weight fields. This fixes decimal input on iOS devices with non-English locale settings (e.g. Slovak) where the keyboard shows a comma instead of a dot as the decimal separator.

Integer-only fields (reps, RIR, sets) keep `type="number" inputmode="numeric"` and continue to use `parseInt()` — no change needed for those.

### 6 — iOS compatibility

The app is primarily used as a PWA on iPhone Safari. Avoid any APIs not supported in Mobile Safari. Do not use `localStorage`, `sessionStorage`, or browser storage APIs in artifacts.

### 7 — Local testing via Live Server

The app can be previewed locally via VS Code Live Server at `http://localhost:5500/`. Do not attempt plain localhost without a port — it will always fail. The inline test suite runs on page load and outputs results to the browser console. Always check the console after opening the app locally to confirm test results before finishing any task.

## Programme reference

| Day | Session | Pull-ups | Dips |
|-----|---------|----------|------|
| Mon | Skill A | 3×6 + RIR | 3×6 + RIR |
| Wed | Skill B | 6×3 (mirrors Skill A weight) | 6×3 (mirrors Skill A weight) |
| Fri | Hypertrophy A | EMOM (configurable reps/min and duration) | Cluster sets to failure at Skill A weight — log total rounds of 3 completed |
| Sat | Hypertrophy B | Pyramid 1→2→3→4→5→4→3→2→1 ×2 (50 reps) | Straight sets |

**Progression (Skill A only):**

| RIR logged | Weight change |
|-----------|--------------|
| 3+ | +2.5 kg |
| 2 | +1.25 kg |
| 1 | +1.25 kg |
| 0 or failed reps | Hold |

Skill B always mirrors Skill A's current weight. It never progresses independently.

EMOM parameters are user-configurable in Settings (`emomRepsPerMin`, `emomDurationMins`). Hypertrophy A pull-up logging reads from these values — do not hardcode them.
