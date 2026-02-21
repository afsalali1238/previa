import pypdf
import os

pdf_path = r"c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\Prometrii.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Number of pages: {len(reader.pages)}")
    
    # Extract text from the first 5 pages to analyze structure
    for i in range(min(5, len(reader.pages))):
        page = reader.pages[i]
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text[:1000])  # Print first 1000 chars of each page
        print("\n")
        
except Exception as e:
    print(f"Error reading PDF: {e}")
