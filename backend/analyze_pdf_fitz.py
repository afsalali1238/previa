import fitz  # PyMuPDF
import re

pdf_path = r"c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\Prometrii.pdf"

try:
    doc = fitz.open(pdf_path)
    print(f"Number of pages: {len(doc)}")
    
    # Extract text from pages 2-4
    for i in range(1, 4):
        page = doc[i]
        text = page.get_text()
        print(f"--- Page {i+1} ---")
        print(text)
        print("\n")
        
except Exception as e:
    print(f"Error reading PDF: {e}")
