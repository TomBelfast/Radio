import { create } from 'zustand';
import { getUserSettings, updateUserSettings } from '@/lib/api';

interface UserSettings {
    id?: number;
    user_id: string;
    default_city: string;
    default_voice_id: string;
    default_language: string;
}

interface SettingsState {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: (userId: string) => Promise<void>;
    saveSettings: (userId: string, settings: UserSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getUserSettings(userId);
            set({ settings: data, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch settings', isLoading: false });
        }
    },

    saveSettings: async (userId, settings) => {
        set({ isLoading: true, error: null });
        try {
            const data = await updateUserSettings(userId, settings);
            set({ settings: data, isLoading: false });
        } catch {
            set({ error: 'Failed to save settings', isLoading: false });
        }
    },
}));
