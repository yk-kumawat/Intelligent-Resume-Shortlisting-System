import pandas as pd
import numpy as np
import joblib
import faiss
from sentence_transformers import SentenceTransformer
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report
import os
from utils import clean_text

VECTORIZER_MODEL = 'all-MiniLM-L6-v2'
FAISS_INDEX_PATH = "faiss_index.bin"
CLASSIFIER_PATH = "category_classifier.pkl"
MAPPING_PATH = "id_mapping.pkl"

def train_and_build_index(resume_csv_path):
    print("Loading datasets...")
    df = pd.read_csv(resume_csv_path)
    df.columns = df.columns.str.strip()
    df = df[["ID", "Resume_str", "Category"]].dropna()

    print(f"Total resumes: {len(df)}")
    
    # Clean text (using a simpler split to avoid excessive spacy processing time during bulk embedding)
    # Sentence-transformers handles raw text well, but basic cleaning removes excess spaces.
    print("Preparing text...")
    df['Cleaned'] = df['Resume_str'].apply(lambda x: clean_text(str(x)))

    print("Loading Sentence Transformer...")
    model = SentenceTransformer(VECTORIZER_MODEL)

    print("Generating Embeddings (this may take a few minutes)...")
    # Convert to list and encode
    embeddings = model.encode(df['Cleaned'].tolist(), show_progress_bar=True)
    embeddings = np.array(embeddings).astype('float32')

    print("Training Category Classifier (LinearSVC)...")
    classifier = LinearSVC(random_state=42, max_iter=2000)
    classifier.fit(embeddings, df['Category'])
    
    # Print accuracy on train set
    preds = classifier.predict(embeddings)
    print("Classification Report on Training Data:")
    print(classification_report(df['Category'], preds))

    joblib.dump(classifier, CLASSIFIER_PATH)
    print(f"Classifier saved to {CLASSIFIER_PATH}")

    print("Building FAISS Vector Database...")
    dimension = embeddings.shape[1] # usually 384 for all-MiniLM-L6-v2
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    faiss.write_index(index, FAISS_INDEX_PATH)
    print(f"FAISS index saved to {FAISS_INDEX_PATH}")

    print("Saving ID mappings...")
    # Map faiss row index to resume metadata (ID and Category)
    # Storing more metadata to avoid loading the whole CSV during inference if we just need ID
    mappings = {
        'id': df['ID'].tolist(),
        'category': df['Category'].tolist(),
        'resume_str': df['Resume_str'].tolist() 
    }
    joblib.dump(mappings, MAPPING_PATH)
    print(f"Mappings saved to {MAPPING_PATH}")
    print("Training and Indexing Complete!")

if __name__ == "__main__":
    train_and_build_index("Data/resumes.csv")
