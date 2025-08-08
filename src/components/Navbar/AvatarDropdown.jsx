import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const dropdownRef = useRef(null);

  const isProfileComplete = false;
  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !isProfileComplete) {
        setShowNotification(true);
      }
      return next;
    });
  };

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          {/* Notifikasi profil belum lengkap */}
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
            className="flex items-center gap-2 px-4 py-2 text-base text-black font-bold"
            onClick={closeDropdown}
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
            Edit Profil
          </Link>

          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-base text-black font-bold border-t text-left"
            onClick={() => {
              closeDropdown();
              // handleLogout();
            }}
          >
            <TbLogout2 className="w-5 h-5" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
