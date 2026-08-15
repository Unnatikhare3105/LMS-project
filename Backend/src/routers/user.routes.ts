//backend/src/routers/user.routes.ts

import express from 'express';
import * as userController from '../controllers/user.controller';
import { authUser } from '../middlewares/auth.middleware';
import { authLimiter } from '@middlewares/rateLimiter.middleware';

const router = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post(
  '/register',
  userController.registerController
);
router.post(
  '/login',
  authLimiter,
  userController.loginByPasswordController
);
router.post(
  '/login/send-otp',
  authLimiter,
  userController.sendOTPController
);
router.post(
  '/login/verify-otp',
  authLimiter,
  userController.verifyOTPController
);
router.post(
  '/forgot-password',
  authLimiter,
  userController.forgotPasswordController
);
router.post(
  '/forgot-password/verify-otp',
  userController.verifyForgotPasswordOTPController
);
router.post(
  '/reset-password',
  userController.resetPasswordController
);

// ─── Protected ────────────────────────────────────────────────────────────────
router.post(
  '/logout',
  authUser,
  userController.logoutController
);
router.get(
  '/profile',
  authUser,
  userController.getProfileController
);
router.get(
  '/activity',
  authUser,
  userController.getActivityChartController
);

export default router;