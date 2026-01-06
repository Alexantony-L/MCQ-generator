import { Request, Response } from 'express';
import * as authService from '../services/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
