import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';

export interface FollowingI extends Document {
    author: UserI['id'];
    following: UserI['id'];
}

const FollowingSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true});

export const Following = Mongoose.model<FollowingI>('Following', FollowingSchema, 'favourites');