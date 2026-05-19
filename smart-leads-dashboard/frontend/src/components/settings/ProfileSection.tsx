import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { updateProfileApi } from '@/api/settings.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiResponse, User } from '@/types';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email address')
    .trim(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ProfileSection = () => {
  const { user, updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  // Keep form in sync if user changes externally
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (res) => {
      if (res.data) {
        updateUser(res.data as User);
        reset({ name: res.data.name, email: res.data.email });
      }
      toast.success('Profile updated successfully');
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      const message =
        err.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    mutate(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">Profile Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Update your display name and email address.
        </p>
      </div>

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white select-none">
          {user ? getInitials(user.name) : '??'}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 max-w-md">
        <Input
          label="Full Name"
          placeholder="Your full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="submit"
            loading={isPending}
            disabled={!isDirty || isPending}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={!isDirty || isPending}
            onClick={() => reset()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
