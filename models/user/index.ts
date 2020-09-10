// import UserHandler from '../services/user/user.handler';
import Mongoose, { Schema, Document } from 'mongoose';
import { generateEncryptedPassword } from '../../utils/auth';

export interface UserI extends Document {
    fullName: string;
    email: string;
    password?: string;
    bio?: string;
    avatar?: string;
    status?: string;
    isEmailVerified?: boolean;
    requestedVerification?: boolean;
    token?: string;
    verificationToken?: string;
    forgotPasswordToken?: string;
    lastLogin?: Date;
}

export interface AdminI extends UserI {
    createdBy?: UserI["_id"];
    updatedBy?: UserI["_id"];
    adminType?: string;
}

const UserSchema = new Schema({
    fullName: { type: String, default: null },
    email: { type: String, lowercase: true, unique: true },
    password: { type: String },
    bio: { type: String },
    status: {
        type: String,
        default: 'pending',
        enum: {
            values: ['enabled', 'blocked', 'pending']
        }
    },
    avatar: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    requestedVerification: { type: Boolean, default: false },
    token: { type: String, default: null },
    verificationToken: { type: String, default: null },
    forgotPasswordToken: { type: String, default: null },
    lastLogin: { type: Date, default: null }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, discriminatorKey: 'type' });

// Document middlewares
UserSchema.pre<UserI>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await generateEncryptedPassword(this.password);
    next();
});

UserSchema.post('find', function (doc: any): void {
    delete doc.password;
});

UserSchema.post('update', function (doc: any): void {
    delete doc.password;
});

/* Admin User */
const AdminSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    adminType: {
        type: String,
        enum: {
            values: ['admin', 'super']
        },
        default: 'admin'
    }
});

export const User = Mongoose.model<UserI>('User', UserSchema, 'users');
export const Admin = User.discriminator<AdminI>('Admin', AdminSchema);