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
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', min: 1 }]
}, { timestamps: true, toJSON: { virtuals: true } });

ArticleSchema.virtual('likes', {
    ref: 'ArticleLikes',
    localField: '_id',
    foreignField: 'article',
    count: true
});

ArticleSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'article'
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

ArticleSchema.post('find', async (docs: ArticleI[]): Promise<void> => {
    for (let doc of docs) {
        await doc.populate({ path: 'author', select: 'fullName email avatar occupation' }).execPopulate();
        await doc.populate({ path: 'tags', select: 'title' }).execPopulate();
        await doc.populate({ path: 'comments', select: '_id' }).execPopulate();
        await doc.populate('likes').execPopulate();
        // await doc.populate('dislikes').execPopulate();
        await doc.populate('favourites').execPopulate();
    }
});

ArticleSchema.post('findOne', async (doc: ArticleI): Promise<void> => {
    await doc.populate({ path: 'author', select: 'fullName email avatar occupation' }).execPopulate();
    await doc.populate({ path: 'tags', select: 'title' }).execPopulate();
    await doc.populate({ path: 'comments', select: '_id' }).execPopulate();
    await doc.populate('likes').execPopulate();
    // await doc.populate('dislikes').execPopulate();
    await doc.populate('favourites').execPopulate();
});

export const Article = Mongoose.model<ArticleI>('Article', ArticleSchema, 'articles');