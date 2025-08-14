import axios from "axios";
import { API_URL } from "./Api";

export const Penjual = {
  getProfile: async (token) => {
    const res = await axios.get(`${API_URL}/api/penjual/profil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Update data profil
  updateProfile: async ({ nama, no_hp, email, token }) => {
    const res = await axios.put(
      `${API_URL}/api/penjual/profil`,
      { nama, no_hp, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};
