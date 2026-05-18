import { create } from 'zustand';

const STORAGE_KEY_DARK = 'sl_dark_mode';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
}

interface UiActions {
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (value: boolean) => void;
  hydrateDarkMode: () => void;
}

type UiStore = UiState & UiActions;

const applyDarkClass = (dark: boolean): void => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useUiStore = create<UiStore>((set, get) => ({
  darkMode: false,
  sidebarOpen: true,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem(STORAGE_KEY_DARK, String(next));
    applyDarkClass(next);
    set({ darkMode: next });
  },

  setDarkMode: (value: boolean) => {
    localStorage.setItem(STORAGE_KEY_DARK, String(value));
    applyDarkClass(value);
    set({ darkMode: value });
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarOpen: (value: boolean) => set({ sidebarOpen: value }),

  /**
   * Reads dark mode preference from localStorage on app startup.
   */
  hydrateDarkMode: () => {
    const stored = localStorage.getItem(STORAGE_KEY_DARK);
    const dark = stored === 'true';
    applyDarkClass(dark);
    set({ darkMode: dark });
  },
}));
