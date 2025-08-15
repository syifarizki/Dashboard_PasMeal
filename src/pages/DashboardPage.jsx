import { useEffect, useState } from "react";
import { FaClipboardList, FaWallet } from "react-icons/fa";
import { RiListSettingsLine } from "react-icons/ri";
import InfoCard from "../components/InfoCard";
import { Dashboard } from "../services/Dashboard";

const DashboardPage = () => {
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const data = await Dashboard.getDashboardData(token);

        setMenuCount(data.totalMenu || 0);
        setOrderCount(data.totalPesanan || 0);
        setRevenue(data.pendapatan || 0);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading data dashboard...</p>;
  }

  return (
    <div className="px-6 py-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          title="Total Pesanan"
          icon={<FaClipboardList size={28} />}
          value={orderCount.toString()}
          bgColor="bg-primary"
        />
        <InfoCard
          title="Total Menu"
          icon={<RiListSettingsLine size={28} />}
          value={menuCount.toString()}
          bgColor="bg-secondary"
        />
        <InfoCard
          title="Pendapatan"
          icon={<FaWallet size={28} />}
          value={`${revenue.toLocaleString("id-ID")}`}
          bgColor="bg-primary"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
