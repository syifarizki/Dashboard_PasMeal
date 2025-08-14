import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/Input/ImageUpload";
import InputText from "../components/Input/InputText";
import InputPrice from "../components/Input/InputPrice";
import TextArea from "../components/Input/TextArea";
import PrimaryButton from "../components/Button/PrimaryButton";
import ToggleSwitch from "../components/Input/ToggleSwitch";
import { Menu } from "../services/Menu";

const AddMenuPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [servingTime, setServingTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuName || !price || !description || !servingTime || !imageFile)
      return;

    const formData = new FormData();
    formData.append("nama_menu", menuName);
    formData.append("harga", Number(price.replace(/\./g, "")));
    formData.append("deskripsi", description);
    formData.append("estimasi_menit", Number(servingTime));
    formData.append("status_tersedia", isAvailable);
    formData.append("foto_menu", imageFile);

    try {
      setLoading(true);
      const newMenu = await Menu.addMenu(formData, token);

      // langsung navigasi ke MenuPage dan bawa menu baru agar langsung tampil
      navigate("/MenuPage", {
        state: { success: "Berhasil menambahkan menu", newMenu },
      });
    } catch (err) {
      console.error("Gagal tambah menu:", err);
      alert("Gagal menambahkan menu. Cek console untuk detail error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center mt-20">
      <div
        className={`fixed top-16 left-0 right-0 px-6 py-3 z-10 ${
          isAvailable ? "bg-primary text-white" : "bg-gray-400/60 text-black"
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
          label="Nama Menu"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
        />
        <InputPrice label="Harga" value={price} onChange={setPrice} />
        <TextArea
          label="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputText
          label="Waktu Penyajian (menit)"
          value={servingTime}
          onChange={(e) => setServingTime(e.target.value)}
        />

        <div className="fixed bottom-6 inset-x-0 flex justify-center px-10 z-50 lg:ml-[256px]">
          <div className="w-full max-w-6xl">
            <PrimaryButton
              text={loading ? "Menyimpan..." : "Buat Menu"}
              type="submit"
              className="w-full py-3 rounded-full"
              disabled={
                loading ||
                !menuName ||
                !price ||
                !description ||
                !servingTime ||
                !imageFile
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMenuPage;
