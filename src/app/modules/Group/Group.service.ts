/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import mongoose from 'mongoose';
import { Group } from './Group.model';
import { TImageFiles, TGroup, TPost } from './Group.interface';
import { User } from '../User/user.model';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { groupSearchableFields } from './Group.constant';

const createGroup = async (files: TImageFiles, payload: TGroup) => {
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

  payload.members = [payload.user];

  const result = await Group.create(payload);

  return result;
};

const createGroupPost = async (
  files: TImageFiles,
  groupId: string,
  payload: TPost,
) => {
  const member = await User.findById(payload.user);
  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }

  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group Not found!');
  }

  const memberId = new mongoose.Types.ObjectId(member._id);

  const existMember = group.members.includes(memberId);
  if (!existMember) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group member Not found!');
  }

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

  const result = await Group.findByIdAndUpdate(
    groupId,
    {
      $push: {
        posts: {
          user: payload.user,
          title: payload.title,
          instructions: payload.instructions,
          image: payload.image,
          tags: payload.tags,
          upvote: payload.upvote,
          downvote: payload.downvote,
          status: payload.status,
        },
      },
    },
    { new: true },
  );

  return result;
};

const getAllGroup = async (query: Record<string, unknown>) => {
  const groupQuery = new QueryBuilder(
    Group.find({ status: { $ne: 'unpublished' } }).populate(
      'user posts.comment.user members',
    ),
    query,
  )
    .search(groupSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await groupQuery.modelQuery;
  const meta = await groupQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getAllGroupForStatusChange = async () => {
  const result = await Group.find();

  return result;
};

const getAllMyGroup = async (id: string, query: Record<string, unknown>) => {
  const groupQuery = new QueryBuilder(
    Group.find({ status: { $ne: 'unpublished' }, user: id }).populate('user'),
    query,
  )
    .search(groupSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await groupQuery.modelQuery;
  const meta = await groupQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleGroup = async (id: string) => {
  const result = await Group.findById(id).populate('user posts.comment.user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group Not found!');
  }

  return result;
};

const updateGroup = async (id: string, payload: TGroup) => {
  const group = await Group.findById(id);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group Not found!');
  }

  const result = await Group.findByIdAndUpdate(
    id,
    {
      name: payload.name,
      image: payload.image,
    },
    { new: true },
  );

  return result;
};

const deleteGroup = async (id: string) => {
  const group = await Group.findById(id);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group Not found!');
  }

  const result = await Group.findByIdAndDelete(id);

  return result;
};

// const updateComment = async (
//   id: string,
//   payload: { postId: string; user: string; comment: string },
// ) => {
//   const group = await Group.findById(id, {"posts.$._id": payload.postId});

//   if (!group) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
//   }

//   // Convert user to ObjectId
//   const userId = new mongoose.Types.ObjectId(payload.user);

//   const existComment = group?.posts?.comment.find(
//     (comment) => comment.user.toString() === payload.user,
//   );
//   // console.log(existComment);
//   let result;
//   if (existComment) {
//     result = await Recipe.findByIdAndUpdate(id, {
//       comment: payload,
//     });
//   } else {
//     result = await Recipe.findByIdAndUpdate(
//       id,
//       { $push: { comment: { user: userId, comment: payload.comment } } },
//       { new: true }, // Return the updated document
//     );
//   }

//   return result;
// };

// const deleteComment = async (id: string, commentId: string) => {
//   const result = await Recipe.findByIdAndUpdate(
//     id,
//     { $pull: { comment: { _id: commentId } } },
//     { new: true },
//   );

//   return result;
// };

// const updateUpvote = async (id: string, payload: { upvote: string }) => {
//   const recipe = await Recipe.findById(id);
//   const user = await User.findById(payload.upvote);

//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
//   }

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
//   }

//   const userUpvote = recipe.upvote.find(
//     (upvote: { equals: (arg0: string) => any }) =>
//       upvote.equals(payload.upvote),
//   );

//   if (userUpvote) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Already upvoted!');
//   }

//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();

//     await Recipe.findByIdAndUpdate(
//       id,
//       { $pull: { downvote: payload.upvote } },
//       { new: true, session },
//     );

//     const result = await Recipe.findByIdAndUpdate(
//       id,
//       { $addToSet: { upvote: { $each: [payload.upvote] } } },
//       { new: true, session },
//     );

//     await session.commitTransaction();
//     await session.endSession();

//     return result;
//   } catch (error: any) {
//     session.abortTransaction();
//     session.endSession();
//     throw new Error(error);
//   }
// };

// const updateDownvote = async (id: string, payload: { downvote: string }) => {
//   const recipe = await Recipe.findById(id);
//   const user = await User.findById(payload.downvote);

//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
//   }

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
//   }

//   const userDownvote = recipe.downvote.find(
//     (downvote: { equals: (arg0: string) => any }) =>
//       downvote.equals(payload.downvote),
//   );

//   if (userDownvote) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Already downvoted!');
//   }

//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();

//     await Recipe.findByIdAndUpdate(
//       id,
//       { $pull: { upvote: payload.downvote } },
//       { new: true, session },
//     );

//     const result = await Recipe.findByIdAndUpdate(
//       id,
//       { $addToSet: { downvote: { $each: [payload.downvote] } } },
//       { new: true, session },
//     );

//     await session.commitTransaction();
//     await session.endSession();

//     return result;
//   } catch (error: any) {
//     session.abortTransaction();
//     session.endSession();
//     throw new Error(error);
//   }
// };

// const updateGroupStatus = async (id: string, payload: { status: string }) => {
//   const recipe = await Recipe.findById(id);

//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe Not found!');
//   }

//   const result = await Recipe.findByIdAndUpdate(
//     id,
//     { status: payload.status },
//     { new: true },
//   );

//   return result;
// };

export const groupServices = {
  createGroup,
  createGroupPost,
  getAllGroup,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  // updateComment,
  // deleteComment,
  // updateUpvote,
  // updateDownvote,
  // updateRecipeStatus,
  getAllMyGroup,
  // getMyRecipeTags,
  // getAllRecipeTags,
  getAllGroupForStatusChange,
};
