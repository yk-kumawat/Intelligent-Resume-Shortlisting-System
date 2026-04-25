import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

def extract_years_of_experience(text):
    """
    Extracts the maximum years of experience mentioned in the text using Regex.
    """
    pattern = r'(\d+)(?:\+)?\s*(?:years?|yrs?)(?:\s*of)?\s*experience'
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    if matches:
        try:
            years = [int(y) for y in matches]
            return max(years)
        except ValueError:
            pass
    return 0

def extract_education_level(text):
    """
    Returns a score indicating education level (Phd = 3, Master = 2, Bachelor = 1, None = 0).
    Useful for weighting candidates.
    """
    text_lower = text.lower()
    
    if re.search(r'\b(phd|doctorate|d\.phil|md|m\.d\.)\b', text_lower):
        return 3
    elif re.search(r'\b(master|ms|mba|m\.s|m\.b\.a|mtech|m\.tech|ma|m\.a\.)\b', text_lower):
        return 2
    elif re.search(r'\b(bachelor|bs|btech|b\.s|b\.tech|ba|b\.a\.|bsc|b\.sc)\b', text_lower):
        return 1
    return 0

def extract_entities(text):
    """
    Uses spaCy to extract named entities (ORG, PERSON, GPE, etc.)
    """
    if nlp is None:
        return []
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]
