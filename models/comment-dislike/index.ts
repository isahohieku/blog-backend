import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { CommentI } from 'models/comments';

export interface CommentDislikesI extends Document {
    author: UserI['id'];
    comment: CommentI['id'];
}

const CommentDislikesSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: true }
}, { timestamps: true });

export const CommentDislikes =
    Mongoose.model<CommentDislikesI>('CommentDislikes', CommentDislikesSchema, 'commentdislikes');