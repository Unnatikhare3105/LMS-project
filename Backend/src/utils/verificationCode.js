import config from "../config/config.js";
import CustomError from "./customError.js";
import { sendMail } from "./emailService.js";
import userModels from "../models/user.models.js";

// const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export const sendVerificationCode = async (
  verificationCode,
  email,
  verificationMethod,
  res
) => {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      await sendMail(email, "Verification Code", message);
      console.log("Email sent successfully");
      return res.status(200).json({
        success: true,
        message: `Verification code sent successfully ${verificationCode}`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Verification code failed to send.${error}`,
    });
  }
};

export const verifyOTP = async (email, otp) => {
  // const { email, otp } = req.body;

  try {
    const userAllEntries = await userModels.find({
      $or: [
        {
          email,
          accountVerified: false,
        }
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries.length) {
      return next(new CustomError("User not found.", 404));
    }

    let user;


      user = userAllEntries[0];

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();

    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();
    console.log(currentTime);
    console.log(verificationCodeExpire);
    if (currentTime > verificationCodeExpire) {
      return next(new CustomError("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    // sendToken(user, 200, "Account Verified.", res);
  } 
  catch (error) {
    return new CustomError("Internal Server Error.", 500);
  }
};

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}
