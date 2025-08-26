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
import { getImageUrl } from "../../utils/imageHelper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ITEMS_PER_PAGE = 5;

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load menu dari API
  const loadMenus = useCallback(async () => {
    try {
      const { data, total } = await Menu.getMenusPaginated(
        token,
        currentPage,
        ITEMS_PER_PAGE
      );
      setMenus(data);
      setTotalItems(total);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
    }
  }, [token, currentPage]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Ambil success message dari navigasi (contoh: setelah tambah menu)
  useEffect(() => {
    if (location.state?.success) {
      showSuccess(location.state.success);

      // Hapus state dari history biar gak muncul lagi kalau refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fungsi helper tampilkan notif sukses
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Hapus menu
  const handleDelete = (id) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== id));
    setTotalItems((prev) => prev - 1);
    setSelectedMenu(null);
    showSuccess("Berhasil menghapus menu");
  };

  // Toggle status stok menu (OPTIMISTIC UPDATE)
  const handleToggleStock = async (id, currentStock) => {
    const newStockStatus = !currentStock;

    // 1. Perbarui UI secara instan
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === id ? { ...menu, status_tersedia: newStockStatus } : menu
      )
    );

    try {
      // 2. Kirim permintaan ke server di latar belakang
      const payload = { status_tersedia: newStockStatus };
      await Menu.updateMenu(id, payload, token);

      showSuccess("Berhasil mengubah status menu");
    } catch (err) {
      console.error("Gagal memperbarui status menu:", err);

      // 3. Jika gagal, kembalikan UI ke state semula
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id ? { ...menu, status_tersedia: currentStock } : menu
        )
      );
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatPrice = (price) =>
    price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const columns = ["Nama Menu", "Harga", "Status Stok", "Aksi"];
  const customRender = {
    "Nama Menu": (menu) => (
      <div className="flex items-center gap-3">
        <LazyLoadImage
          src={getImageUrl(menu.foto_menu)}
          alt={menu.nama_menu || "Menu"}
          effect="blur"
          placeholderSrc="/images/menudefault.jpg"
          className="w-14 h-14 object-cover rounded-xl border border-gray-200"
          onError={(e) => {
            e.currentTarget.src = "/images/menudefault.jpg";
          }}
        />
        <span className="font-semibold text-lg text-black">
          {menu.nama_menu}
        </span>
      </div>
    ),
    Harga: (menu) => (
      <span className="text-base">Rp. {formatPrice(menu.harga)}</span>
    ),
    "Status Stok": (menu) => (
      <div className="ml-6">
        <ToggleSwitch
          checked={menu.status_tersedia}
          onChange={() => handleToggleStock(menu.id, menu.status_tersedia)}
        />
      </div>
    ),
    Aksi: (menu) => (
      <button
        onClick={() => setSelectedMenu(menu)}
        className="text-primary cursor-pointer"
      >
        <IoMdEye className="w-8 h-8" />
      </button>
    ),
  };

  return (
    <div className="flex flex-col mt-20 items-center min-h-[60vh] w-full px-4">
      {/* Notifikasi Sukses */}
      {successMessage && (
        <div className="fixed bottom-[6.5rem] z-30 bg-green-600 text-white px-4 py-2 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Kondisi kalau kosong */}
      {menus.length === 0 && totalItems === 0 ? (
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
            {menus.map((menu, index) => (
              <div
                key={menu.id || index}
                onClick={() => setSelectedMenu(menu)}
                className={`cursor-pointer flex items-center bg-white p-4 hover:bg-gray-50 transition-colors ${
                  index !== menus.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <img
                  src={getImageUrl(menu.foto_menu)}
                  alt={menu.nama_menu || "Menu"}
                  className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = "/images/menudefault.jpg";
                  }}
                />

                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {menu.nama_menu}
                  </h2>
                  <p className="text-black">Rp. {formatPrice(menu.harga)}</p>
                </div>
                <HiChevronRight className="w-10 h-10 text-black" />
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block w-full max-w-6xl mt-4 px-4">
            <Table
              columns={columns}
              data={menus}
              customRender={customRender}
              rowKey="id"
            />
          </div>

          {/* Pagination */}
          <div className="mb-20 w-full max-w-6xl flex justify-end px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Tambah Menu Button */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-40 lg:ml-[256px] lg:w-[calc(100%-256px)]">
        <div className="w-full max-w-6xl">
          <PrimaryButton
            text={
              <div className="flex items-center justify-center gap-2">
                <HiPlus className="h-5 w-5" />
                <span>
                  {menus.length === 0 ? "Buat Menu Baru" : "Tambah Menu Baru"}
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
