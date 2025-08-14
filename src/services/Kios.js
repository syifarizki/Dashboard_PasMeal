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
    return res.data.data; // langsung ambil objek kios dari backend
  },

  // Update profil kios
  updateKios: async ({
    nama_kios,
    deskripsi,
    nama_bank,
    nomor_rekening,
    gambar_kios,
    token,
  }) => {
    const formData = new FormData();
    formData.append("nama_kios", nama_kios || "");
    formData.append("deskripsi", deskripsi || "");
    formData.append("nama_bank", nama_bank || "");
    formData.append("nomor_rekening", nomor_rekening || "");

    if (gambar_kios) {
      formData.append("gambar_kios", gambar_kios);
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
