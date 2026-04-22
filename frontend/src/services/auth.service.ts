import { api } from "./api";

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });

    // Save token for Axios interceptor
    localStorage.setItem("token", res.data.token);

    return res.data;
  },

  async register(data: any) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
};
