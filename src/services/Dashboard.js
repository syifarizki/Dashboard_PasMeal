import axios from "axios";
import { API_URL } from "./Api";

export const Dashboard = {
  getDashboardData: async (token) => {
    const res = await axios.get(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
