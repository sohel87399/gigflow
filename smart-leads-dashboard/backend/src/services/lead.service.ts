import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead.model';
import { AppError } from '../middleware/error.middleware';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';
import { LeadFilters, PaginatedResponse } from '../types';
import {
  parsePagination,
  buildPaginationMeta,
  calcSkip,
} from '../utils/pagination.utils';

/**
 * Retrieves a paginated, filtered list of leads.
 */
export const getLeads = async (
  filters: LeadFilters
): Promise<PaginatedResponse<ILeadDocument>> => {
  const { status, source, search, sort, page: rawPage, limit: rawLimit } = filters;

  const { page, limit } = parsePagination(rawPage, rawLimit);
  const skip = calcSkip(page, limit);
  const sortOrder = sort === 'oldest' ? 1 : -1;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return {
    data: data as unknown as ILeadDocument[],
    pagination: buildPaginationMeta(total, page, limit),
  };
};

/**
 * Retrieves all leads matching the given filters (no pagination) — used for CSV export.
 */
export const getAllLeadsForExport = async (
  filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>
): Promise<ILeadDocument[]> => {
  const { status, source, search } = filters;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  return Lead.find(filter).sort({ createdAt: -1 });
};

/**
 * Retrieves a single lead by ID.
 * Throws 404 if not found.
 */
export const getLeadById = async (id: string): Promise<ILeadDocument> => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};

/**
 * Creates a new lead.
 */
export const createLead = async (
  input: CreateLeadInput,
  userId: string
): Promise<ILeadDocument> => {
  const lead = await Lead.create({
    ...input,
    createdBy: userId,
  });
  return lead;
};

/**
 * Updates an existing lead by ID.
 * Throws 404 if not found.
 */
export const updateLead = async (
  id: string,
  input: UpdateLeadInput
): Promise<ILeadDocument> => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

/**
 * Deletes a lead by ID.
 * Throws 404 if not found.
 */
export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
};
