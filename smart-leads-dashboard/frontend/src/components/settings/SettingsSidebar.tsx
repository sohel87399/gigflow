import {
  User,
  Lock,
  Palette,
  AlertTriangle,
} from 'lucide-react';

export type SettingsSection = 'profile' | 'password' | 'appearance' | 'danger-zone';

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'password', label: 'Password', icon: <Lock size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  {
    id: 'danger-zone',
    label: 'Danger Zone',
    icon: <AlertTriangle size={16} />,
    danger: true,
  },
];

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSelect: (section: SettingsSection) => void;
}

export const SettingsSidebar = ({
  activeSection,
  onSelect,
}: SettingsSidebarProps) => {
  return (
    <nav className="flex flex-col gap-1" aria-label="Settings navigation">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors duration-150',
              isActive
                ? item.danger
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-indigo-600 text-white'
                : item.danger
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-slate-400 hover:bg-[#1e2d45] hover:text-slate-200',
            ].join(' ')}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
