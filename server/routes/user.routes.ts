// src/routes/user.routes.ts
import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';

const router = Router();

// Routes are relative to where this is "mounted" in index.ts
router.get('/', getAllUsers);      // This will become /api/users/
router.get('/:id', getUserById);   // This will become /api/users/:id

export default router;