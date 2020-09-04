import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { ArticleI } from 'models/articles';

export interface CommentI extends Document {
    body: string;
    author: UserI['id'];
    slug: string;
    article: ArticleI['id'];
    likes: number;
    dislikes: number;
}

const CommentSchema = new Schema({
    title: { type: String, required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

CommentSchema.virtual('likes', {
    ref: 'CommentLikes',
    localField: '_id',
    foreignField: 'comment',
    count: true
});

CommentSchema.virtual('dislikes', {
    ref: 'CommentDislikes',
    localField: '_id',
    foreignField: 'comment',
    count: true
});

CommentSchema.post('find', async (doc: CommentI): Promise<void> => {
    await doc.populate({ path: 'author', select: 'fullName email avatar' }).execPopulate();
    await doc.populate('likes').execPopulate();
    await doc.populate('dislikes').execPopulate();
});

export const Comment = Mongoose.model<CommentI>('Comment', CommentSchema, 'comments');