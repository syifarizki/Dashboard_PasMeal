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

  registerKios: async ({ nama_kios, nama_bank, nomor_rekening, token }) => {
    const res = await axios.post(
      `${API_URL}/api/kios`,
      { nama_kios, nama_bank, nomor_rekening },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  verifyOtp: async ({ no_hp, kode_otp }) => {
    const res = await axios.post(`${API_URL}/api/verify-otp`, {
      no_hp,
      kode_otp,
    });
    return res.data;
  },

  resendOtp: async (no_hp) => {
    const res = await axios.post(`${API_URL}/api/resend-otp`, { no_hp });
    return res.data;
  },

  login: async (nama, password, rememberMe) => {
    const res = await axios.post(`${API_URL}/api/login`, {
      nama,
      password,
      rememberMe,
    });
    return res.data;
  },

  autoLogin: async ({ kiosId, token }) => {
    const res = await axios.post(
      `${API_URL}/api/auto-login`,
      { kiosId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  forgotPassword: async (no_hp) => {
    const res = await axios.post(`${API_URL}/api/forgot-password`, { no_hp });
    return res.data;
  },

  resetPassword: async ({ token, password, confirmPassword }) => {
    const res = await axios.post(`${API_URL}/api/reset-password`, {
      token,
      password,
      confirmPassword,
    });
    return res.data;
  },

  logout: async (token) => {
    const res = await axios.post(
      `${API_URL}/api/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },
};
