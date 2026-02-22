/**
 * Question Bank Cleanup Script v2
 * Preserves original day (topic) assignments — only removes broken questions.
 */

const fs = require('fs');
const path = require('path');

const BACKUP = path.join(__dirname, 'final_questionnaire_data_backup.json');
const OUTPUT = path.join(__dirname, 'frontend/src/features/questions/data/final_questionnaire_data.json');

// Load from BACKUP (the original unmodified data)
const raw = JSON.parse(fs.readFileSync(BACKUP, 'utf-8'));
console.log(`Loaded: ${raw.length} questions`);

let removed = { noAnswer: 0, shortText: 0, longOpts: 0, fewOpts: 0, duplicates: 0, badIndex: 0 };

// Step 1: Filter out broken questions, KEEP original day assignments
let clean = raw.filter(q => {
    // No correct answer
    if (q.correctAnswer === -1 || q.correctAnswer === null || q.correctAnswer === undefined) {
        removed.noAnswer++;
        return false;
    }

    // correctAnswer index out of bounds
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        removed.badIndex++;
        return false;
    }

    // Very short/meaningless question text
    if (q.text.trim().length < 15) {
        removed.shortText++;
        return false;
    }

    // Fewer than 3 options
    if (q.options.length < 3) {
        removed.fewOpts++;
        return false;
    }

    // Options with other questions/explanations merged in
    if (q.options.some(o => o.length > 150)) {
        removed.longOpts++;
        return false;
    }

    return true;
});

// Step 2: Remove duplicates (same question text), keep first occurrence
const seen = new Set();
clean = clean.filter(q => {
    const key = q.text.trim().toLowerCase();
    if (seen.has(key)) {
        removed.duplicates++;
        return false;
    }
    seen.add(key);
    return true;
});

console.log(`\nRemoved:`);
console.log(`  No correct answer:   ${removed.noAnswer}`);
console.log(`  Bad answer index:    ${removed.badIndex}`);
console.log(`  Short/garbled text:  ${removed.shortText}`);
console.log(`  Merged options:      ${removed.longOpts}`);
console.log(`  Too few options:     ${removed.fewOpts}`);
console.log(`  Duplicates:          ${removed.duplicates}`);
console.log(`  TOTAL REMOVED:       ${raw.length - clean.length}`);
console.log(`\nClean questions: ${clean.length}`);

// Stats per day (keeping original day assignments)
const perDay = {};
clean.forEach(q => { perDay[q.day] = (perDay[q.day] || 0) + 1; });
console.log(`\nQuestions per day (original topic mapping preserved):`);
Object.keys(perDay).sort((a, b) => a - b).forEach(day => {
    // Get categories for this day
    const cats = {};
    clean.filter(q => q.day == day).forEach(q => { cats[q.category] = (cats[q.category] || 0) + 1; });
    const catStr = Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}(${n})`).join(', ');
    console.log(`  Day ${day}: ${perDay[day]} Qs — ${catStr}`);
});

// Write output
fs.writeFileSync(OUTPUT, JSON.stringify(clean, null, 4));
console.log(`\nWritten ${clean.length} clean questions to:\n  ${OUTPUT}`);
