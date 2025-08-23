import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Menu = {
  getMenus: async (token) => {
    const res = await axios.get(`${API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getMenuById: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/menu/seller/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  addMenu: async (formData, token) => {
    const res = await axios.post(`${API_URL}/api/menu`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  updateMenu: async (id, data, token, isFormData = false) => {
    const headers = { Authorization: `Bearer ${token}` };
    if (isFormData) headers["Content-Type"] = "multipart/form-data";
    else headers["Content-Type"] = "application/json";

    const res = await axios.put(
      `${API_URL}/api/menu/${id}`,
      isFormData ? data : JSON.stringify(data),
      { headers }
    );
    return res.data.data || res.data;
  },

  deleteMenu: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getMenusPaginated: async (token, page, limit) => {
    const res = await axios.get(`${API_URL}/api/menu/paginated`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    });

    return {
      data: res.data.data || [],
      total: res.data.total || 0,
    };
  },
};
