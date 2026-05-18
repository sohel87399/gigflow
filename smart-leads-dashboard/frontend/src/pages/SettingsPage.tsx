import { Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20">
          <Settings size={32} className="text-indigo-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400 text-sm max-w-xs">
          Account settings, team management, and preferences will be available here.
        </p>
        <span className="mt-4 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
          Coming Soon
        </span>
      </div>
    </DashboardLayout>
  );
}
