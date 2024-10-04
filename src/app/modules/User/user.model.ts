import mongoose, { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { membership, role, status } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>({
  name: { type: String, required: [true, 'Name is required!'] },
  email: { type: String, required: [true, 'Email is required!'], unique: true },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    select: 0,
  },
  role: {
    type: String,
    enum: {
      values: role,
      message: '{VALUE} is not valid!',
    },
  },
  image: { type: String, required: [true, 'Image is required!'] },
  bio: { type: String, default: '' },
  status: {
    type: String,
    enum: {
      values: status,
      message: '{VALUE} is not valid!',
    },
    default: 'unblocked',
  },
  follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  membership: {
    type: String,
    enum: {
      values: membership,
      message: '{VALUE} is not valid!',
    },
    default: 'basic',
  },
  transactionId: { type: String, default: '' },
  subscriptionValidity: { type: String, default: '' },
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

// userSchema.pre('find', function (next) {
//   this.find({ status: { $ne: 'blocked' } });
//   next();
// });

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
