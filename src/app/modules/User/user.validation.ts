import { z } from 'zod';
import { membership, role, status } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
    role: z.enum([...role] as [string, ...string[]], {
      required_error: 'Role is required!',
    }),
    image: z.string({ required_error: 'Image is required!' }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    password: z.string().optional(),
    role: z.enum([...role] as [string, ...string[]]).optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
    status: z.enum([...status] as [string, ...string[]]).optional(),
    membership: z.enum([...membership] as [string, ...string[]]).optional(),
    follower: z.string().optional(),
    following: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    _id: z.string({
      required_error: 'User _id is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    _id: z.string({
      required_error: 'User id is required!',
    }),
    password: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
