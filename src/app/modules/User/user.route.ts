import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
import { userControllers } from './user.controller';
import { upload } from '../../utils/sendEmail';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/signup',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidations.createUserValidationSchema),
  userControllers.createUser,
);

router.post(
  '/login',
  validateRequest(userValidations.loginValidationSchema),
  userControllers.loginUser,
);

router.post(
  '/forget-password',
  validateRequest(userValidations.forgetPasswordValidationSchema),
  userControllers.forgetPassword,
);

router.patch(
  '/update-user',
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

router.patch(
  '/update-follower',
  validateRequest(userValidations.updateFollowerValidationSchema),
  userControllers.updateFollower,
);

router.patch(
  '/update-following',
  validateRequest(userValidations.updateFollowingValidationSchema),
  userControllers.updateFollowing,
);

router.patch(
  '/update-user-status',
  auth('admin'),
  validateRequest(userValidations.updateUserStatusValidationSchema),
  userControllers.updateUser,
);

router.delete('/delete-user', auth('admin'), userControllers.deleteUser);

router.post(
  '/reset-password',
  validateRequest(userValidations.resetPasswordValidationSchema),
  userControllers.resetPassword,
);

router.get('/:email', userControllers.getUser);

export const userRoutes = router;
