import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`[${req.method}] ${req.path} → ${err.message}`);

  // Known custom error
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({ success: false, message: messages.join(', ') });
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({ success: false, message: `${field} already exists.` });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token.' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    return;
  }

  // Generic fallback
  res.status(500).json({ success: false, message: 'Internal server error.' });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
};