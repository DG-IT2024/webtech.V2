// src/server.ts
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './routes/index'
import connectDB from './config/database'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend port
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

const PORT = 8080;

// To secure the connection of the database
dotenv.config();
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Mount all API routes under /api
app.use('/aims', apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});