import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { ArticleI } from 'models/articles';

export interface ArticleLikesI extends Document {
    author: UserI['id'];
    article: ArticleI['id'];
}

const ArticleLikesSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true }
}, { timestamps: true});

export const ArticleLikes = Mongoose.model<ArticleLikesI>('ArticleLikes', ArticleLikesSchema, 'articlelikes');