import express from "express";
const router = express.Router();
import * as userController from "../controllers/user.controller.js";

router.post("/register", userController.registerUserController);
router.post("/login-by-password", userController.loginUserByPasswordController);
router.post("/login-by-otp", userController.loginUserByOTPController);
router.post("/verify-otp", userController.verifyOTPController);
router.post("/logout", userController.userLogoutController);
router.post("/profile", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Profile route is working",
  });
});
router.post("/forgot-password", userController.forgotPasswordByOTPController);
router.post("/verify-forgot-password-otp", userController.verifyForgotPasswordOTPController);
router.post("/reset-password", userController.resetPasswordByOTPController);
export default router;
