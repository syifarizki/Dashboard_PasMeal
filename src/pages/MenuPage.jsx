import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiChevronRight, HiPlus } from "react-icons/hi";
import { IoMdEye } from "react-icons/io";
import PrimaryButton from "../components/Button/PrimaryButton";
import MenuDetail from "../components/Menu/MenuDetail";
import Table from "../components/Table";
import ToggleSwitch from "../components/Input/ToggleSwitch";

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    const storedMenus = JSON.parse(localStorage.getItem("menus")) || [];
    setMenuItems(storedMenus);
  }, []);

  useEffect(() => {
    if (location.state && location.state.success) {
      setSuccessMessage(location.state.success);
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleDelete = (id) => {
    const updatedMenus = menuItems.filter((menu) => menu.id !== id);
    setMenuItems(updatedMenus);
    localStorage.setItem("menus", JSON.stringify(updatedMenus));
    setSelectedMenu(null);
    navigate("/MenuPage", { state: { success: "Berhasil menghapus menu" } });
  };

  const handleToggleStock = (id) => {
    const updatedMenus = menuItems.map((menu) =>
      menu.id === id ? { ...menu, isAvailable: !menu.isAvailable } : menu
    );
    setMenuItems(updatedMenus);
    localStorage.setItem("menus", JSON.stringify(updatedMenus));
  };

  const columns = ["Nama Menu", "Harga", "Status Stok", "Aksi"];
  const customRender = {
    "Nama Menu": (item) => (
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.menuName}
          className="w-14 h-14 rounded-xl object-cover border border-gray-200"
        />
        <span className="font-bold text-lg text-gray-800">{item.menuName}</span>
      </div>
    ),
    Harga: (item) => (
      <span className="text-base text-black">Rp. {item.price}</span>
    ),

    "Status Stok": (item) => (
      <div className="ml-6">
        <ToggleSwitch
          checked={item.isAvailable}
          onChange={() => handleToggleStock(item.id)}
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
    <div className="flex flex-col mt-20 items-center min-h-[60vh]">
      {successMessage && (
        <div className="fixed bottom-[6.5rem] z-30 bg-green-600 text-white text-base font-medium px-4 py-2 rounded-lg shadow-md whitespace-nowrap w-fit left-1/2 -translate-x-1/2 lg:left-[calc(16rem+50%)] lg:-translate-x-[calc(50%+8rem)]">
          {successMessage}
        </div>
      )}
      {menuItems.length === 0 ? (
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
                key={item.id}
                onClick={() => setSelectedMenu(item)}
                className={`cursor-pointer flex items-center bg-white p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.menuName}
                  className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.menuName}
                  </h2>
                  <p className="text-gray-600">Rp. {item.price}</p>
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
            />
          </div>
        </>
      )}{" "}
      {/* Tombol Tambah */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
        <div className="w-full max-w-6xl">
          <PrimaryButton
            text={
              <div className="flex items-center justify-center gap-2">
                <HiPlus className="h-5 w-5" />
                <span>
                  {menuItems.length === 0
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
      {/* Detail Dialog */}
      {selectedMenu && (
        <MenuDetail
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default MenuPage;


