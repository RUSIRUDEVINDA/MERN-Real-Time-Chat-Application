import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('chat-theme') || 'Coffee', // default theme
    // action to change theme
    setTheme: (theme) => {
        // persist theme in localStorage
        localStorage.setItem('chat-theme', theme);
        set({ theme });
    }
}));