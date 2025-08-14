import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/Input/ImageUpload";
import InputText from "../components/Input/InputText";
import InputPrice from "../components/Input/InputPrice";
import TextArea from "../components/Input/TextArea";
import PrimaryButton from "../components/Button/PrimaryButton";
import ToggleSwitch from "../components/Input/ToggleSwitch";
import { Menu } from "../services/Menu";

const EditMenuPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [servingTime, setServingTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/images/menudefault.jpg");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const menuDetail = await Menu.getMenuById(id, token);
        setMenuName(menuDetail.nama_menu || "");
        setPrice(menuDetail.harga?.toString() || "");
        setDescription(menuDetail.deskripsi || "");
        setServingTime(menuDetail.estimasi_menit?.toString() || "");
        setImagePreview(menuDetail.foto_menu_full || "/images/menudefault.jpg");
        setIsAvailable(menuDetail.status_tersedia ?? true);
      } catch (error) {
        console.error("Gagal mengambil detail menu:", error);
        navigate("/MenuPage");
      }
    };
    fetchMenuDetail();
  }, [id, navigate, token]);

  const handleImageUpload = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!menuName || !price || !description || !servingTime) return;

    try {
      setLoading(true);
      if (imageFile) {
        const formData = new FormData();
        formData.append("nama_menu", menuName);
        formData.append("harga", Number(price.replace(/\./g, "")));
        formData.append("deskripsi", description);
        formData.append("estimasi_menit", Number(servingTime));
        formData.append("status_tersedia", isAvailable);
        formData.append("foto_menu", imageFile);
        await Menu.updateMenu(id, formData, token, true);
      } else {
        const payload = {
          nama_menu: menuName,
          harga: Number(price.replace(/\./g, "")),
          deskripsi: description,
          estimasi_menit: Number(servingTime),
          status_tersedia: isAvailable,
        };
        await Menu.updateMenu(id, payload, token, false);
      }
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      navigate("/MenuPage", { state: { success: "Berhasil mengubah menu" } });
    } catch (error) {
      console.error("Gagal mengubah menu:", error);
      alert("Gagal mengubah menu. Cek console untuk detail error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center mt-20">
      <div
        className={`fixed top-16 left-0 right-0 px-6 py-3 z-10 ${
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
        <div className="fixed bottom-[6.5rem] z-30 bg-green-600 text-white text-base font-medium px-4 py-2 rounded-lg shadow-md whitespace-nowrap w-fit left-1/2 -translate-x-1/2 lg:left-[calc(16rem+50%)] lg:-translate-x-[calc(50%+8rem)]">
          Berhasil Mengubah Menu
        </div>
      )}

      <form onSubmit={handleUpdate} className="w-full max-w-6xl mt-5">
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

        <div className="fixed bottom-6 inset-x-0 flex justify-center px-10 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
          <div className="w-full max-w-6xl">
            <PrimaryButton
              text={loading ? "Menyimpan..." : "Simpan"}
              type="submit"
              className="w-full py-3 rounded-full"
              disabled={
                loading || !menuName || !price || !description || !servingTime
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMenuPage;
