import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiChevronRight, HiPlus } from "react-icons/hi";
import { IoMdEye } from "react-icons/io";
import PrimaryButton from "../components/Button/PrimaryButton";
import MenuDetail from "../components/Menu/MenuDetail";
import Table from "../components/Table";
import ToggleSwitch from "../components/Input/ToggleSwitch";
import Pagination from "../components/Pagination";
import { Menu } from "../services/Menu";

const ITEMS_PER_PAGE = 5;

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 

  // Load menu dari API
  const loadMenus = useCallback(async () => {
    try {
      const response = await Menu.getMenusPaginated(
        token,
        currentPage,
        ITEMS_PER_PAGE
      );
      if (Array.isArray(response.data)) {
        setMenuItems(response.data);
        setTotalItems(response.total); 
      }
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
    }
  }, [token, currentPage]); 

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Hapus newMenu dari navigasi state
  useEffect(() => {
    if (location.state?.newMenu) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.newMenu]);

  // Hapus menu
  const handleDelete = (id) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    setTotalItems((prev) => prev - 1); // Kurangi total item
    setSelectedMenu(null);
    setSuccessMessage("Berhasil menghapus menu");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Toggle status stok menu
  const handleToggleStock = async (id, currentStock) => {
    try {
      const payload = { status_tersedia: !currentStock };
      const updatedMenu = await Menu.updateMenu(id, payload, token, false);

      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status_tersedia: updatedMenu.status_tersedia }
            : m
        )
      );
      setSuccessMessage("Berhasil mengubah status menu");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatPrice = (price) =>
    price !== undefined && price !== null
      ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "";

  // Pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const columns = ["Nama Menu", "Harga", "Status Stok", "Aksi"];
  const customRender = {
    "Nama Menu": (item) => (
      <div className="flex items-center gap-3">
        <img
          src={item.foto_menu_full || "/images/menudefault.jpg"}
          alt={item.nama_menu}
          className="w-14 h-14 rounded-xl object-cover border border-gray-200"
        />
        <span className="font-semibold text-lg text-black">
          {item.nama_menu}
        </span>
      </div>
    ),
    Harga: (item) => (
      <span className="text-base">Rp. {formatPrice(item.harga)}</span>
    ),
    "Status Stok": (item) => (
      <div className="ml-6">
        <ToggleSwitch
          checked={item.status_tersedia}
          onChange={() => handleToggleStock(item.id, item.status_tersedia)}
        />
      </div>
    ),
    Aksi: (item) => (
      <button
        onClick={() => setSelectedMenu(item)}
        className="text-primary cursor-pointer"
      >
        <IoMdEye className="w-8 h-8" />
      </button>
    ),
  };

  return (
    <div className="flex flex-col mt-20 items-center min-h-[60vh] w-full px-4">
      {successMessage && (
        <div className="fixed bottom-[6.5rem] z-30 bg-green-600 text-white px-4 py-2 rounded-lg">
          {successMessage}
        </div>
      )}

      {menuItems.length === 0 && totalItems === 0 ? (
        <div className="flex flex-col items-center text-center mt-10 px-6">
          <img
            src="/images/empty.png"
            alt="Daftar Kosong"
            className="w-64 h-auto mb-6"
          />
          <h2 className="text-primary font-bold text-lg mb-2">
            Daftar Menu Kosong
          </h2>
          <p className="text-black">
            Mulai dengan buat menu <br /> atau unggah menu melalui dashboard
          </p>
        </div>
      ) : (
        <>
          {/* Mobile List */}
          <div className="w-full max-w-2xl border border-gray-300 rounded-xl overflow-hidden md:hidden">
            {menuItems.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => setSelectedMenu(item)}
                className={`cursor-pointer flex items-center bg-white p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                <img
                  src={item.foto_menu_full || "/images/menudefault.jpg"}
                  alt={item.nama_menu}
                  className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.nama_menu}
                  </h2>
                  <p className="text-black">Rp. {formatPrice(item.harga)}</p>
                </div>
                <HiChevronRight className="w-10 h-10 text-black" />
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block w-full max-w-6xl mt-4 px-4">
            <Table
              columns={columns}
              data={menuItems}
              customRender={customRender}
              rowKey="id"
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Tambah Menu Button */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
        <div className="w-full max-w-6xl">
          <PrimaryButton
            text={
              <div className="flex items-center justify-center gap-2">
                <HiPlus className="h-5 w-5" />
                <span>
                  {menuItems.length === 0 && totalItems === 0
                    ? "Buat Menu Baru"
                    : "Tambah Menu Baru"}
                </span>
              </div>
            }
            onClick={() => navigate("/AddMenuPage")}
            className="w-full py-3 rounded-full"
          />
        </div>
      </div>

      {selectedMenu && (
        <MenuDetail
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MenuPage;
