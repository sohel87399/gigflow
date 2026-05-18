import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { Lead } from '@/types';

const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

export const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const isEditing = Boolean(lead);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? 'New',
      source: lead?.source ?? 'Website',
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    }
  }, [lead, reset]);

  const createMutation = useCreateLead(onSuccess);
  const updateMutation = useUpdateLead(onSuccess);

  const onSubmit = (values: LeadFormValues) => {
    if (isEditing && lead) {
      updateMutation.mutate({ id: lead._id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Full Name *"
        placeholder="e.g. Jane Smith"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address *"
        type="email"
        placeholder="e.g. jane@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Select
        label="Status *"
        options={STATUS_OPTIONS}
        error={errors.status?.message}
        {...register('status')}
      />

      <Select
        label="Source *"
        options={SOURCE_OPTIONS}
        error={errors.source?.message}
        {...register('source')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {isEditing ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
