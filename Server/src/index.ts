import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 3000;
const MODEL_API_URL = 'http://localhost:5000/rank';
const MONGO_URI = process.env.MongoDB_URI as string;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB connection ─────────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send('Server is running 🚀');
});

// Auth
app.use('/auth', authRoutes);

// ML ranking proxy
app.post('/rank', async (req, res) => {
  try {
    const { job_description, top_k } = req.body;

    if (!job_description) {
      res.status(400).json({ error: 'Job description is required' });
      return;
    }

    const response = await axios.post(MODEL_API_URL, {
      job_description,
      top_k: top_k || 5,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Error communicating with model API:', error.message);
    res.status(500).json({
      error: 'Failed to communicate with model API',
      details: error.response?.data || error.message,
    });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});