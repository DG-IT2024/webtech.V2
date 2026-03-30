// src/server.ts
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './routes/index'
import connectDB from './config/database'
import { applySecurity } from "./middleware/security";

// Load environment variables first
dotenv.config();

console.log('CLIENT_URL:', process.env.CLIENT_URL);

const app = express();
// Apply security middleware
applySecurity(app);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://www.raisesystemph.com',
  'https://raisesystemph.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Mount all API routes under /api
app.use('/aims', apiRouter);
app.listen(process.env.PORT);