import React, { useEffect, useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { Penjual } from "../../services/Penjual";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [namaUser, setNamaUser] = useState("User");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await Penjual.getProfile(token);
      if (res?.data?.nama) {
        setNamaUser(res.data.nama);
      } else if (res?.nama) {
        setNamaUser(res.nama);
      } else {
        setNamaUser("User");
      }
    } catch (error) {
      console.error("Gagal memuat profil penjual:", error);
      setNamaUser("User");
    }
  };

  useEffect(() => {
    fetchUser(); // fetch saat pertama kali load

    // Refresh nama user secara berkala setiap 1 detik
    const interval = setInterval(fetchUser, 1000);
    return () => clearInterval(interval); // bersihkan interval saat unmount
  }, []);

  const getPageInfo = () => {
    if (location.pathname.startsWith("/MenuPage/EditMenuPage")) {
      return {
        title: "Ubah Menu",
        className: "text-primary font-extrabold text-xl md:text-3xl",
        showBackButton: true,
        centered: true,
      };
    }

    if (location.pathname.startsWith("/OrderDetailPage")) {
      const from = location.state?.from;
      const title =
        from === "history" ? "Detail Riwayat Pesanan" : "Detail Pesanan";

      return {
        title,
        className: "text-primary font-extrabold text-xl md:text-3xl",
        showBackButton: true,
        centered: true,
      };
    }

    switch (location.pathname) {
      case "/MenuPage":
        return {
          title: "Daftar Menu",
          className: "text-primary font-extrabold text-xl md:text-3xl",
          showBackButton: false,
          centered: true,
        };
      case "/OrderPage":
        return {
          title: "Pesanan",
          className: "text-primary font-extrabold text-xl md:text-3xl",
          showBackButton: false,
          centered: true,
        };
      case "/OrderHistoryPage":
        return {
          title: "Riwayat Pesanan",
          className: "text-primary font-extrabold text-xl md:text-3xl",
          showBackButton: false,
          centered: true,
        };
      case "/AddMenuPage":
        return {
          title: "Buat Menu Baru",
          className: "text-primary font-extrabold text-xl md:text-3xl",
          showBackButton: true,
          centered: true,
        };
      default:
        return {
          title: `Selamat Datang, ${namaUser}.`,
          className: "text-black font-medium text-lg md:text-2xl",
          showBackButton: false,
          centered: false,
        };
    }
  };

  const { title, className, showBackButton, centered } = getPageInfo();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-30 shadow-lg px-4 py-2 flex items-center pl-4 pr-4 md:pl-6 md:pr-6 lg:pl-10 lg:pr-10 lg:ml-64 justify-between">
      <div className="flex items-center justify-between lg:justify-center shadow-none">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-primary text-black font-bold shadow mr-5 -ml-3 hidden lg:block cursor-pointer"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h1
          className={`${className} ${
            centered
              ? "text-center absolute left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0"
              : "text-left ml-14 lg:ml-0"
          }`}
        >
          {title}
        </h1>
      </div>

      <div className="ml-auto">
        <AvatarDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
