import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { groupServices } from './Group.service';
import { TImageFiles } from './Group.interface';

const createGroup = catchAsync(async (req, res) => {
  const result = await groupServices.createGroup(
    req.files as TImageFiles,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group is created successfully',
    data: result,
  });
});

const createGroupPost = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await groupServices.createGroupPost(
    req.files as TImageFiles,
    groupId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group post is created successfully',
    data: result,
  });
});

const getAllGroup = catchAsync(async (req, res) => {
  const result = await groupServices.getAllGroup(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const getAllGroupForStatusChange = catchAsync(async (req, res) => {
  const result = await groupServices.getAllGroupForStatusChange();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const getAllMyGroup = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await groupServices.getAllMyGroup(_id as string, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const getAllMyGroupPost = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const result = await groupServices.getAllMyGroupPost(groupId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group posts retrieved successfully',
    data: result,
  });
});

const getSingleGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await groupServices.getSingleGroup(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group retrieved successfully',
    data: result,
  });
});

const updateGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await groupServices.updateGroup(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group updated successfully',
    data: result,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await groupServices.deleteGroup(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Group deleted successfully',
    data: result,
  });
});

// const updateComment = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await recipeServices.updateComment(id as string, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe comment updated successfully',
//     data: result,
//   });
// });

// const deleteComment = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { commentId } = req.query;
//   const result = await recipeServices.deleteComment(
//     id as string,
//     commentId as string,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe comment deleted successfully',
//     data: result,
//   });
// });

// const updateUpvote = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await recipeServices.updateUpvote(id as string, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe upvoted successfully',
//     data: result,
//   });
// });

// const updateDownvote = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await recipeServices.updateDownvote(id as string, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe downvoted successfully',
//     data: result,
//   });
// });

// const updateRecipeStatus = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await recipeServices.updateRecipeStatus(
//     id as string,
//     req.body,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe status updated successfully',
//     data: result,
//   });
// });

export const groupControllers = {
  createGroup,
  createGroupPost,
  getAllGroup,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  // updateComment,
  // deleteComment,
  // updateUpvote,
  // updateDownvote,
  // updateRecipeStatus,
  getAllMyGroup,
  getAllMyGroupPost,
  // getMyRecipeTags,
  // getAllRecipeTags,
  getAllGroupForStatusChange,
};
