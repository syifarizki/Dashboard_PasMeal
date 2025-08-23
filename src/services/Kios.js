import axios from "axios";
import { API_URL } from "./Api";

export const Kios = {
  // Ambil profil kios
  getKios: async (token) => {
    const res = await axios.get(`${API_URL}/api/kios/profil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },

  // Update profil kios
  updateKios: async (data, token) => {
    const formData = new FormData();
    formData.append("nama_kios", data.nama_kios || "");
    formData.append("deskripsi", data.deskripsi || "");
    formData.append("nama_bank", data.nama_bank || "");
    formData.append("nomor_rekening", data.nomor_rekening || "");

    if (data.gambar_kios) {
      formData.append("gambar_kios", data.gambar_kios);
    }

    const res = await axios.put(`${API_URL}/api/kios/profil`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};
