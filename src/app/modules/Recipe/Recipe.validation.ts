import { z } from 'zod';
import { contentType } from './Recipe.constant';

const createRecipeCommentSchema = z.object({
  user: z.string({ required_error: 'User Id is required!' }),
  comment: z.string({ required_error: 'Comment is required!' }),
});

const updateRecipeRatingSchema = z.object({
  user: z.string({ required_error: 'User Id is required!' }),
  rating: z.number({ required_error: 'Rating is required!' }),
});

const createRecipeValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User Id is required!' }),
    title: z.string({ required_error: 'Title is required!' }),
    instructions: z.string({ required_error: 'Instructions is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
    tags: z.string({ required_error: 'Tag is required!' }),
    contentType: z.enum([...contentType] as [string, ...string[]], {
      required_error: 'Content type is required!',
    }),
  }),
});

const updateRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    instructions: z.string().optional(),
    image: z.string().optional(),
    tags: z.string().optional(),
    contentType: z.enum([...contentType] as [string, ...string[]]).optional(),
  }),
});

const updateRecipeRatingValidationSchema = z.object({
  body: z.object({
    rating: updateRecipeRatingSchema,
  }),
});

const updateRecipeCommentValidationSchema = z.object({
  body: z.object({
    comment: createRecipeCommentSchema,
  }),
});

const updateRecipeUpvoteValidationSchema = z.object({
  body: z.object({
    Upvote: z.string(),
  }),
});

const updateRecipeDownvoteValidationSchema = z.object({
  body: z.object({
    Downvote: z.string(),
  }),
});

const updateRecipeStatusValidationSchema = z.object({
  body: z.object({
    status: z.string(),
  }),
});

export const recipeValidations = {
  createRecipeValidationSchema,
  updateRecipeValidationSchema,
  updateRecipeRatingValidationSchema,
  updateRecipeCommentValidationSchema,
  updateRecipeUpvoteValidationSchema,
  updateRecipeDownvoteValidationSchema,
  updateRecipeStatusValidationSchema,
};
