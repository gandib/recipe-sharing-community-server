import { z } from 'zod';

const createGroupPostCommentSchema = z.object({
  postId: z.string({ required_error: 'Post Id is required!' }),
  user: z.string({ required_error: 'User Id is required!' }),
  comment: z.string({ required_error: 'Comment is required!' }),
});

const createGroupPostSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User Id is required!' }),
    title: z.string({ required_error: 'Title is required!' }),
    instructions: z.string({ required_error: 'Instructions is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
    tags: z.string({ required_error: 'Tag is required!' }),
  }),
});

const createGroupValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User Id is required!' }),
    name: z.string({ required_error: 'Name is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
  }),
});

const updateGroupValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updateGroupPostValidationSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required!' }),
    title: z.string().optional(),
    instructions: z.string().optional(),
    image: z.string().optional(),
    tags: z.string().optional(),
  }),
});

const updateGroupPostCommentValidationSchema = z.object({
  body: createGroupPostCommentSchema,
});

const updateGroupPostUpvoteValidationSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required!' }),
    upvote: z.string(),
  }),
});

const updateGroupPostDownvoteValidationSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required!' }),
    downvote: z.string(),
  }),
});

const updateGroupStatusValidationSchema = z.object({
  body: z.object({
    status: z.string(),
  }),
});

const updateGroupPostStatusValidationSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required!' }),
    status: z.string(),
  }),
});

export const groupValidations = {
  createGroupValidationSchema,
  updateGroupValidationSchema,
  createGroupPostSchema,
  updateGroupPostValidationSchema,
  updateGroupPostCommentValidationSchema,
  updateGroupPostUpvoteValidationSchema,
  updateGroupPostDownvoteValidationSchema,
  updateGroupStatusValidationSchema,
  updateGroupPostStatusValidationSchema,
};
