import { Model, Types } from 'mongoose';

export type TUserRole = 'admin' | 'user';
export type TUserStatus = 'block' | 'unblock';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  image: string;
  bio: string;
  status: TUserStatus;
  follower: Types.ObjectId;
  following: Types.ObjectId;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
