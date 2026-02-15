import json
import random

# Load the JSON data
with open(r'c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\final_questionnaire_data.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Group questions by category for better distribution, or just round-robin
# For now, let's just distribute them evenly across 45 days
days_count = 45
questions_per_day = {}

# Initialize days
for i in range(1, days_count + 1):
    questions_per_day[i] = []

# Distribute questions
# We'll use a round-robin approach to ensure even filling
current_day = 1
for idx, q in enumerate(questions):
    # Create the question object
    question_obj = {
        "id": f"q_{current_day}_{len(questions_per_day[current_day]) + 1}",
        "day": current_day,
        "text": q["text"].strip().replace('"', '\\"'),
        "options": [opt.strip().replace('"', '\\"') for opt in q["options"]],
        "correctAnswer": q["correctAnswer"],
        "explanation": q["explanation"].strip().replace('"', '\\"') if q["explanation"] else f"Correct answer: {q['options'][q['correctAnswer']]}",
        "category": q["category"].strip() if q["category"] else "General"
    }
    
    questions_per_day[current_day].append(question_obj)
    
    # Move to next day
    current_day += 1
    if current_day > days_count:
        current_day = 1

# Generate TypeScript content
ts_content = "import type { Question } from '../types/question.types';\n\n"
ts_content += "export const MOCK_QUESTIONS: Record<number, Question[]> = {\n"

for day, day_questions in questions_per_day.items():
    if not day_questions:
        continue
        
    ts_content += f"  {day}: [\n"
    for q in day_questions:
        ts_content += "    {\n"
        ts_content += f"      id: '{q['id']}',\n"
        ts_content += f"      day: {q['day']},\n"
        ts_content += f"      text: \"{q['text']}\",\n"
        ts_content += "      options: [\n"
        for opt in q['options']:
            ts_content += f"        \"{opt}\",\n"
        ts_content += "      ],\n"
        ts_content += f"      correctAnswer: {q['correctAnswer']},\n"
        ts_content += f"      explanation: \"{q['explanation']}\",\n"
        ts_content += f"      category: '{q['category']}',\n"
        ts_content += "    },\n"
    ts_content += "  ],\n"

ts_content += "};\n\n"
ts_content += "export const getQuestionsForDay = (day: number): Question[] => {\n"
ts_content += "  return MOCK_QUESTIONS[day] || [];\n"
ts_content += "};\n"

# Write to file
output_path = r'c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\frontend\src\features\questions\data\mockQuestions.ts'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated mockQuestions.ts with {len(questions)} questions distributed across {days_count} days.")
