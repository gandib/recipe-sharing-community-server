import jwt, { JwtPayload } from 'jsonwebtoken';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import mongoose, { Types } from 'mongoose';
import { Recipe } from './Recipe.model';
import { TImageFiles, TRecipe } from './Recipe.interface';
import { User } from '../User/user.model';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { recipeSearchableFields } from './Recipe.constant';

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
        const path = paths[index];
        const { secure_url } = await sendImageToCloudinary(path);
        imageUrl.push(secure_url as string);
      }
      payload.image = imageUrl as string[];
    }
  } catch (error) {
    console.log(error);
  }

  if (payload.image[0] === ' ') {
    payload.image = [config.recipe_photo!];
  }

  const result = await Recipe.create(payload);

  return result;
};

const getAllRecipe = async (
  query: Record<string, unknown>,
  accessToken: string,
) => {
  if (accessToken !== 'undefined') {
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(
        accessToken,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      if (decoded && decoded?.membership === 'premium') {
        delete query.contentType;
      }
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // console.log(query);

  const recipeQuery = new QueryBuilder(
    Recipe.find({ status: { $ne: 'unpublished' } }).populate(
      'user comment.user',
    ),
    query,
  )
    .search(recipeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getAllRecipeForStatusChange = async () => {
  const result = await Recipe.find();

  return result;
};

const getAllMyRecipe = async (id: string, query: Record<string, unknown>) => {
  const recipeQuery = new QueryBuilder(
    Recipe.find({ status: { $ne: 'unpublished' }, user: id }).populate('user'),
    query,
  )
    .search(recipeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyRecipeTags = async (id: string) => {
  const result = await Recipe.find({
    status: { $ne: 'unpublished' },
    user: id,
  }).select('tags');

  const allTags = result.map((recipe) => recipe.tags).flat();
  const uniqueTags = [...new Set(allTags)];

  return uniqueTags;
};

const getAllRecipeTags = async (token: string) => {
  const accessToken = token.split(' ')[1];

  let result;
  if (accessToken === 'undefined') {
    return (result = await Recipe.aggregate([
      {
        $match: {
          status: { $ne: 'unpublished' },
          contentType: { $ne: 'premium' },
        },
      },
      {
        $group: {
          _id: '$tags',
          tags: { $first: '$tags' },
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
        },
      },
    ]));
  }

  const decoded = jwt.verify(
    accessToken,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded?.membership !== 'premium') {
    return (result = await Recipe.aggregate([
      {
        $match: {
          status: { $ne: 'unpublished' },
          contentType: { $ne: 'premium' },
        },
      },
      {
        $group: {
          _id: '$tags',
          tags: { $first: '$tags' },
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
        },
      },
    ]));
  }

  if (decoded && decoded?.membership === 'premium') {
    return (result = await Recipe.aggregate([
      {
        $match: { status: { $ne: 'unpublished' } },
      },
      {
        $group: {
          _id: '$tags',
          tags: { $first: '$tags' },
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
        },
      },
    ]));
  }

  return result;
};

const getSingleRecipe = async (id: string) => {
  const result = await Recipe.findById(id).populate('user comment.user');

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
      instructions: payload.instructions,
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
  payload: { user: Types.ObjectId; rating: number },
) => {
  const recipe = (await Recipe.findById(id)) as TRecipe;

  let result;

  const userRating = recipe.rating.find((r) => r.user.equals(payload.user));

  if (userRating) {
    result = await Recipe.findOneAndUpdate(
      { _id: id, 'rating.user': payload.user },
      { $set: { 'rating.$.rating': payload.rating } },
      { new: true },
    );
  } else {
    result = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { rating: payload } },
      { new: true },
    );
  }

  return result;
};

const updateComment = async (
  id: string,
  payload: { user: string; comment: string },
) => {
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Convert user to ObjectId
  const userId = new mongoose.Types.ObjectId(payload.user);

  const existComment = recipe?.comment.find(
    (comment) => comment.user.toString() === payload.user,
  );
  // console.log(existComment);
  let result;
  if (existComment) {
    result = await Recipe.findByIdAndUpdate(id, {
      comment: payload,
    });
  } else {
    result = await Recipe.findByIdAndUpdate(
      id,
      { $push: { comment: { user: userId, comment: payload.comment } } },
      { new: true }, // Return the updated document
    );
  }

  return result;
};

const deleteComment = async (id: string, commentId: string) => {
  const result = await Recipe.findByIdAndUpdate(
    id,
    { $pull: { comment: { _id: commentId } } },
    { new: true },
  );

  return result;
};

const updateUpvote = async (id: string, payload: { upvote: string }) => {
  const recipe = await Recipe.findById(id);
  const user = await User.findById(payload.upvote);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const userUpvote = recipe.upvote.find(
    (upvote: { equals: (arg0: string) => any }) =>
      upvote.equals(payload.upvote),
  );

  if (userUpvote) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already upvoted!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Recipe.findByIdAndUpdate(
      id,
      { $pull: { downvote: payload.upvote } },
      { new: true, session },
    );

    const result = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { upvote: { $each: [payload.upvote] } } },
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

const updateDownvote = async (id: string, payload: { downvote: string }) => {
  const recipe = await Recipe.findById(id);
  const user = await User.findById(payload.downvote);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const userDownvote = recipe.downvote.find(
    (downvote: { equals: (arg0: string) => any }) =>
      downvote.equals(payload.downvote),
  );

  if (userDownvote) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already downvoted!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Recipe.findByIdAndUpdate(
      id,
      { $pull: { upvote: payload.downvote } },
      { new: true, session },
    );

    const result = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { downvote: { $each: [payload.downvote] } } },
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
  getAllMyRecipe,
  getMyRecipeTags,
  getAllRecipeTags,
  getAllRecipeForStatusChange,
};
