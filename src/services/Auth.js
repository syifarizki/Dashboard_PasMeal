import axios from "axios";
import { API_URL } from "./Api";

export const AuthApi = {
  register: async ({ nama, no_hp, email, password, confirmPassword }) => {
    const res = await axios.post(`${API_URL}/api/register`, {
      nama,
      no_hp,
      email,
      password,
      confirmPassword,
    });
    return res.data;
  },

  login: async (name, password) => {
    const res = await axios.post(`${API_URL}/api/login`, { name, password });
    return res.data;
  },

  verifyOtp: async ({ no_hp, kode_otp }) => {
    const res = await axios.post(`${API_URL}/api/verify-otp`, {
      no_hp,
      kode_otp,
    });
    return res.data;
  },

  registerKios: async ({ namaToko, namaRekening, noRekening, token }) => {
    const res = await axios.post(
      `${API_URL}/api/kios`,
      {
        namaToko,
        namaRekening,
        noRekening,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};
