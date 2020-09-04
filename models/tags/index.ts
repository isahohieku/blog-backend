// import UserHandler from '../services/user/user.handler';
import Mongoose, { Schema, Document } from 'mongoose';

export interface TagI extends Document {
    title?: string;
}

const TagSchema = new Schema({
    title: { type: String, required: true }
}, { timestamps: true});

export const Tag = Mongoose.model<TagI>('Tag', TagSchema, 'tags');