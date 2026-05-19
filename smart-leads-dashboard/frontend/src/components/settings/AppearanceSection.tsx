import { useUiStore } from '@/store/uiStore';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

export const AppearanceSection = () => {
  const { darkMode, setDarkMode } = useUiStore();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">Appearance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Customize how the dashboard looks for you. Preferences are saved locally.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <div className="rounded-xl border border-[#2a3a50] bg-[#1a2332] p-4">
          <ToggleSwitch
            checked={darkMode}
            onChange={setDarkMode}
            label="Dark Mode"
            description="Use a dark color scheme across the dashboard."
          />
        </div>
      </div>
    </div>
  );
};
