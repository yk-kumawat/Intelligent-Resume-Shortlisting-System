import re
import spacy
import fitz  # PyMuPDF
import docx

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

# Custom stop words specifically for resumes/JDs
resume_stop_words = {
    "responsible", "for", "successfully", "duties", "including", "working",
    "knowledge", "excellent", "proven", "track", "record", "ability",
    "skills", "experience", "managed", "developed", "using", "work", "team"
}

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
    return text

def extract_text_from_docx(docx_path):
    text = ""
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX {docx_path}: {e}")
    return text

def extract_text(file_path):
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        return extract_text_from_docx(file_path)
    elif file_path.lower().endswith(".txt"):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        print("Unsupported file format.")
        return ""

def clean_text(text):
    # Basic cleaning
    text = text.lower()
    # Keep numbers because they are useful for "years of experience"
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Advanced NLP cleaning with spaCy (Lemmatization and Stop words)
    if nlp is not None:
        doc = nlp(text)
        tokens = []
        for token in doc:
            # Keep tokens if they are not stop words AND (longer than 1 char OR are a digit)
            if not token.is_stop and token.text not in resume_stop_words:
                if len(token.text) > 1 or token.text.isdigit():
                    tokens.append(token.lemma_)
        return " ".join(tokens)
    else:
        return text
