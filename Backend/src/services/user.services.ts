import userModels from '@models/user.models';
import CustomError from '@utils/customError';

export const createUser = async ({
  email,
  mobile,
  password,
  username,
}: {
  email: string;
  mobile: string;
  password: string;
  username: string;
}) => {
  if (!email || !mobile || !password || !username) {
    throw new CustomError('All fields are required', 400);
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
    throw new CustomError('User already exists', 400);
  }

  const userData = {
    name: username,
    email,
    mobile,
    password,
  };

  const newUser = await userModels.create(userData);

  const token = await newUser.generateAuthToken();
  if (!token) {
    throw new CustomError('Error generating token', 500);
  }

  return { user: newUser, token };
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new CustomError('All fields are required', 422);
  }

  const user = await userModels.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError('Invalid credentials', 401);
  }

  return user;
};