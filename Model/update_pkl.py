import joblib
import pandas as pd
import os

print("Loading id_mapping.pkl...")
mappings = joblib.load('id_mapping.pkl')
print(f"Loaded {len(mappings['id'])} mappings.")

print("Loading resumes.csv...")
df = pd.read_csv('Data/resumes.csv')
html_dict = dict(zip(df['ID'], df['Resume_html']))

print("Mapping HTML to IDs...")
mappings['resume_html'] = [html_dict.get(i, "") for i in mappings['id']]

print("Saving updated id_mapping.pkl...")
joblib.dump(mappings, 'id_mapping.pkl')
print("Successfully added resume_html to mappings.")
