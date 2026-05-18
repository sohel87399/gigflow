import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  FileText,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Leads',
    to: '/leads',
    icon: <Users size={18} />,
  },
  {
    label: 'Analytics',
    to: '/analytics',
    icon: <BarChart2 size={18} />,
    badge: 'New',
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: <FileText size={18} />,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <Settings size={18} />,
  },
];

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#0f172a] transition-transform duration-300',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#1e2d45]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              SmartLeads
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5"
          aria-label="Main navigation"
        >
          <ul className="space-y-0.5" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-[#1e2d45] hover:text-slate-200',
                    ].join(' ')
                  }
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#1e2d45] px-5 py-3">
          <p className="text-xs text-slate-500">Smart Leads v1.0</p>
        </div>
      </aside>
    </>
  );
};
