import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  SettingsSidebar,
  type SettingsSection,
} from '@/components/settings/SettingsSidebar';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { PasswordSection } from '@/components/settings/PasswordSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { DangerZoneSection } from '@/components/settings/DangerZoneSection';

const sectionComponents: Record<SettingsSection, React.ReactNode> = {
  profile: <ProfileSection />,
  password: <PasswordSection />,
  appearance: <AppearanceSection />,
  'danger-zone': <DangerZoneSection />,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your account preferences and security settings.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 shrink-0">
            <SettingsSidebar
              activeSection={activeSection}
              onSelect={setActiveSection}
            />
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1 rounded-xl border border-[#2a3a50] bg-[#1a2332] p-6">
            {sectionComponents[activeSection]}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
