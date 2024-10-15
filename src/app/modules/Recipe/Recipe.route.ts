import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { recipeValidations } from './Recipe.validation';
import { recipeControllers } from './Recipe.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/create-recipe',
  multerUpload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('user', 'admin'),
  validateRequest(recipeValidations.createRecipeValidationSchema),
  recipeControllers.createRecipe,
);

router.get('/', recipeControllers.getAllRecipe);

router.get('/all-recipe', recipeControllers.getAllRecipeForStatusChange);

router.get(
  '/my-recipe',
  auth('user', 'admin'),
  recipeControllers.getAllMyRecipe,
);

router.get(
  '/my-tags',
  auth('user', 'admin'),
  recipeControllers.getMyRecipeTags,
);

router.get('/all-tags', recipeControllers.getAllRecipeTags);

router.get('/:id', auth('user', 'admin'), recipeControllers.getSingleRecipe);

router.patch(
  '/:id',
  auth('user', 'admin'),
  validateRequest(recipeValidations.updateRecipeValidationSchema),
  recipeControllers.updateRecipe,
);

router.delete('/:id', auth('user', 'admin'), recipeControllers.deleteRecipe);

router.patch(
  '/rating/:id',
  auth('user', 'admin'),
  validateRequest(recipeValidations.updateRecipeRatingValidationSchema),
  recipeControllers.postRating,
);

router.patch(
  '/comment/:id',
  auth('user', 'admin'),
  validateRequest(recipeValidations.updateRecipeCommentValidationSchema),
  recipeControllers.updateComment,
);

router.delete(
  '/comment/:id',
  auth('user', 'admin'),
  recipeControllers.deleteComment,
);

router.patch(
  '/upvote/:id',
  auth('user', 'admin'),
  validateRequest(recipeValidations.updateRecipeUpvoteValidationSchema),
  recipeControllers.updateUpvote,
);

router.patch(
  '/downvote/:id',
  auth('user', 'admin'),
  validateRequest(recipeValidations.updateRecipeDownvoteValidationSchema),
  recipeControllers.updateDownvote,
);

router.patch(
  '/status/:id',
  auth('admin'),
  validateRequest(recipeValidations.updateRecipeStatusValidationSchema),
  recipeControllers.updateRecipeStatus,
);

export const recipeRoutes = router;
