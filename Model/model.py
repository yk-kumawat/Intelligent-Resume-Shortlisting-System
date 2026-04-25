import pandas as pd
import numpy as np
import joblib
import faiss
from sentence_transformers import SentenceTransformer
from utils import clean_text, extract_text
from ner_utils import extract_years_of_experience, extract_education_level

VECTORIZER_MODEL = 'all-MiniLM-L6-v2'
FAISS_INDEX_PATH = "faiss_index.bin"
CLASSIFIER_PATH = "category_classifier.pkl"
MAPPING_PATH = "id_mapping.pkl"

# Initialize models globally
print("Loading Models...")
try:
    sentence_model = SentenceTransformer(VECTORIZER_MODEL)
    classifier = joblib.load(CLASSIFIER_PATH)
    index = faiss.read_index(FAISS_INDEX_PATH)
    mappings = joblib.load(MAPPING_PATH)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Warning: Models not fully trained/found. Run train_models.py first. Error: {e}")
    sentence_model, classifier, index, mappings = None, None, None, None

def rank_resumes(job_description_text, top_k=5):
    """
    Ranks resumes against the provided job description using Semantic Search 
    and applies experience/education weighting.
    """
    if index is None or classifier is None:
        print("Models not loaded. Cannot rank.")
        return pd.DataFrame()

    print("\n--- Processing Job Description ---")
    
    # Extract Expected Experience & Education from RAW Text
    jd_expected_exp = extract_years_of_experience(job_description_text)
    jd_expected_edu = extract_education_level(job_description_text)
    print(f"JD Requirements -> Exp: {jd_expected_exp} yrs | Edu Level (Score): {jd_expected_edu}")

    # Clean JD Text for Vector Embeddings
    jd_clean = clean_text(job_description_text)

    # Generate JD Embedding
    jd_embedding = sentence_model.encode([jd_clean])
    jd_embedding = np.array(jd_embedding).astype('float32')

    # Predict Category
    predicted_category = classifier.predict(jd_embedding)[0]
    print(f"Predicted Category for JD: {predicted_category}")

    # Semantic Search using Vector DB
    # Search a larger pool (e.g. 50) to allow for re-ranking
    k_search = min(50, len(mappings['id']))
    
    # FAISS search
    distances, indices = index.search(jd_embedding, k_search)
    
    results = []
    for num, idx in enumerate(indices[0]):
        if idx == -1: continue # invalid
        
        resume_id = mappings['id'][idx]
        category = mappings['category'][idx]
        resume_str = mappings['resume_str'][idx]
        resume_html = mappings.get('resume_html', [''] * len(mappings['id']))[idx]
        
        # Calculate Base Semantic Similarity
        # L2 Distance normalization mapping to roughly 0-100 score
        cosine_sim = 1.0 - (distances[0][num] / 4.0) 
        base_score = max(0.0, round(cosine_sim * 100, 2))
        
        # Category check
        if category != predicted_category:
            base_score = base_score * 0.5 # 50% penalty for category mismatch
            
        # Parse candidate's stats
        candidate_exp = extract_years_of_experience(resume_str)
        candidate_edu = extract_education_level(resume_str)
        
        # Apply Multipliers
        exp_multiplier = 1.0
        if jd_expected_exp > 0:
            if candidate_exp >= jd_expected_exp:
                exp_multiplier = 1.20 # 20% boost for meeting experience
            else:
                exp_multiplier = 0.80 # 20% penalty for not meeting or 0 experience
            
        edu_multiplier = 1.0
        if candidate_edu >= jd_expected_edu and jd_expected_edu > 0:
            edu_multiplier = 1.05
        
        final_score = round(base_score * exp_multiplier * edu_multiplier, 2)
        final_score = min(final_score, 99.9)
        
        results.append({
            "ID": resume_id,
            "Category": category,
            "Base_Score": base_score,
            "Exp": candidate_exp,
            "Edu": candidate_edu,
            "Final_Score": final_score,
            "Resume_html": resume_html
        })
        
    df_results = pd.DataFrame(results)
    if not df_results.empty:
        df_results = df_results.sort_values(by="Final_Score", ascending=False).head(top_k)
        
    return df_results

if __name__ == "__main__":
    job_description = """
    We are hiring an Information Technology professional with 5+ years of experience in
    software development, Python, Java, SQL, database management. Must have a Master degree.
    """
    
    top_resumes = rank_resumes(job_description, top_k=5)
    
    if not top_resumes.empty:
        print("\n=== Top Recommended Candidates ===")
        print(top_resumes.to_string(index=False))
