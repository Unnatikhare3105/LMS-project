import  userModels from "../models/user.models.js";
import CustomError from "../utils/customError.js";

export const createUser = async ({email, mobile, password, username}) => {
  if (!email || !mobile || !password || !username ) {
    throw new CustomError("All fields are required", 400);
  }

  const existingUser = await userModels.findOne({
    $or: [
      {
        email,
        accountVerified: true,
      },
      {
        mobile,
        accountVerified: true,
      },
    ],
  });

  if (existingUser) {
    return new CustomError("User already exists", 400);
  }

  const hashPassword = await userModels.hashPassword(password);
  if (!hashPassword) {
    throw new CustomError("Error hashing password", 500);
  }

  const userData = {
    username,
    email,
    mobile,
    password: hashPassword
  };

  const newUser = await userModels.create(userData);
  
  await newUser.save();

  const token = await newUser.generateAuthToken();
  if (!token) {
    throw new CustomError("Error generating token", 500);
  }

  return { user: newUser, token };

};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new CustomError("All fields are required", 422);
  }

  const user = await userModels.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  console.log(user)

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 401);
  }
  console.log(isMatch)
 
  return user;
};

