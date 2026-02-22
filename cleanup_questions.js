/**
 * Question Bank Cleanup Script
 * Fixes data quality issues from PDF parsing:
 * 1. Removes questions with correctAnswer = -1 (no valid answer)
 * 2. Removes questions with very short/meaningless text (< 15 chars)
 * 3. Removes questions where options have other questions merged in (> 150 chars)
 * 4. Removes questions with fewer than 3 options (not real MCQs)
 * 5. Removes duplicate questions (same text)
 * 6. Re-distributes remaining questions evenly across 45 days
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'frontend/src/features/questions/data/final_questionnaire_data.json');
const OUTPUT = INPUT; // overwrite in place
const BACKUP = path.join(__dirname, 'final_questionnaire_data_backup.json');

// Load
const raw = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
console.log(`📦 Loaded: ${raw.length} questions`);

// Backup original
fs.writeFileSync(BACKUP, JSON.stringify(raw, null, 2));
console.log(`💾 Backup saved to: ${BACKUP}`);

let removed = { noAnswer: 0, shortText: 0, longOpts: 0, fewOpts: 0, duplicates: 0 };

// Step 1: Filter out broken questions
let clean = raw.filter(q => {
    // No correct answer
    if (q.correctAnswer === -1 || q.correctAnswer === null || q.correctAnswer === undefined) {
        removed.noAnswer++;
        return false;
    }

    // Very short/meaningless question text (likely truncated garbage)
    if (q.text.trim().length < 15) {
        removed.shortText++;
        return false;
    }

    // Fewer than 3 options (not a real MCQ)
    if (q.options.length < 3) {
        removed.fewOpts++;
        return false;
    }

    // Options with other questions/explanations merged in (> 150 chars)
    if (q.options.some(o => o.length > 150)) {
        removed.longOpts++;
        return false;
    }

    // correctAnswer index out of bounds
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        removed.noAnswer++;
        return false;
    }

    return true;
});

// Step 2: Remove duplicates (same question text)
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

console.log(`\n🧹 Removed:`);
console.log(`   No correct answer:  ${removed.noAnswer}`);
console.log(`   Short/garbled text: ${removed.shortText}`);
console.log(`   Merged options:     ${removed.longOpts}`);
console.log(`   Too few options:    ${removed.fewOpts}`);
console.log(`   Duplicates:         ${removed.duplicates}`);
console.log(`   TOTAL REMOVED:      ${raw.length - clean.length}`);
console.log(`\n✅ Clean questions remaining: ${clean.length}`);

// Step 3: Re-distribute across 45 days evenly
const DAYS = 45;
const perDay = Math.floor(clean.length / DAYS);
const remainder = clean.length % DAYS;

console.log(`📅 Distributing: ${perDay} per day (${remainder} days get +1)`);

let idx = 0;
for (let day = 1; day <= DAYS; day++) {
    const count = perDay + (day <= remainder ? 1 : 0);
    for (let j = 0; j < count && idx < clean.length; j++, idx++) {
        clean[idx].day = day;
    }
}

// Final stats
const finalPerDay = {};
clean.forEach(q => { finalPerDay[q.day] = (finalPerDay[q.day] || 0) + 1; });
const minDay = Math.min(...Object.values(finalPerDay));
const maxDay = Math.max(...Object.values(finalPerDay));
console.log(`📊 Per day range: ${minDay}–${maxDay} questions`);

// Write output
fs.writeFileSync(OUTPUT, JSON.stringify(clean, null, 4));
console.log(`\n🚀 Written ${clean.length} clean questions to:\n   ${OUTPUT}`);
