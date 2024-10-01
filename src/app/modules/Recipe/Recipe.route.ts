import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendEmail';
import auth from '../../middlewares/auth';
import { recipeValidations } from './Recipe.validation';
import { recipeControllers } from './Recipe.controller';

const router = express.Router();

router.post(
  '/create-recipe',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(recipeValidations.createRecipeValidationSchema),
  recipeControllers.createRecipe,
);

router.get('/', recipeControllers.getAllRecipe);

router.get('/:id', recipeControllers.getSingleRecipe);

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
  validateRequest(recipeValidations.updateRecipeRatingValidationSchema),
  recipeControllers.updateComment,
);

router.delete('/comment/:id', recipeControllers.deleteComment);

router.patch(
  '/upvote',
  validateRequest(recipeValidations.updateRecipeUpvoteValidationSchema),
  recipeControllers.updateUpvote,
);

router.patch(
  '/downvote',
  validateRequest(recipeValidations.updateRecipeDownvoteValidationSchema),
  recipeControllers.updateDownvote,
);

router.patch(
  '/status',
  auth('admin'),
  validateRequest(recipeValidations.updateRecipeStatusValidationSchema),
  recipeControllers.updateDownvote,
);

export const recipeRoutes = router;
