// Backend/src/routers/user.routes.ts
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import * as userController from '@controllers/user.controller';

router.post('/register', userController.registerUserController);
router.post('/login-by-password', userController.loginUserByPasswordController);
router.post('/login-by-otp', userController.loginUserByOTPController);
router.post('/verify-otp', userController.verifyOTPController);
router.post('/logout', userController.userLogoutController);
router.post('/profile', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'Profile route is working',
  });
});
router.post('/forgot-password', userController.forgotPasswordByOTPController);
router.post(
  '/verify-forgot-password-otp',
  userController.verifyForgotPasswordOTPController
);
router.post('/reset-password', userController.resetPasswordByOTPController);

export default router;