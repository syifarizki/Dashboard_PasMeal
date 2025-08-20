import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  // Ambil daftar pesanan masuk (penjual) pakai pagination
  getPesananMasuk: async (token, page = 1) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Backend sudah return { page, totalPages, limit, total, data }
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

  updateStatusPesanan: async (id, newStatusKey, token) => {
    const res = await axios.patch(
      // <-- Menggunakan PATCH
      `${API_URL}/api/pesanan-masuk/${id}/status`,
      { status: newStatusKey }, // Body request berisi kunci status
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  // Token sementara (via WA link)
  verifyKiosToken: async (kiosId, token) => {
    const res = await axios.get(`${API_URL}/api/kios/verify-token`, {
      params: { kiosId, token },
    });
    return res.data.pesanan || [];
  },
};
