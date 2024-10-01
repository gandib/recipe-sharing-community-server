import { Types } from 'mongoose';

export type TRating = {
  user: Types.ObjectId;
  rating: number;
};

export type TComment = {
  user: Types.ObjectId;
  comment: string;
};

export type TContentType = 'free' | 'premium';
export type TRecipeStatus = 'published' | 'unpublished';
export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export interface TRecipe {
  user: Types.ObjectId;
  title: string;
  image: string[];
  rating: TRating;
  comment: TComment;
  upvote: Types.ObjectId;
  downvote: Types.ObjectId;
  tags: string;
  contentType: TContentType;
  status: TRecipeStatus;
}
