import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'sales_user'] as UserRole[],
      default: 'sales_user',
    },
  },
  {
    timestamps: true,
  }
);

// Note: unique: true on the email field already creates an index automatically.

/**
 * Pre-save hook: hash password before saving if it has been modified.
 */
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Instance method: compare a plain-text password against the stored hash.
 */
UserSchema.methods.comparePassword = async function (
  plainPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password as string);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
