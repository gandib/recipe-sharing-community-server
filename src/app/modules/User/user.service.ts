import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/appError';
import config from '../../config';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);
  const result = await User.findById(user?._id).select('-password');

  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  // checking if password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not matched!');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_secret_expire_in,
  });

  const userData = await User.findOne({ email: payload?.email });

  return {
    token,
    userData,
  };
};

const getUser = async (email: string) => {
  const result = await User.findOne({ email: email }).select('-password');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }
  return result;
};

export const userServices = {
  createUser,
  loginUser,
  getUser,
};
