const fs = require('fs');
const path = require('path');

// Step 2 — Rogue source data
const ROGUE_PULLUPS = [
  {"date": "2026-06-21", "actualWeight": 5},
  {"date": "2026-06-22", "actualWeight": 6.25},
  {"date": "2026-06-26", "actualWeight": 6.75},
  {"date": "2026-06-29", "actualWeight": 7.25},
  {"date": "2026-07-03", "actualWeight": 10},
  {"date": "2026-07-17", "actualWeight": 10},
  {"date": "2026-07-20", "actualWeight": 12.5},
  {"date": "2026-07-24", "actualWeight": 15},
  {"date": "2026-07-27", "actualWeight": 17.5},
  {"date": "2026-08-08", "actualWeight": 20},
  {"date": "2026-08-10", "actualWeight": 21.25},
  {"date": "2026-08-14", "actualWeight": 21.25}
];

const ROGUE_DIPS = [
  {"date": "2026-06-21", "actualWeight": 60},
  {"date": "2026-06-22", "actualWeight": 62.5},
  {"date": "2026-06-26", "actualWeight": 65},
  {"date": "2026-06-29", "actualWeight": 67.5},
  {"date": "2026-07-03", "actualWeight": 70},
  {"date": "2026-07-17", "actualWeight": 65.5},
  {"date": "2026-07-20", "actualWeight": 70},
  {"date": "2026-07-24", "actualWeight": 72.5},
  {"date": "2026-07-27", "actualWeight": 75},
  {"date": "2026-08-08", "actualWeight": 77.5},
  {"date": "2026-08-10", "actualWeight": 80},
  {"date": "2026-08-14", "actualWeight": 82.5}
];

// CLI argument parsing
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node merge_history.js <path_to_odin_export.json>');
  process.exit(1);
}

const absoluteInputPath = path.resolve(inputPath);
if (!fs.existsSync(absoluteInputPath)) {
  console.error('Error: File not found at ' + absoluteInputPath);
  process.exit(1);
}

let odinData;
try {
  const content = fs.readFileSync(absoluteInputPath, 'utf8');
  odinData = JSON.parse(content);
} catch (e) {
  console.error('Error reading or parsing JSON file: ' + e.message);
  process.exit(1);
}

// Ensure basic data structure exists
if (!odinData.profile) odinData.profile = {};
if (!odinData.exercises) odinData.exercises = {};
if (!odinData.exercises.pullups) odinData.exercises.pullups = { currentWeight: 0, oneRM: 0, sessions: [] };
if (!odinData.exercises.dips) odinData.exercises.dips = { currentWeight: 0, oneRM: 0, sessions: [] };
if (!odinData.exercises.pullups.sessions) odinData.exercises.pullups.sessions = [];
if (!odinData.exercises.dips.sessions) odinData.exercises.dips.sessions = [];

// Build Rogue session objects grouped by date
const rogueByDate = {};

ROGUE_PULLUPS.forEach(p => {
  if (!rogueByDate[p.date]) rogueByDate[p.date] = {};
  rogueByDate[p.date].pullups = p.actualWeight;
});

ROGUE_DIPS.forEach(d => {
  if (!rogueByDate[d.date]) rogueByDate[d.date] = {};
  rogueByDate[d.date].dips = d.actualWeight;
});

const dates = Object.keys(rogueByDate).sort();

// Convert Rogue entries into Odin skill_a session objects
const convertedRoguePullupsSessions = [];
const convertedRogueDipsSessions = [];

dates.forEach(date => {
  const entry = rogueByDate[date];
  const puWeight = entry.pullups;
  const dipWeight = entry.dips;

  const loggedSets = {};
  if (puWeight !== undefined) {
    loggedSets.pullups = [
      { reps: 8, weight: puWeight },
      { reps: 8, weight: puWeight },
      { reps: 8, weight: puWeight }
    ];
  }
  if (dipWeight !== undefined) {
    loggedSets.dips = [
      { reps: 6, weight: dipWeight },
      { reps: 6, weight: dipWeight },
      { reps: 6, weight: dipWeight }
    ];
  }
  loggedSets.high_pullups = [
    { reps: 1, weight: 0 },
    { reps: 1, weight: 0 },
    { reps: 1, weight: 0 },
    { reps: 1, weight: 0 }
  ];

  const detail = {
    pullups: {
      weightUsed: puWeight !== undefined ? puWeight : 0,
      sets: puWeight !== undefined ? [8, 8, 8] : [],
      progressed: true
    },
    dips: {
      weightUsed: dipWeight !== undefined ? dipWeight : 0,
      sets: dipWeight !== undefined ? [6, 6, 6] : [],
      progressed: true
    },
    highPullups: {
      sets: [1, 1, 1, 1]
    }
  };

  const sessRecord = {
    date: date,
    type: 'skill_a',
    wasUnscheduled: false,
    loggedSets: loggedSets,
    detail: detail,
    skillA: detail
  };

  if (puWeight !== undefined) {
    convertedRoguePullupsSessions.push(sessRecord);
  }
  if (dipWeight !== undefined) {
    convertedRogueDipsSessions.push(sessRecord);
  }
});

// Helper to merge and deduplicate sessions
function mergeSessions(existingSessions, newSessions) {
  const map = new Map();
  // Existing first
  existingSessions.forEach(s => {
    const key = s.date + '_' + (s.type || 'skill_a');
    map.set(key, s);
  });
  // New sessions add if not present
  newSessions.forEach(s => {
    const key = s.date + '_' + (s.type || 'skill_a');
    if (!map.has(key)) {
      map.set(key, s);
    }
  });
  const merged = Array.from(map.values());
  merged.sort((a, b) => a.date.localeCompare(b.date));
  return merged;
}

const totalInitialOdinEntries = new Set([
  ...odinData.exercises.pullups.sessions.map(s => s.date + '_' + s.type),
  ...odinData.exercises.dips.sessions.map(s => s.date + '_' + s.type)
]).size;

odinData.exercises.pullups.sessions = mergeSessions(odinData.exercises.pullups.sessions, convertedRoguePullupsSessions);
odinData.exercises.dips.sessions = mergeSessions(odinData.exercises.dips.sessions, convertedRogueDipsSessions);

const totalFinalEntries = new Set([
  ...odinData.exercises.pullups.sessions.map(s => s.date + '_' + s.type),
  ...odinData.exercises.dips.sessions.map(s => s.date + '_' + s.type)
]).size;

// Write merged JSON output
const outputPath = path.join(path.dirname(absoluteInputPath), 'merged_odin.json');
fs.writeFileSync(outputPath, JSON.stringify(odinData, null, 2), 'utf8');

// Verify output file is valid JSON
try {
  JSON.parse(fs.readFileSync(outputPath, 'utf8'));
} catch (e) {
  console.error('Verification Failed: Written merged_odin.json is not valid JSON! Error: ' + e.message);
  process.exit(1);
}

console.log('--- MERGE COMPLETE SUMMARY ---');
console.log('Rogue entries added: ' + dates.length);
console.log('Odin entries existed: ' + totalInitialOdinEntries);
console.log('Total after merge: ' + totalFinalEntries);
console.log('Successfully written valid JSON to: ' + outputPath);
