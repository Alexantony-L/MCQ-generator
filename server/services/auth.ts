import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { connectToMongo } from '../utils/mongo';

export const register = async (name: string, email: string, password: string) => {
    await connectToMongo();
  const existingUser = await User.findOne({ email });

  console.log('Existing user:', existingUser);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user =await new User({ name, email, password });
  await user.save();

  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const login = async (email: string, password: string) => {
    await connectToMongo();
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};
