import { create } from "zustand";
import { authService } from "../services/auth.service";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: any, token: string) => void;
  initAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, loading: false });
  },

  initAuth: async () => {
    const token = get().token;
    if (!token) return set({ loading: false });

    try {
      const res = await authService.me();
      set({ user: res.user, loading: false });
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false });
  }
}));
