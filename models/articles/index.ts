// import UserHandler from '../services/user/user.handler';
import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { TagI } from 'models/tags';
import { CommentI } from 'models/comments';

export interface ArticleI extends Document {
    title: string;
    body: string;
    author: UserI['_id'];
    slug: string;
    tags: TagI['_id'][];
    comments: CommentI['_id'][];
    likes: number;
    dislikes: number;
    favourites: number;
}

const ArticleSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', min: 1 }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', min: 1}]
}, { timestamps: true});

ArticleSchema.virtual('likes', {
    ref: 'ArticleLikes',
    localField: '_id',
    foreignField: 'article',
    count: true
});

ArticleSchema.virtual('dislikes', {
    ref: 'ArticleDislikes',
    localField: '_id',
    foreignField: 'article',
    count: true
});

ArticleSchema.virtual('favourites', {
    ref: 'Favourite',
    localField: '_id',
    foreignField: 'article',
    count: true
});

ArticleSchema.post('find', async (doc: CommentI): Promise<void> => {
    await doc.populate({ path: 'author', select: 'fullName email avatar' }).execPopulate();
    await doc.populate('likes').execPopulate();
    await doc.populate('dislikes').execPopulate();
    await doc.populate('favourites').execPopulate();
});

export const Article = Mongoose.model<ArticleI>('Article', ArticleSchema, 'articles');