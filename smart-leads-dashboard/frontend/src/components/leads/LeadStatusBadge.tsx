import { Badge } from '@/components/ui/Badge';
import { LeadStatus, LeadSource } from '@/types';

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

interface LeadSourceBadgeProps {
  source: LeadSource;
}

const statusVariantMap: Record<LeadStatus, 'blue' | 'yellow' | 'green' | 'red'> = {
  New: 'blue',
  Contacted: 'yellow',
  Qualified: 'green',
  Lost: 'red',
};

const sourceVariantMap: Record<LeadSource, 'purple' | 'pink' | 'orange'> = {
  Website: 'purple',
  Instagram: 'pink',
  Referral: 'orange',
};

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => (
  <Badge variant={statusVariantMap[status]}>{status}</Badge>
);

export const LeadSourceBadge = ({ source }: LeadSourceBadgeProps) => (
  <Badge variant={sourceVariantMap[source]}>{source}</Badge>
);
