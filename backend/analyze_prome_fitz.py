import fitz  # PyMuPDF

pdf_path = r"c:\Users\HP\OneDrive\Desktop\antigravity\Prometric\Prome.pdf"

try:
    doc = fitz.open(pdf_path)
    print(f"Number of pages: {len(doc)}")
    
    # Extract text from pages 1-3
    for i in range(min(3, len(doc))):
        page = doc[i]
        text = page.get_text()
        print(f"--- Page {i+1} ---")
        print(text)
        print("\n")
        
except Exception as e:
    print(f"Error reading PDF: {e}")
