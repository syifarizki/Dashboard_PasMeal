import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  getPesananMasuk: async (token) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  getDetailPesananMasuk: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
