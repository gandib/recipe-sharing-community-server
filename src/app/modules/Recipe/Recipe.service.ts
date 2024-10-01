/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import mongoose from 'mongoose';
import { Recipe } from './Recipe.model';
import { TImageFiles, TRecipe } from './Recipe.interface';
import { User } from '../User/user.model';

const createRecipe = async (files: TImageFiles, payload: TRecipe) => {
  const { file } = files;
  try {
    if (file) {
      const paths: string[] = [];
      const imageUrl: string[] = [];
      file.map((image: any) => {
        paths.push(image?.path);
      });

      // send image to cloudinary
      for (let index = 0; index < paths.length; index++) {
        const element2 = paths[index];
        const { secure_url } = await sendImageToCloudinary(element2);
        imageUrl.push(secure_url as string);
      }
      payload.image = imageUrl as string[];
    }
  } catch (error) {
    console.log(error);
  }

  const result = await Recipe.create(payload);

  return result;
};

const getAllRecipe = async () => {
  const result = await Recipe.find();

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  return result;
};

const getSingleRecipe = async (id: string) => {
  const result = await Recipe.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  return result;
};

const updateRecipe = async (id: string, payload: TRecipe) => {
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  const result = await Recipe.findByIdAndUpdate(
    id,
    {
      title: payload.title,
      image: payload.image,
      tags: payload.tags,
      contentType: payload.contentType,
    },
    { new: true },
  );

  return result;
};

const deleteRecipe = async (id: string) => {
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  const result = await Recipe.findByIdAndDelete(id);

  return result;
};

const postRating = async (
  id: string,
  payload: { user: string; rating: number },
) => {
  const result = await Recipe.findByIdAndUpdate(id, { rating: payload });
  return result;
};

const updateComment = async (
  id: string,
  payload: { user: string; comment: string },
) => {
  const result = await Recipe.findByIdAndUpdate(id, { comment: payload });
  return result;
};

const deleteComment = async (id: string) => {
  const result = await Recipe.findByIdAndDelete(id);
  return result;
};

const updateUpvote = async (id: string, payload: string) => {
  const recipe = await Recipe.findById(id);
  const user = await User.findById(payload);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const result = await Recipe.findByIdAndUpdate(
    id,
    { $addToSet: { upvote: { $each: [payload] } } },
    { new: true },
  );

  return result;
};

const updateDownvote = async (id: string, payload: string) => {
  const recipe = await Recipe.findById(id);
  const user = await User.findById(payload);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Recipe.findByIdAndUpdate(
      id,
      { $pull: { upvote: payload } },
      { new: true, session },
    );

    const result = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { downvote: { $each: [payload] } } },
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const updateRecipeStatus = async (id: string, payload: { status: string }) => {
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  const result = await Recipe.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  );

  return result;
};

export const recipeServices = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  postRating,
  updateComment,
  deleteComment,
  updateUpvote,
  updateDownvote,
  updateRecipeStatus,
};
