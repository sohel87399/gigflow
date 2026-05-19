import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { changePasswordApi } from '@/api/settings.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiResponse } from '@/types';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

const computePasswordStrength = (password: string): StrengthResult => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  score = Math.min(score, 4);

  const map: Record<number, StrengthResult> = {
    0: { score: 0, label: 'Too weak', color: 'bg-red-500' },
    1: { score: 1, label: 'Weak', color: 'bg-orange-500' },
    2: { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    3: { score: 3, label: 'Good', color: 'bg-blue-500' },
    4: { score: 4, label: 'Strong', color: 'bg-green-500' },
  };
  return map[score];
};

export const PasswordSection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      toast.success('Password changed successfully');
      reset();
      setNewPasswordValue('');
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      const message =
        err.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const strength = newPasswordValue ? computePasswordStrength(newPasswordValue) : null;

  const EyeToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-slate-500 hover:text-slate-300 transition-colors"
      tabIndex={-1}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">Password & Security</h2>
        <p className="mt-1 text-sm text-slate-400">
          Change your password. You'll need your current password to confirm.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 max-w-md">
        <Input
          label="Current Password"
          type={showCurrent ? 'text' : 'password'}
          placeholder="Enter current password"
          error={errors.currentPassword?.message}
          rightIcon={
            <EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
          }
          {...register('currentPassword')}
        />

        <div className="flex flex-col gap-1">
          <Input
            label="New Password"
            type={showNew ? 'text' : 'password'}
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            rightIcon={
              <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
            }
            {...register('newPassword', {
              onChange: (e) => setNewPasswordValue(e.target.value),
            })}
          />

          {/* Password strength indicator */}
          {newPasswordValue && strength && (
            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={[
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      i < strength.score ? strength.color : 'bg-[#2a3a50]',
                    ].join(' ')}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Strength:{' '}
                <span
                  className={
                    strength.score >= 3 ? 'text-green-400' : 'text-slate-400'
                  }
                >
                  {strength.label}
                </span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          rightIcon={
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          }
          {...register('confirmPassword')}
        />

        <div className="pt-1">
          <Button type="submit" loading={isPending} disabled={isPending}>
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};
