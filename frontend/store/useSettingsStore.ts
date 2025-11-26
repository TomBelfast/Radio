import { create } from 'zustand';
import { getUserSettings, updateUserSettings } from '@/lib/api';

interface UserSettings {
    id?: number;
    clerk_user_id: string;
    default_city: string;
    default_voice_id: string;
    default_language: string;
}

interface SettingsState {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: (clerkUserId: string) => Promise<void>;
    saveSettings: (settings: UserSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,
    error: null,
    fetchSettings: async (clerkUserId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getUserSettings(clerkUserId);
            set({ settings: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch settings', isLoading: false });
        }
    },
    saveSettings: async (settings) => {
        set({ isLoading: true, error: null });
        try {
            const data = await updateUserSettings(settings);
            set({ settings: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to save settings', isLoading: false });
        }
    },
}));
