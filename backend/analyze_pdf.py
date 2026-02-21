import pypdf
import os

pdf_path = r"c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\Prometrii.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    
    # Extract text from pages 2 and 3
    for i in range(1, 3):
        page = reader.pages[i]
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text)
        print("\n")
        
except Exception as e:
    print(f"Error reading PDF: {e}")
