import json
import os

# Load the JSON data
json_path = r'c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\final_questionnaire_data.json'
output_path = r'c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\frontend\src\features\questions\data\mockQuestions.ts'

with open(json_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Group questions by day
days_count = 45
questions_per_day = {i: [] for i in range(1, days_count + 1)}

# Distribute questions round-robin
current_day = 1
valid_count = 0

for idx, q in enumerate(questions):
    try:
        # Validate options and answer index
        options = [opt.strip().replace('"', '\\"').replace('\n', ' ') for opt in q.get("options", [])]
        if not options:
            print(f"Skipping Q{idx}: No options")
            continue
            
        correct_idx = int(q.get("correctAnswer", 0))
        if correct_idx < 0 or correct_idx >= len(options):
            print(f"Warning Q{idx}: Invalid answer index {correct_idx} for {len(options)} options. Defaulting to 0.")
            correct_idx = 0
            
        text = q.get("text", "Question").strip().replace('"', '\\"').replace('\n', ' ')
        explanation = q.get("explanation", "")
        if explanation:
            explanation = explanation.strip().replace('"', '\\"').replace('\n', ' ')
        else:
            explanation = f"Correct answer: {options[correct_idx]}"
            
        category = q.get("category", "General").strip().replace('\n', '')

        # Create the question object
        question_obj = {
            "id": f"q_{current_day}_{idx}",
            "day": current_day,
            "text": text,
            "options": options,
            "correctAnswer": correct_idx,
            "explanation": explanation,
            "category": category
        }
        
        questions_per_day[current_day].append(question_obj)
        valid_count += 1
        
        # Round-robin day assignment
        current_day += 1
        if current_day > days_count:
            current_day = 1
            
    except Exception as e:
        print(f"Error processing Q{idx}: {e}")

# Generate TypeScript content
ts_lines = [
    "import type { Question } from '../types/question.types';",
    "",
    "export const MOCK_QUESTIONS: Record<number, Question[]> = {",
]

for day in range(1, days_count + 1):
    day_qs = questions_per_day[day]
    if not day_qs:
        continue
        
    ts_lines.append(f"  {day}: [")
    for q in day_qs:
        ts_lines.append("    {")
        ts_lines.append(f"      id: '{q['id']}',")
        ts_lines.append(f"      day: {q['day']},")
        ts_lines.append(f"      text: \"{q['text']}\",")
        ts_lines.append("      options: [")
        for opt in q['options']:
            ts_lines.append(f"        \"{opt}\",")
        ts_lines.append("      ],")
        ts_lines.append(f"      correctAnswer: {q['correctAnswer']},")
        ts_lines.append(f"      explanation: \"{q['explanation']}\",")
        ts_lines.append(f"      category: '{q['category']}',")
        ts_lines.append("    },")
    ts_lines.append("  ],")

ts_lines.append("};")
ts_lines.append("")
ts_lines.append("export const getQuestionsForDay = (day: number): Question[] => {")
ts_lines.append("  return MOCK_QUESTIONS[day] || [];")
ts_lines.append("};")

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(ts_lines))

print(f"Successfully processed {valid_count} questions.")
