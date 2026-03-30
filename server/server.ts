// src/server.ts
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './routes/index'
import connectDB from './config/database'
import { applySecurity } from "./middleware/security";

// Load environment variables first
dotenv.config();

const app = express();
// Apply security middleware
applySecurity(app);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Mount all API routes under /api
app.use('/aims', apiRouter);
app.listen(process.env.PORT);