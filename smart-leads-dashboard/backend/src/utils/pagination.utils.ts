/**
 * Utility helpers for pagination calculations.
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Parses and validates pagination query parameters.
 * Enforces sensible defaults and a maximum limit of 100.
 */
export const parsePagination = (
  rawPage: unknown,
  rawLimit: unknown
): PaginationParams => {
  const page = Math.max(1, parseInt(String(rawPage ?? '1'), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(rawLimit ?? '10'), 10) || 10)
  );
  return { page, limit };
};

/**
 * Builds pagination metadata for API responses.
 */
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/**
 * Calculates the number of documents to skip for a given page.
 */
export const calcSkip = (page: number, limit: number): number =>
  (page - 1) * limit;
