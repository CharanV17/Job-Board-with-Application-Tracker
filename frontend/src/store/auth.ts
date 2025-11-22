import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
  finishLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false });
  },

  finishLoading: () => set({ loading: false }),
}));
