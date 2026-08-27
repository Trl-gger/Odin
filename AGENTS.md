# Rogue — Agent Instructions

## What this app is
Rogue is a single-file Progressive Web App (PWA) for tracking weighted calisthenics training. Built with vanilla HTML/CSS/JS, no frameworks, deployed on GitHub Pages, localStorage for all data persistence, and a Service Worker (`sw.js`) for offline support.

The app implements the Mathew Zlat weighted calisthenics periodization programme across four exercises: Weighted Dips, Weighted Pull-ups, Weighted Chin-ups, and Paused Dips. It includes a full progression engine with RIR-based autoregulation, stall detection, deload logic, and phase transition detection.

## Critical rules for every edit

### 1 — Always bump the version and timestamp
Every change to `index.html` or `sw.js` must:
1. Bump `APP_VERSION` in `index.html` and `CACHE` in `sw.js` to the next patch version (e.g. `1.1.8` → `1.1.9`). Without this the PWA will not update on users' devices.
2. Update `BUILD_TIMESTAMP` in `index.html` to the current date and time in `YYYY-MM-DD HH:MM` format (user's local time). This timestamp is displayed on the onboarding screen next to the version number so the user can verify they have the latest build.

### 2 — Never touch the progression engine without running tests
The progression engine, stall detection logic, and phase detection are verified by an inline test suite that runs on page load. After any change, confirm the console shows:
- `PHASE VERIFICATION: 38/38 tests passed`
- `STALL DETECTION TESTS COMPLETE: 10/10 passed`

If any tests fail, do not push. Do not claim tests will pass without running them.

### 3 — Single file
All app logic lives in `index.html`. There is no separate `engine.js` or component files. Do not create new JS or CSS files.

### 4 — localStorage is the only data store
There is no backend, no API, no database. All user data is in localStorage. Be careful with any code that reads or writes localStorage — corrupted state cannot be recovered without DevTools access, which is unavailable on iOS PWA.

### 5 — Weight input fields
All weight input fields (onboarding and Settings) must use `type="text" inputmode="decimal"` instead of `type="number"`. This gives the numeric keyboard on iOS while allowing control over accepted characters.

Before parsing any weight value with `parseFloat()`, replace any comma with a dot using the project's `parseWeight()` helper:

```js
function parseWeight(val) { return parseFloat((val || '').replace(',', '.')); }
```

Use `parseWeight(input.value)` instead of `parseFloat(input.value)` for **all** weight fields. This fixes decimal input on iOS devices with non-English locale settings (e.g. Slovak) where the keyboard shows a comma instead of a dot as the decimal separator.

**Integer-only fields** (reps, RIR, sets) keep `type="number" inputmode="numeric"` and continue to use `parseInt()` — no change needed for those.

### 6 — iOS compatibility
The app is primarily used as a PWA on iPhone Safari. Avoid any APIs not supported in Mobile Safari. Do not use `localStorage`, `sessionStorage`, or browser storage APIs in artifacts.

### 7 — Local testing via Live Server
The app can be previewed locally via VS Code Live Server at http://localhost:5500/. Do not attempt plain localhost without a port — it will always fail. The inline test suite runs on page load and outputs results to the browser console. Always check the console after opening the app locally to confirm test results before finishing any task.