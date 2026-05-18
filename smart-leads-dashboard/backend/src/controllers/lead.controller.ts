import { Request, Response } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getAllLeadsForExport,
} from '../services/lead.service';
import { leadsToCSV } from '../utils/csv.utils';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';
import { ApiResponse, LeadFilters } from '../types';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/leads
 * Returns a paginated, filtered list of leads.
 */
export const listLeads = async (req: Request, res: Response): Promise<void> => {
  const filters: LeadFilters = {
    page: req.query.page as unknown as number,
    limit: req.query.limit as unknown as number,
    status: req.query.status as LeadFilters['status'],
    source: req.query.source as LeadFilters['source'],
    search: req.query.search as string | undefined,
    sort: req.query.sort as LeadFilters['sort'],
  };

  const result = await getLeads(filters);

  const response: ApiResponse<typeof result.data> & {
    pagination: typeof result.pagination;
  } = {
    success: true,
    message: 'Leads retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  };

  res.status(200).json(response);
};

/**
 * POST /api/leads
 * Creates a new lead. Sets createdBy to the authenticated user's ID.
 */
export const createLeadHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const input = req.body as CreateLeadInput;
  const lead = await createLead(input, req.user.id);

  const response: ApiResponse<typeof lead> = {
    success: true,
    message: 'Lead created successfully',
    data: lead,
  };

  res.status(201).json(response);
};

/**
 * GET /api/leads/:id
 * Returns a single lead by ID.
 */
export const getLeadHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const lead = await getLeadById(req.params.id);

  const response: ApiResponse<typeof lead> = {
    success: true,
    message: 'Lead retrieved successfully',
    data: lead,
  };

  res.status(200).json(response);
};

/**
 * PUT /api/leads/:id
 * Updates an existing lead.
 */
export const updateLeadHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = req.body as UpdateLeadInput;
  const lead = await updateLead(req.params.id, input);

  const response: ApiResponse<typeof lead> = {
    success: true,
    message: 'Lead updated successfully',
    data: lead,
  };

  res.status(200).json(response);
};

/**
 * DELETE /api/leads/:id  [admin only]
 * Deletes a lead by ID.
 */
export const deleteLeadHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  await deleteLead(req.params.id);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Lead deleted successfully',
  };

  res.status(200).json(response);
};

/**
 * GET /api/leads/export/csv  [admin only]
 * Exports all leads matching the current filters as a CSV file download.
 */
export const exportLeadsCSV = async (
  req: Request,
  res: Response
): Promise<void> => {
  const filters = {
    status: req.query.status as LeadFilters['status'],
    source: req.query.source as LeadFilters['source'],
    search: req.query.search as string | undefined,
  };

  const leads = await getAllLeadsForExport(filters);
  const csv = leadsToCSV(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="leads.csv"'
  );
  res.status(200).send(csv);
};
