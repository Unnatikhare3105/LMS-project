import * as userServices from "../services/user.services.js";
import CustomError from "../utils/customError.js";
import * as verification from "../utils/verificationCode.js";
import userModels from "../models/user.models.js";
import redis from "../services/redis.services.js";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res, next) => {
  try {
    const { username, email, mobile, password } = req.body;
    console.log(req.body);

    if (!username || !email || !mobile || !password ) {
      return next(new CustomError("All fields are required.", 400));
    }

    function validatePhoneNumber(mobile) {
      const phoneRegex = /^\+91\d{10}$/;
      return phoneRegex.test(mobile);
    }

    if (!validatePhoneNumber(mobile)) {
      return next(new ErrorHandler("Invalid phone number.", 400));
    }

    const user = await userServices.createUser({
      email,
      mobile,
      password,
      username
    });

    // const verificationCode = await userModels.generateVerificationCode();

    // if (!verificationCode) {
    //   return next(new CustomError("Error generating verification code.", 500));
    // }

    // const isVerificationCodeSent = await verification.sendVerificationCode(
    //   verificationCode,
    //   email,
    //   verificationMethod,
    //   res
    // );

    // if (!isVerificationCodeSent) {
    //   return next(new CustomError("Error sending verification code.", 500));
    // }

    if (!user) {
      return next(new CustomError("User registration failed.", 500));
    }
  
    res.cookie("token", user.token, {
      httpOnly: true,
      sameSite: "none",
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.user,
      token: user.token
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserByPasswordController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError("All fields are required.", 400));
    }

    const user = await userServices.loginUser({ email, password });

    if (!user) {
      return next(new CustomError("Invalid credentials.", 401));
    }

    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError("Error generating token.", 500));
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserByOTPController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new CustomError("Email is required.", 400));
    }
    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }
    const verificationCode = await userModels.generateVerificationCode();

    await verification.sendVerificationCode(
      verificationCode,
      email,
      "email",
      res
    );

    const isVerificationCodeSent = await verification.sendVerificationCode(
      verificationCode,
      email,
      "email",
      res
    );
    if (!isVerificationCodeSent) {
      return next(new CustomError("Error sending verification code.", 500));
    }
    res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTPController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new CustomError("Email and OTP are required.", 400));
    }

    const verificationResult = await verification.verifyOTP(email, otp);

    if (!verificationResult) {
      return next(new CustomError("Verification failed. Invalid OTP.", 400));
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    user.accountVerified = true;
    await user.save();

    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError("Error generating token.", 500));
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Login successful.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const tokenKey = `blacklisted:${token}`;
    //ttl is the time to live for the token in Redis
    const ttl = await redis.ttl(tokenKey);

    if (ttl > 0) {
      return res.status(400).json({ message: "Token is already blacklisted" });
    }

    if (ttl === -1) {
      return res
        .status(400)
        .json({ message: "Token found but has no expiry set" });
    }

    if (ttl === -2) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const timeRemaining = decoded.exp * 1000 - Date.now();
      await redis.set(tokenKey, "true", "EX", Math.floor(timeRemaining / 1000));
      //delete the cookie
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
      });

      return res.status(200).json({ message: "User logout successful" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordByOTPController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new CustomError("Email is required.", 400));
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    const otp = await userModels.generateVerificationCode();
    if (!otp) {
      return next(new CustomError("Error generating OTP.", 500));
    }

    const isSent = await verification.sendVerificationCode(
      otp,
      email,
      "email",
      res
    );
    if (!isSent) {
      return next(new CustomError("Error sending OTP.", 500));
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email for password reset.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOTPController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new CustomError("Email and OTP are required.", 400));
    }

    const isValid = await verification.verifyOTP(email, otp);
    if (!isValid) {
      return next(new CustomError("Invalid or expired OTP.", 400));
    }

    // Optionally, set a flag in DB or cache to allow password reset
    await redis.set(`reset-allowed:${email}`, "true", "EX", 600); // 10 min

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordByOTPController = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new CustomError("Email and new password are required.", 400));
    }

    const allowed = await redis.get(`reset-allowed:${email}`);
    if (!allowed) {
      return next(res.json(
        new CustomError({
          success: false,
          message: "OTP verification required before resetting password.",
          statusCode: 400
        } ))
      );
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    user.password = await userModels.hashPassword(newPassword);
    await user.save();

    await redis.del(`reset-allowed:${email}`);

    // Generate new token and set in cookie
    const token = await user.generateAuthToken();
    if (!token) {
      return next(new CustomError("Error generating token.", 500));
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      token,
    });
  } catch (error) {
    next(error);
  }
};
