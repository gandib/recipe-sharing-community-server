import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendEmail';
import auth from '../../middlewares/auth';
import { recipeValidations } from './Recipe.validation';
import { recipeControllers } from './Recipe.controller';

const router = express.Router();

router.post(
  '/create-recipe',
  upload.fields([{ name: 'file' }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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

router.get('/:email', recipeControllers.getSingleRecipe);

router.patch(
  '/:id',
  validateRequest(recipeValidations.updateRecipeValidationSchema),
  recipeControllers.updateRecipe,
);

router.delete('/:id', recipeControllers.deleteRecipe);

router.patch(
  '/rating/:id',
  validateRequest(recipeValidations.updateRecipeRatingValidationSchema),
  recipeControllers.postRating,
);

router.patch(
  '/comment/:id',
  validateRequest(recipeValidations.updateRecipeCommentValidationSchema),
  recipeControllers.updateComment,
);

router.delete('/comment/:id', recipeControllers.deleteComment);

router.patch(
  '/upvote/:id',
  validateRequest(recipeValidations.updateRecipeUpvoteValidationSchema),
  recipeControllers.updateUpvote,
);

router.patch(
  '/downvote/:id',
  validateRequest(recipeValidations.updateRecipeDownvoteValidationSchema),
  recipeControllers.updateDownvote,
);

router.patch(
  '/status/:id',
  // auth('admin'),
  validateRequest(recipeValidations.updateRecipeStatusValidationSchema),
  recipeControllers.updateRecipeStatus,
);

export const recipeRoutes = router;
