import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { AuthApi } from "../../services/Auth";
import { Penjual } from "../../services/Penjual";
import { Kios } from "../../services/Kios";

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchProfileStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [penjualRes, kiosRes] = await Promise.all([
        Penjual.getProfile(token),
        Kios.getKios(token),
      ]);

      const penjual = penjualRes?.data || penjualRes;
      const kios = kiosRes?.data || kiosRes;

      const penjualLengkap =
        Boolean(penjual?.nama) &&
        Boolean(penjual?.no_hp) &&
        Boolean(penjual?.email);

      const kiosLengkap =
        Boolean(kios?.nama_kios) &&
        Boolean(kios?.deskripsi) &&
        Boolean(kios?.nama_bank) &&
        Boolean(kios?.nomor_rekening) &&
        Boolean(kios?.gambar_kios);

      if (penjualLengkap && kiosLengkap) {
        setIsProfileComplete(true);
        setShowNotification(false);
      } else {
        setIsProfileComplete(false);
        setShowNotification(true);
      }
    } catch (err) {
      console.error("Gagal cek kelengkapan profil:", err);
    }
  };

  const toggleDropdown = async () => {
    if (!isOpen) {
      await fetchProfileStatus(); // ✅ Cek ulang setiap kali dibuka
    }
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/LoginPage");
        return;
      }
      await AuthApi.logout(token);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/LoginPage");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  useEffect(() => {
    fetchProfileStatus(); // Cek saat pertama kali load
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full">
            <img
              src="/images/images.jpg"
              alt="User Avatar"
              className="object-cover w-full h-full rounded-full cursor-pointer"
            />
          </div>
          {isOpen ? (
            <FiChevronUp className="text-gray-600 h-8 w-8 cursor-pointer" />
          ) : (
            <FiChevronDown className="text-gray-600 h-8 w-8 cursor-pointer" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
          {/* Notifikasi hanya muncul jika profil belum lengkap */}
          {!isProfileComplete && showNotification && (
            <div
              className="absolute 
                w-[80vw] max-w-[140px] 
                -left-[149px] 
                md:max-w-[310px] md:-left-[320px] 
                top-1 
                bg-white border border-primary rounded-lg shadow-lg 
                py-4 px-2 md:p-4 text-black z-20"
            >
              <p className="text-xs md:text-base font-medium leading-snug break-words">
                Profil kamu belum lengkap! Unggah foto dan isi deskripsi toko
                agar lebih menarik.
              </p>

              <div className="absolute -right-2 top-6 w-4 h-4 bg-white border-t border-r border-primary rotate-45 z-[-1]" />

              <button
                className="absolute bottom-2 right-2 p-1 rounded-full bg-black text-white font-bold"
                onClick={() => setShowNotification(false)}
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}

          <Link
            to="/ProfilePage"
            className="flex items-center gap-2 px-4 py-2 text-base text-black font-bold cursor-pointer"
            onClick={closeDropdown}
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
            Edit Profil
          </Link>

          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-base text-black font-bold border-t text-left cursor-pointer"
            onClick={() => {
              closeDropdown();
              handleLogout();
            }}
          >
            <TbLogout2 className="w-5 h-5" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
