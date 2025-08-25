import axios from "axios";
import { API_URL } from "./Api";

export const Pesanan = {
  getPesananMasuk: async (token, page = 1) => {
    const res = await axios.get(`${API_URL}/api/pesanan-masuk?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getPesananMasukWA: async (token, page = 1) => {
    const res = await axios.get(
      `${API_URL}/api/pesanan-masuk-wa?page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
      `${API_URL}/api/pesanan/${id}/status`,
      { status: newStatusKey },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  getRiwayatPesanan: async (token, page = 1) => {
    const res = await axios.get(`${API_URL}/api/pesanan/riwayat?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getDetailRiwayatPesanan: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/pesanan/riwayat/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
