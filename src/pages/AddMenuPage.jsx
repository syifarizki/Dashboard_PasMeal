import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/Input/ImageUpload";
import InputText from "../components/Input/InputText";
import InputPrice from "../components/Input/InputPrice";
import TextArea from "../components/Input/TextArea";
import PrimaryButton from "../components/Button/PrimaryButton";
import ToggleSwitch from "../components/Input/ToggleSwitch";


const AddMenuPage = () => {
  const navigate = useNavigate();

  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [servingTime, setServingTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const handleImageUpload = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!menuName || !price || !description || !servingTime || !imageFile) return;

    const newMenu = {
      id: Date.now(),
      menuName,
      price,
      description,
      servingTime,
      image: imagePreview,
      isAvailable, // simpan status tersedia
    };

    const existingMenus = JSON.parse(localStorage.getItem("menus")) || [];
    const updatedMenus = [...existingMenus, newMenu];
    localStorage.setItem("menus", JSON.stringify(updatedMenus));

    // Reset form
    setMenuName("");
    setPrice("");
    setDescription(""); 
    setServingTime("");
    setImageFile(null);
    setImagePreview(null);
    setIsAvailable(true);

    navigate("/MenuPage", {
      state: { success: "Berhasil menambahkan menu" },
    });
  };

  return (
    <div className="p-6 flex flex-col items-center mt-20">
      <div
        className={`fixed top-16 left-0 right-0 px-6 py-3 z-10 transition-colors duration-300 ${
          isAvailable ? "bg-primary text-white " : "bg-gray-400/60 text-black"
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
      <form onSubmit={handleSubmit} className="w-full max-w-6xl mt-5">
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
              text="Buat Menu"
              onClick={handleSubmit}
              className="w-full py-3 rounded-full"
              disabled={!menuName || !price || !description || !servingTime || !imageFile}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddMenuPage;
