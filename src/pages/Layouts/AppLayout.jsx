import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import SideBar from "../../components/Navbar/SideBar.jsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".toggle-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="transition-all duration-300 lg:ml-64">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
