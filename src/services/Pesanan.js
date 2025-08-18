import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  getPesananMasuk: async (token) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Mengembalikan data dan informasi paginasi jika ada dari backend
    return res.data;
  },

  getDetailPesananMasuk: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getCountPesananMasuk: async (token) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // 👇 TAMBAHKAN FUNGSI BARU INI
  verifyKiosToken: async (kiosId, token) => {
    const res = await axios.get(`${API_URL}/api/kios/verify-token`, {
      params: { kiosId, token },
    });
    // Backend mengembalikan { message: '...', pesanan: [...] }
    return res.data.pesanan || []; // Langsung kembalikan array pesanannya
  },
};
