import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';
import { ArticleI } from 'models/articles';

export interface FavouriteI extends Document {
    author: UserI['id'];
    article: ArticleI['id'];
}

const FavouriteSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true }
}, { timestamps: true});

export const Favourite = Mongoose.model<FavouriteI>('Favourite', FavouriteSchema, 'favourites');