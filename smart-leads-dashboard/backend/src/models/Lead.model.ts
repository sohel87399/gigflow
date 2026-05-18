import mongoose, { Document, Schema, Types } from 'mongoose';
import { LeadStatus, LeadSource } from '../types';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] as LeadSource[],
      required: [true, 'Lead source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast filter + sort queries
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ createdBy: 1 });

// Compound index for common filter combinations
LeadSchema.index({ status: 1, source: 1, createdAt: -1 });

// Text index for search on name and email
LeadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
