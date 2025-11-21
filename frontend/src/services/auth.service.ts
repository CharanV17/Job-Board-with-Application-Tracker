 import { api } from "./api";

export const authService = {
  register: async (data: any) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  login: async (data: any) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  }
};

