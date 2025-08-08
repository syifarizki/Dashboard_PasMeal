import { useEffect, useState } from "react";
import { FaClipboardList, FaWallet } from "react-icons/fa";
import { RiListSettingsLine } from "react-icons/ri";
import InfoCard from "../components/InfoCard";

const DashboardPage = () => {
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const storedMenus = JSON.parse(localStorage.getItem("menus") || "[]");
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    // Hitung total menu
    setMenuCount(storedMenus.length);

    // Hitung total pesanan yang belum selesai
    const unfinishedOrders = storedOrders.filter(
      (order) => order.status !== "Pesanan Selesai"
    );
    setOrderCount(unfinishedOrders.length);

    // Hitung total pendapatan dari pesanan yang selesai
    const totalPendapatan = storedOrders
      .filter((order) => order.status === "Pesanan Selesai")
      .reduce((acc, curr) => {
        const numericTotal = parseInt(
          String(curr.total).replace(/\D/g, "") || "0"
        );
        return acc + numericTotal;
      }, 0);
    setRevenue(totalPendapatan);
  }, []);

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
}

export default DashboardPage;

