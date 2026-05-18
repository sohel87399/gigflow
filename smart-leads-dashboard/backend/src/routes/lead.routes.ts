import { Router } from 'express';
import {
  listLeads,
  createLeadHandler,
  getLeadHandler,
  updateLeadHandler,
  deleteLeadHandler,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  listLeadsSchema,
} from '../schemas/lead.schema';

const router = Router();

// All lead routes require authentication
router.use(authMiddleware);

/**
 * @route  GET /api/leads/export/csv
 * @desc   Export leads as CSV (admin only)
 * @access Private — admin
 * NOTE: This route must be defined BEFORE /:id to avoid "export" being treated as an ID
 */
router.get(
  '/export/csv',
  requireRole('admin'),
  exportLeadsCSV
);

/**
 * @route  GET /api/leads
 * @desc   Get paginated, filtered list of leads
 * @access Private — admin, sales_user
 */
router.get('/', validate(listLeadsSchema), listLeads);

/**
 * @route  POST /api/leads
 * @desc   Create a new lead
 * @access Private — admin, sales_user
 */
router.post('/', validate(createLeadSchema), createLeadHandler);

/**
 * @route  GET /api/leads/:id
 * @desc   Get a single lead by ID
 * @access Private — admin, sales_user
 */
router.get('/:id', getLeadHandler);

/**
 * @route  PUT /api/leads/:id
 * @desc   Update a lead
 * @access Private — admin, sales_user
 */
router.put('/:id', validate(updateLeadSchema), updateLeadHandler);

/**
 * @route  DELETE /api/leads/:id
 * @desc   Delete a lead (admin only)
 * @access Private — admin
 */
router.delete('/:id', requireRole('admin'), deleteLeadHandler);

export default router;
