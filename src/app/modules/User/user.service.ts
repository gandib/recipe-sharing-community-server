/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/appError';
import config from '../../config';
import { createToken, verifyToken } from './user.utils';
import { sendEmail } from '../../utils/sendEmail';
import bcrypt from 'bcrypt';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createUser = async (file: any, payload: TUser) => {
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
  }

  try {
    if (file) {
      const imageName = `${payload?.email}${payload?.name}`;
      const path = file?.path;

      // send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.image = secure_url as string;
    }
  } catch (error) {
    console.log(error);
  }

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

const updateUser = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = User.findByIdAndUpdate(
    id,
    {
      name: payload.name,
      password: payload.password,
      image: payload.image,
      bio: payload.bio,
      membership: payload.membership,
      transactionId: payload.transactionId,
      subscriptionValidity: payload.subscriptionValidity,
    },
    { new: true },
  );

  return result;
};

const updateFollower = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = User.findByIdAndUpdate(
    id,
    { $addToSet: { follower: { $each: [payload.follower] } } },
    { new: true },
  );

  return result;
};

const updateFollowing = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  //for deleting
  // const result = User.findByIdAndUpdate(
  //   id,
  //   { $pull: { following: payload.following } },
  //   { new: true },
  // );

  const result = User.findByIdAndUpdate(
    id,
    { $addToSet: { following: { $each: [payload.following] } } },
    { new: true },
  );

  return result;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = User.findByIdAndDelete(id);

  return result;
};

const updateUserStatus = async (id: string, payload: TUser) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = User.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  );

  return result;
};

const forgetPassword = async (userId: string) => {
  //checking if the user is exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // checking user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already blocked!');
  }

  // create token and send to the user
  const jwtPayload = {
    name: user?.name,
    role: user?.role,
    email: user?.email,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user?._id}&token=${resetToken}`;
  sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  //checking if the user is exists
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // checking user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already blocked!');
  }

  // check if the token is valid and id is same of user
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId, role } = decoded;

  if (payload?.id !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: userId,
      role: role,
    },
    {
      password: newHashedPassword,
    },
  );
};

export const userServices = {
  createUser,
  loginUser,
  getUser,
  forgetPassword,
  resetPassword,
  updateUser,
  updateUserStatus,
  updateFollower,
  updateFollowing,
  deleteUser,
};
