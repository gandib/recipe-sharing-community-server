import { Model, Types } from 'mongoose';

export type TUserRole = 'admin' | 'user';
export type TUserStatus = 'blocked' | 'unblocked';
export type TUserMembership = 'basic' | 'premium';

export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  image: string;
  bio: string;
  status: TUserStatus;
  follower: Types.ObjectId;
  following: Types.ObjectId;
  membership: TUserMembership;
  transactionId: string;
  subscriptionValidity: string;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
