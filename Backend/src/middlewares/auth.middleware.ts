// Backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import config from '@config/config';
import userModel from '@models/user.models';
import redis from 'services/redis.services';
// import redisClient from "@services/redis.service";

// Extend Express Request to include user property
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
) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized User' });
    }

    const isBlackListed = await redis.get(`bl_${token}`);

    if (isBlackListed) {
      res.cookie('token', '');
      return res.status(401).send({ error: 'Unauthorized User' });
    }

    const decoded: any = await userModel.verifyAuthToken(token);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    res.status(401).send({ error: 'Unauthorized User' });
  }
};