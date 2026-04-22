import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "employer";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true, // 🔥 MUST HAVE (Used in ProtectedRoute)

  setLoading: (loading) => set({ loading }),

  login: (user, token) => {
    set({ user, token, loading: false });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false });
  },

  loadUser: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      set({
        user: JSON.parse(user),
        token,
        loading: false, // 🔥 Set loading false after loading
      });
    } else {
      set({ loading: false });
    }
  },
}));
