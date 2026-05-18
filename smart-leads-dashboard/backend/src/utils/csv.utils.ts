import { Parser } from 'json2csv';
import { ILeadDocument } from '../models/Lead.model';

export interface CsvLeadRow {
  Name: string;
  Email: string;
  Status: string;
  Source: string;
  'Created At': string;
}

/**
 * Converts an array of lead documents into a CSV string.
 * Returns the CSV content as a string ready to be sent as a file download.
 */
export const leadsToCSV = (leads: ILeadDocument[]): string => {
  const fields: (keyof CsvLeadRow)[] = [
    'Name',
    'Email',
    'Status',
    'Source',
    'Created At',
  ];

  const data: CsvLeadRow[] = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    'Created At': lead.createdAt.toISOString(),
  }));

  const parser = new Parser<CsvLeadRow>({ fields });
  return parser.parse(data);
};
