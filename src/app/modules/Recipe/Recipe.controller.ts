import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { recipeServices } from './Recipe.service';
import { TImageFiles } from './Recipe.interface';

const createRecipe = catchAsync(async (req, res) => {
  const result = await recipeServices.createRecipe(
    req.files as TImageFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe created successfully',
    data: result,
  });
});

const getAllRecipe = catchAsync(async (req, res) => {
  const result = await recipeServices.getAllRecipe();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe retrieved successfully',
    data: result,
  });
});

const getSingleRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeServices.getSingleRecipe(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe retrieved successfully',
    data: result,
  });
});

const updateRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeServices.updateRecipe(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe updated successfully',
    data: result,
  });
});

const deleteRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeServices.deleteRecipe(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe deleted successfully',
    data: result,
  });
});

const postRating = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeServices.postRating(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe rating created successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeServices.updateComment(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await recipeServices.deleteComment(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe comment deleted successfully',
    data: result,
  });
});

const updateUpvote = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await recipeServices.updateUpvote(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe comment deleted successfully',
    data: result,
  });
});

const updateDownvote = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await recipeServices.updateDownvote(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe updated successfully',
    data: result,
  });
});

const updateRecipeStatus = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await recipeServices.updateRecipeStatus(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe status updated successfully',
    data: result,
  });
});

export const recipeControllers = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  postRating,
  updateComment,
  deleteComment,
  updateUpvote,
  updateDownvote,
  updateRecipeStatus,
};
