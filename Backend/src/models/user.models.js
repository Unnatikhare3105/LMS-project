import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountVerified:{
      type: Boolean,
      default: false,
    },
    verificationCode:Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.statics.hashPassword = async function (password) {
  if (!password) {
    throw new Error("Password is required");
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
  // return hashedPassword;
};

userSchema.methods.comparePassword = async function (password) {
  if (!password) {
    throw new Error("Password is required");
  }
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { id: this._id },
     config.JWT_SECRET, 
     {expiresIn: config.JWT_EXPIRATION}
    );
    if (!token) {
        throw new Error("Error generating token");
    }
  return token;
};

userSchema.statics.verifyToken = async function (token) {
    if (!token) {
        throw new Error("Token is required");
    }const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) {
        throw new Error("Invalid token");
    }
    return decoded;
};

userSchema.statics.generateVerificationCode =  function () {
  function generateRandomSixDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, 0);

    return parseInt(firstDigit + remainingDigits);
  }

  const verificationCode = generateRandomSixDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + config.VERIFICATION_CODE_EXPIRES_IN;

  return verificationCode;
};

const user = mongoose.model("user", userSchema);

export default user;

