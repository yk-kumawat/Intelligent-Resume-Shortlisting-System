import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3000;
const MODEL_API_URL = "http://localhost:5000/rank";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/rank", async (req, res) => {
  try {
    const { job_description, top_k } = req.body;

    if (!job_description) {
      res.status(400).json({ error: "Job description is required" });
      return;
    }

    // Call the Flask API
    const response = await axios.post(MODEL_API_URL, {
      job_description,
      top_k: top_k || 5,
    });

    // Send the results back
    res.json(response.data);
  } catch (error: any) {
    console.error("Error communicating with model API:", error.message);
    res.status(500).json({
      error: "Failed to communicate with model API",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});