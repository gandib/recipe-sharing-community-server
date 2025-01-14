import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { groupValidations } from './Group.validation';
import { groupControllers } from './Group.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/create-group',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('user', 'admin'),
  validateRequest(groupValidations.createGroupValidationSchema),
  groupControllers.createGroup,
);

router.post(
  '/create-group-post/:groupId',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('user', 'admin'),
  validateRequest(groupValidations.createGroupPostSchema),
  groupControllers.createGroupPost,
);

router.get('/', groupControllers.getAllGroup);

router.get('/all-group', groupControllers.getAllGroupForStatusChange);

router.get('/my-group', auth('user', 'admin'), groupControllers.getAllMyGroup);

router.get('/:id', auth('user', 'admin'), groupControllers.getSingleGroup);

router.get(
  '/my-group-post/:groupId',
  auth('user', 'admin'),
  groupControllers.getAllMyGroupPost,
);

router.patch(
  '/:id',
  auth('user', 'admin'),
  validateRequest(groupValidations.updateGroupValidationSchema),
  groupControllers.updateGroup,
);

router.delete('/:id', auth('user', 'admin'), groupControllers.deleteGroup);

// router.patch(
//   '/comment/:id',
//   auth('user', 'admin'),
//   validateRequest(recipeValidations.updateRecipeCommentValidationSchema),
//   recipeControllers.updateComment,
// );

// router.delete(
//   '/comment/:id',
//   auth('user', 'admin'),
//   recipeControllers.deleteComment,
// );

// router.patch(
//   '/upvote/:id',
//   auth('user', 'admin'),
//   validateRequest(recipeValidations.updateRecipeUpvoteValidationSchema),
//   recipeControllers.updateUpvote,
// );

// router.patch(
//   '/downvote/:id',
//   auth('user', 'admin'),
//   validateRequest(recipeValidations.updateRecipeDownvoteValidationSchema),
//   recipeControllers.updateDownvote,
// );

// router.patch(
//   '/status/:id',
//   auth('admin'),
//   validateRequest(recipeValidations.updateRecipeStatusValidationSchema),
//   recipeControllers.updateRecipeStatus,
// );

export const groupRoutes = router;
