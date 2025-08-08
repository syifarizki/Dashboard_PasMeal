import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ImageUpload from "../components/Input/ImageUpload";
import InputText from "../components/Input/InputText";
import InputPrice from "../components/Input/InputPrice";
import TextArea from "../components/Input/TextArea";
import PrimaryButton from "../components/Button/PrimaryButton";
import ToggleSwitch from "../components/Input/ToggleSwitch";

const EditMenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // ambil ID dari URL
  const menuFromState = location.state;

  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [servingTime, setServingTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [menuId, setMenuId] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    let selectedMenu = menuFromState;

    // Jika tidak ada data dari state, coba cari dari localStorage berdasarkan ID
    if (!selectedMenu && id) {
      const menus = JSON.parse(localStorage.getItem("menus")) || [];
      selectedMenu = menus.find((m) => m.id === id);
    }

    if (!selectedMenu) {
      navigate("/MenuPage");
      return;
    }

    setMenuName(selectedMenu.menuName || "");
    setPrice(selectedMenu.price || "");
    setDescription(selectedMenu.description || "");
    setServingTime(selectedMenu.servingTime || "");
    setImagePreview(selectedMenu.image || null);
    setMenuId(selectedMenu.id || id);

    setIsAvailable(selectedMenu.isAvailable ?? true);
  }, [menuFromState, id, navigate]);

  const handleImageUpload = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!menuName || !price || !description || !servingTime || !imagePreview) return;

    const updatedMenu = {
      id: menuId,
      menuName: menuName,
      price: price,
      description: description,
      servingTime: servingTime,
      image: imagePreview,
      isAvailable,
    };

    const existingMenus = JSON.parse(localStorage.getItem("menus")) || [];
    const updatedMenus = existingMenus.map((menu) =>
      menu.id === updatedMenu.id ? updatedMenu : menu
    );

    localStorage.setItem("menus", JSON.stringify(updatedMenus));

    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  return (
    <div className="p-6 flex flex-col items-center mt-20">
      {/* Menu Tersedia Full Width */}
      <div
        className={`fixed top-16 left-0 right-0 px-6 py-3 z-10 transition-colors duration-300 ${
          isAvailable ? "bg-orange-500 text-white" : "bg-gray-400/60 text-black"
        } lg:ml-64`}
      >
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-semibold text-lg">Menu Tersedia</span>
          <ToggleSwitch
            checked={isAvailable}
            onChange={() => setIsAvailable(!isAvailable)}
          />
        </div>
      </div>

      {showNotif && (
        <div
          className="fixed bottom-[6.5rem] z-30
             bg-green-600 text-white text-base font-medium
             px-4 py-2 rounded-lg shadow-md
             whitespace-nowrap w-fit
             left-1/2 -translate-x-1/2
             lg:left-[calc(16rem+50%)] lg:-translate-x-[calc(50%+8rem)]"
        >
          Berhasil Mengubah Menu
        </div>
      )}

      <form onSubmit={handleUpdate} className="w-full max-w-6xl mt-5">
        <div className="flex justify-center mb-4">
          <ImageUpload image={imagePreview} onImageChange={handleImageUpload} />
        </div>

        <InputText
          type="text"
          label="Nama Menu"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Nama Menu"
        />

        <InputPrice
          label="Harga"
          value={price}
          onChange={setPrice}
          placeholder="Harga"
        />

        <TextArea
          label="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
        />
        <InputText
          type="text"
          label="Waktu Penyajian (menit)"
          value={servingTime}
          onChange={(e) => setServingTime(e.target.value)}
          placeholder="Waktu Penyajian (menit)"
        />

        <div className="fixed bottom-6 inset-x-0 flex justify-center px-10 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
          <div className="w-full max-w-6xl">
            <PrimaryButton
              text="Simpan"
              onClick={handleUpdate}
              className="w-full py-3 rounded-full"
              disabled={!menuName || !price || !description || !imagePreview}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditMenuPage;