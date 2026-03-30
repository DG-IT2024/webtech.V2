// src/server.ts
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './routes/index'
import connectDB from './config/database'
import { applySecurity } from "./middleware/security";

const app = express();
// Apply security middleware
applySecurity(app);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// To secure the connection of the database
dotenv.config();
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Mount all API routes under /api
app.use('/aims', apiRouter);
app.listen(process.env.PORT);