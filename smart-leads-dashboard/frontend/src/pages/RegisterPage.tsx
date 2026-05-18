import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { TrendingUp, User, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  role: z.enum(['admin', 'sales_user']).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  { value: 'sales_user', label: 'Sales User' },
  { value: 'admin', label: 'Admin' },
];

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales_user' },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerUser(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Join Smart Leads Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1e2d45] bg-[#1a2332] p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Smith"
              autoComplete="name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label="Role"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isRegistering}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
