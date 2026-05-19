import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { AlertTriangle } from 'lucide-react';
import { deleteAccountApi } from '@/api/settings.api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ApiResponse } from '@/types';

export const DangerZoneSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      setIsModalOpen(false);
      logout();
      navigate('/login', { replace: true });
    },
    onError: (err: AxiosError<ApiResponse<null>>) => {
      setIsModalOpen(false);
      const message =
        err.response?.data?.message ?? 'Failed to delete account. Please try again.';
      toast.error(message);
    },
  });

  const handleConfirm = () => {
    if (confirmText !== 'DELETE') return;
    mutate();
  };

  const handleClose = () => {
    if (isPending) return;
    setIsModalOpen(false);
    setConfirmText('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-400">
          Irreversible actions that affect your account permanently.
        </p>
      </div>

      <div className="max-w-md rounded-xl border border-red-500/30 bg-red-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-400" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
            <p className="mt-1 text-sm text-slate-400">
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>
            <div className="mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Delete Account"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <p className="text-sm text-slate-300">
              This will permanently delete your account and all your data. This
              action <strong className="text-red-400">cannot be undone</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-slate-400">
              Type <span className="font-mono font-bold text-red-400">DELETE</span> to
              confirm:
            </p>
            <Input
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isPending}
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              loading={isPending}
              disabled={confirmText !== 'DELETE' || isPending}
              onClick={handleConfirm}
            >
              Delete My Account
            </Button>
            <Button variant="ghost" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
