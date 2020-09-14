// import UserHandler from '../services/user/user.handler';
import Mongoose, { Schema, Document } from 'mongoose';
import { UserI } from 'models/user';

export interface TagI extends Document {
    title: string;
    author: UserI['_id'];
}

const TagSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Tag = Mongoose.model<TagI>('Tag', TagSchema, 'tags');