import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Menu = {
  getMenus: async (token) => {
    const res = await axios.get(`${API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.map((item) => ({
      ...item,
      id: item.id || item._id, // sesuaikan dengan backend
      foto_menu_full: item.foto_menu
        ? `${API_URL}/uploads/${item.foto_menu}`
        : "/images/menudefault.jpg",
    }));
  },

  getMenuById: async (id, token) => {
    const res = await axios.get(`${API_URL}/api/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const item = res.data; // <-- sesuai backend
    return {
      ...item,
      id: item.id || item._id,
      foto_menu_full: item.foto_menu
        ? `${API_URL}/uploads/${item.foto_menu}`
        : "/images/menudefault.jpg",
    };
  },

  addMenu: async (formData, token) => {
    const res = await axios.post(`${API_URL}/api/menu`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const newMenu = res.data.data;
    return {
      ...newMenu,
      id: newMenu.id || newMenu._id,
      foto_menu_full: newMenu.foto_menu
        ? `${API_URL}/uploads/${newMenu.foto_menu}`
        : "/images/menudefault.jpg",
    };
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

    const item = res.data.data || res.data; // <-- fallback jika backend langsung row
    return {
      ...item,
      id: item.id || item._id,
      foto_menu_full: item.foto_menu
        ? `${API_URL}/uploads/${item.foto_menu}`
        : "/images/menudefault.jpg",
    };
  },

  deleteMenu: async (id, token) => {
    const res = await axios.delete(`${API_URL}/api/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
