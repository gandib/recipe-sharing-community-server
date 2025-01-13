import { model, Schema } from 'mongoose';
import { TComment, TGroup, TPost } from './Group.interface';
import { status } from './Group.constant';

const commentSchema = new Schema<TComment>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
    ref: 'User',
  },
  comment: { type: String, required: [true, 'Comment is required'] },
});

const postSchema = new Schema<TPost>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
    ref: 'User',
  },
  title: { type: String, required: [true, 'Title is required!'] },
  instructions: {
    type: String,
    required: [true, 'Instructions is required!'],
  },
  image: { type: [String], required: [true, 'Image is required!'] },
  comment: [commentSchema],
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: { type: String, required: [true, 'Tag is required!'] },
  status: {
    type: String,
    enum: {
      values: status,
      message: '{VALUE} is not valid!',
    },
    default: 'published',
  },
});

const groupSchema = new Schema<TGroup>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required!'],
      ref: 'User',
    },
    name: { type: String, required: [true, 'Name is required!'] },
    image: { type: [String], required: [true, 'Image is required!'] },
    members: [
      {
        type: Schema.Types.ObjectId,
        required: [true, 'User Id is required!'],
        ref: 'User',
      },
    ],
    posts: [postSchema],
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

export const Group = model<TGroup>('Group', groupSchema);
