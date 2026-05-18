import { Menu, LogOut, Users } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

export const Topbar = () => {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#1e2d45] bg-[#111827] px-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1e2d45] hover:text-slate-200 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users size={14} />
          <span className="text-slate-300 font-medium">Leads</span>
        </div>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-200 leading-none">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {user.role === 'sales_user' ? 'Sales User' : 'Admin'}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-[#2a3a50] px-3 py-1.5 text-sm text-slate-300 hover:bg-[#1e2d45] hover:text-white transition-colors"
          aria-label="Logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
