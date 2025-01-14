/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type TComment = {
  user: Types.ObjectId;
  comment: string;
};

export type TPost = {
  user: Types.ObjectId;
  title: string;
  instructions: string;
  image: string[];
  comment: TComment[];
  upvote: Types.ObjectId[];
  downvote: Types.ObjectId[];
  tags: string;
  status: TGroupStatus;
};

export type TContentType = 'free' | 'premium';
export type TGroupStatus = 'published' | 'unpublished';
export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export interface TGroup {
  payload: Types.ObjectId[];
  user: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  posts: TPost[];
  image: string[];
  status: TGroupStatus;
}
