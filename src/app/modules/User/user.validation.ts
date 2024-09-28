import { z } from 'zod';
import { role } from './user.constant';

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
    email: z.string().optional(),
    password: z.string().optional(),
    role: z.enum([...role] as [string, ...string[]]).optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
  loginValidationSchema,
};
