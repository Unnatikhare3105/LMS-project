import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import { getRedis } from '@services/redis.service';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {
   const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;

    console.log('token found:', !!token); // should log true

    if (!token) {
      res.status(401).json({ success: false, message: 'User not found.' }); // token hi nahi to seedha reject
      return;
    }

    const isBlacklisted = await getRedis().get(`blacklisted:${token}`);

    if (isBlacklisted) {
      res.clearCookie('token');
      res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
      return;
    }
    console.log('blacklist check passed'); // if redis was the issue, this won't log

    const decoded: any = UserModel.verifyAuthToken(token);
    console.log('decoded:', decoded); // confirm JWT decodes correctly


    // try {
    //   const token =
    //     req.cookies?.token ||
    //     (req.headers.authorization?.startsWith('Bearer ')
    //       ? req.headers.authorization.split(' ')[1]
    //       : null);

    //   if (!token) {
    //     res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
    //     return;
    //   }

    //   // Check Redis blacklist (O(1) lookup – scales well)
    //   // const isBlacklisted = await redis.get(`blacklisted:${token}`);
    //   const isBlacklisted = await getRedis().get(`blacklisted:${token}`);
    //   if (isBlacklisted) {
    //     res.clearCookie('token');
    //     res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    //     return;
    //   }

    //   const decoded: any = UserModel.verifyAuthToken(token);



    const user = await UserModel.findById(decoded._id).select('-password').lean().exec();

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found.' });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// ─── Role guard ────────────────────────────────────────────────────────────────

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }
    next();
  };
};