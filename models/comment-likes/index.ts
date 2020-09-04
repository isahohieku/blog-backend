import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { CommentI } from 'models/comments';

export interface CommentLikesI extends Document {
    author: UserI['id'];
    comment: CommentI['id'];
}

const CommentLikesSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: true }
}, { timestamps: true});

export const CommentLikes = Mongoose.model<CommentLikesI>('CommentLikes', CommentLikesSchema, 'commentlikes');