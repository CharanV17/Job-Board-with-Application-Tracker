
import { api } from "./api";

export const profileService = {
  getProfile: async () => {
    const res = await api.get("/profile");
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await api.put("/profile", data);
    return res.data;
  },
};
