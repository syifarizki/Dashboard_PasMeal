import React, { useEffect, useState } from "react";
import { FaBars, FaClipboardList, FaChevronLeft } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { MdDashboard, MdOutlineHistory } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pesanan } from "../../services/Pesanan";

const navItems = [
  {
    name: "Dashboard",
    icon: <MdDashboard className="inline-block w-6 h-6 mr-2 -mt-1" />,
    link: "/DashboardPage",
  },
  {
    name: "Daftar Menu",
    icon: <RiListSettingsLine className="inline-block w-6 h-6 mr-2 -mt-1" />,
    link: "/MenuPage",
  },
  {
    name: "Pesanan",
    icon: <FaClipboardList className="inline-block w-6 h-6 mr-2 -mt-1" />,
    link: "/OrderPage",
  },
  {
    name: "Riwayat",
    icon: <MdOutlineHistory className="inline-block w-6 h-6 mr-2 -mt-1" />,
    link: "/OrderHistoryPage",
  },
];

const SideBar = ({ isOpen, setIsOpen }) => {
  const [orderCount, setOrderCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil jumlah pesanan masuk dari API
useEffect(() => {
  const fetchOrderCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await Pesanan.getCountPesananMasuk(token);
      setOrderCount(data.jumlah || 0);
    } catch (err) {
      console.error("Gagal ambil jumlah pesanan:", err);
    }
  };

  fetchOrderCount();
  const interval = setInterval(fetchOrderCount, 30000);
  return () => clearInterval(interval);
}, []);
  const showBackButton =
    location.pathname === "/AddMenuPage" ||
    location.pathname.includes("/EditMenuPage") ||
    location.pathname.startsWith("/OrderDetailPage");

  const getActiveNav = () => {
    if (
      location.pathname === "/AddMenuPage" ||
      location.pathname.includes("/EditMenuPage")
    ) {
      return "/MenuPage";
    }

    if (location.pathname.startsWith("/OrderDetailPage")) {
      const fromState = location.state?.from;

      if (fromState === "history") return "/OrderHistoryPage";
      return "/OrderPage";
    }
    if (location.pathname === "/ProfilePage") {
      return "/DashboardPage";
    }

    return location.pathname;
  };

  const handleBack = () => {
    if (
      location.pathname === "/AddMenuPage" ||
      location.pathname.includes("/EditMenuPage")
    ) {
      navigate("/MenuPage");
    } else if (location.pathname.startsWith("/OrderDetailPage")) {
      const from = location.state?.from;
      if (from === "history") {
        navigate("/OrderHistoryPage");
      } else {
        navigate("/OrderPage");
      }
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Tombol kembali atau hamburger */}
      {!isOpen && (
        <>
          {showBackButton && (
            <button
              className="fixed top-4 left-5 z-50 bg-primary rounded-full p-2 text-black lg:hidden"
              onClick={handleBack}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
          )}
          {!showBackButton && (
            <button
              className="fixed top-4 left-5 z-50 shadow bg-white text-gray-700 rounded-full p-2 lg:hidden"
              onClick={() => setIsOpen(true)}
            >
              <FaBars className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-secondary px-4 py-4 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="my-2 mb-4 flex items-center justify-between lg:justify-center shadow-lg">
          <div className="flex items-center space-x-2">
            {isOpen && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-primary text-black font-bold shadow lg:hidden -mt-8 mr-7"
              >
                <LiaTimesSolid className="w-4 h-4" />
              </button>
            )}
            <img
              src="/images/logo.png"
              alt="PasMeal"
              className="rounded-full h-10 w-10 mb-2"
            />
            <h1 className="text-xl text-primary font-bold">PasMeal</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2 text-white font-semibold">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`flex items-center px-3 py-2 rounded transition-all duration-200 ${
                  getActiveNav() === item.link
                    ? "bg-gray-400/70 text-white shadow"
                    : "hover:bg-gray-400/60 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="relative flex items-center">
                  {item.name}
                  {item.name === "Pesanan" && orderCount > 0 && (
                    <span className="ml-17 bg-primary text-white text-base font-bold px-2 py-0.5 rounded-full">
                      {orderCount}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
