import { model, Schema } from 'mongoose';
import { TComment, TRating, TRecipe } from './Recipe.interface';
import { contentType, status } from './Recipe.constant';

const ratingSchema = new Schema<TRating>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
    ref: 'User',
  },
  rating: { type: Number, required: [true, 'Rating is required'] },
});

const copmmentSchema = new Schema<TComment>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
    ref: 'User',
  },
  comment: { type: String, required: [true, 'Comment is required'] },
});

const recipeSchema = new Schema<TRecipe>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required!'],
      ref: 'User',
    },
    title: { type: String, required: [true, 'Title is required!'] },
    instructions: {
      type: String,
      required: [true, 'Instructions is required!'],
    },
    image: { type: [String], required: [true, 'Image is required!'] },
    rating: [ratingSchema],
    comment: [copmmentSchema],
    upvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: { type: String, required: [true, 'Tag is required!'] },
    contentType: {
      type: String,
      enum: {
        values: contentType,
        message: '{VALUE} is not valid!',
      },
      default: 'free',
    },
    status: {
      type: String,
      enum: {
        values: status,
        message: '{VALUE} is not valid!',
      },
      default: 'published',
    },
  },
  { timestamps: true },
);

export const Recipe = model<TRecipe>('Recipe', recipeSchema);
