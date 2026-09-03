const fs = require('fs');
const path = require('path');

const ROGUE_PULLUPS = [
  { "date": "2026-06-21", "actualWeight": 5 },
  { "date": "2026-06-22", "actualWeight": 6.25 },
  { "date": "2026-06-26", "actualWeight": 6.75 },
  { "date": "2026-06-29", "actualWeight": 7.25 },
  { "date": "2026-07-03", "actualWeight": 10 },
  { "date": "2026-07-17", "actualWeight": 10 },
  { "date": "2026-07-20", "actualWeight": 12.5 },
  { "date": "2026-07-24", "actualWeight": 15 },
  { "date": "2026-07-27", "actualWeight": 17.5 },
  { "date": "2026-08-08", "actualWeight": 20 },
  { "date": "2026-08-10", "actualWeight": 21.25 },
  { "date": "2026-08-14", "actualWeight": 21.25 }
];

const ROGUE_DIPS = [
  { "date": "2026-06-21", "actualWeight": 60 },
  { "date": "2026-06-22", "actualWeight": 62.5 },
  { "date": "2026-06-26", "actualWeight": 65 },
  { "date": "2026-06-29", "actualWeight": 67.5 },
  { "date": "2026-07-03", "actualWeight": 70 },
  { "date": "2026-07-17", "actualWeight": 65.5 },
  { "date": "2026-07-20", "actualWeight": 70 },
  { "date": "2026-07-24", "actualWeight": 72.5 },
  { "date": "2026-07-27", "actualWeight": 75 },
  { "date": "2026-08-08", "actualWeight": 77.5 },
  { "date": "2026-08-10", "actualWeight": 80 },
  { "date": "2026-08-14", "actualWeight": 82.5 }
];

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

if (!odinData.profile) odinData.profile = {};
if (!odinData.exercises) odinData.exercises = {};
if (!odinData.exercises.pullups) odinData.exercises.pullups = { currentWeight: 0, oneRM: 0, sessions: [] };
if (!odinData.exercises.dips) odinData.exercises.dips = { currentWeight: 0, oneRM: 0, sessions: [] };
if (!odinData.exercises.pullups.sessions) odinData.exercises.pullups.sessions = [];
if (!odinData.exercises.dips.sessions) odinData.exercises.dips.sessions = [];

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
const convertedPullupsSessions = [];
const convertedDipsSessions = [];

dates.forEach(date => {
  const entry = rogueByDate[date];
  const puWeight = entry.pullups;
  const dipWeight = entry.dips;

  const loggedSets = {};
  if (puWeight !== undefined) {
    loggedSets.pullups = [
      { reps: 6, weight: puWeight },
      { reps: 6, weight: puWeight },
      { reps: 6, weight: puWeight }
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
      sets: puWeight !== undefined ? [6, 6, 6] : [],
      progressed: false  // unknown — don't show misleading +2.5kg badges
    },
    dips: {
      weightUsed: dipWeight !== undefined ? dipWeight : 0,
      sets: dipWeight !== undefined ? [6, 6, 6] : [],
      progressed: false
    },
    highPullups: { sets: [1, 1, 1, 1] }
  };

  const sessRecord = {
    date: date,
    type: 'skill_a',
    wasUnscheduled: false,
    loggedSets: loggedSets,
    detail: detail,
    skillA: detail
  };

  if (puWeight !== undefined) convertedPullupsSessions.push(sessRecord);
  if (dipWeight !== undefined) convertedDipsSessions.push(sessRecord);
});

function mergeSessions(existingSessions, newSessions) {
  const map = new Map();
  existingSessions.forEach(s => {
    map.set(s.date + '_' + (s.type || 'skill_a'), s);
  });
  newSessions.forEach(s => {
    const key = s.date + '_' + (s.type || 'skill_a');
    if (!map.has(key)) map.set(key, s);
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

const initialCount = new Set([
  ...odinData.exercises.pullups.sessions.map(s => s.date + '_' + s.type),
  ...odinData.exercises.dips.sessions.map(s => s.date + '_' + s.type)
]).size;

// Only touch sessions — never overwrite currentWeight or oneRM
odinData.exercises.pullups.sessions = mergeSessions(odinData.exercises.pullups.sessions, convertedPullupsSessions);
odinData.exercises.dips.sessions = mergeSessions(odinData.exercises.dips.sessions, convertedDipsSessions);

const finalCount = new Set([
  ...odinData.exercises.pullups.sessions.map(s => s.date + '_' + s.type),
  ...odinData.exercises.dips.sessions.map(s => s.date + '_' + s.type)
]).size;

const outputPath = path.join(path.dirname(absoluteInputPath), 'merged_odin.json');
fs.writeFileSync(outputPath, JSON.stringify(odinData, null, 2), 'utf8');

try {
  JSON.parse(fs.readFileSync(outputPath, 'utf8'));
} catch (e) {
  console.error('Verification failed: ' + e.message);
  process.exit(1);
}

console.log('--- MERGE COMPLETE ---');
console.log('Rogue entries processed: ' + dates.length);
console.log('Odin entries before: ' + initialCount);
console.log('Total after merge: ' + finalCount);
console.log('Output: ' + outputPath);