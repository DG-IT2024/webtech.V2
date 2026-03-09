// src/controllers/user.controller.ts
import { Request, Response } from 'express';

export const getAllUsers = (req: Request, res: Response) => {
  res.json({ message: "Fetching all users..." });
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Fetching user with ID: ${id}` });
};