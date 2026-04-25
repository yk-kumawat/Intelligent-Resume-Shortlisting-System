from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from model import rank_resumes

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route("/")
def home():
    return "Resume Ranking API is running!"

@app.route("/rank", methods=["POST"])
def rank():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        job_description = data.get("job_description", "")
        top_k = data.get("top_k", 5)

        if not job_description:
            return jsonify({"error": "Job description is required"}), 400

        results = rank_resumes(job_description, top_k)

        if results.empty:
            return jsonify({"message": "No results found", "results": []}), 200

        # Convert dataframe to dictionary
        return jsonify(results.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
