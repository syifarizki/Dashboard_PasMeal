import React, { useState, useEffect } from "react";
import ImageUpload from "../Input/ImageUpload";
import InputText from "../Input/InputText";
import TextArea from "../Input/TextArea";
import PrimaryButton from "../Button/PrimaryButton";
import Notification from "../Popup/Notification";
import { Kios } from "../../services/Kios";

const ProfileToko = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [originalData, setOriginalData] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  // State popup notif
  const [notif, setNotif] = useState({
    show: false,
    title: "",
    message: "",
    iconImage: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await Kios.getKios(token);

        setStoreName(data.nama_kios || "");
        setDescription(data.deskripsi || "");
        setBankName(data.nama_bank || "");
        setAccountNumber(data.nomor_rekening || "");
        if (data.gambar_kios) {
          setImagePreview(data.gambar_kios);
        }
        setOriginalData(data);
      } catch (error) {
        console.error("Gagal memuat data kios:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setStoreName(originalData.nama_kios || "");
      setDescription(originalData.deskripsi || "");
      setBankName(originalData.nama_bank || "");
      setAccountNumber(originalData.nomor_rekening || "");
      setImagePreview(originalData.gambar_kios || null);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      await Kios.updateKios({
        nama_kios: storeName,
        deskripsi: description,
        nama_bank: bankName,
        nomor_rekening: accountNumber,
        gambar_kios: imageFile,
        token,
      });

      setNotif({
        show: true,
        title: "Berhasil",
        message: "Profil toko berhasil diperbarui!",
        iconImage: "/images/berhasil.png", 
      });
    } catch (error) {
      console.error("Gagal update kios:", error);
      setNotif({
        show: true,
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data",
        iconImage: "/images/gagal.png", 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md border border-gray-300"
      >
        <h5 className="text-xl font-bold mb-6 -mt-3">Edit Toko Disini</h5>
        <hr className="border-t border-black -mt-4 mb-4" />

        <div className="flex justify-center">
          <ImageUpload image={imagePreview} onImageChange={handleImageUpload} />
        </div>

        <div className="space-y-4 mt-4">
          <InputText
            label="Nama Toko"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Masukkan nama toko"
          />
          <TextArea
            label="Deskripsi Toko"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi toko"
            rows={3}
          />
          <InputText
            label="Nama Bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Masukkan nama bank"
          />
          <InputText
            label="Nomor Rekening"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Masukkan nomor rekening"
          />
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <PrimaryButton
            text="Batal"
            onClick={handleCancel}
            className="px-6"
            type="button"
          />
          <PrimaryButton
            text={isSaving ? "Menyimpan..." : "Simpan"}
            type="submit"
            className="px-6"
            disabled={isSaving}
          />
        </div>
      </form>

      {/* Notification */}
      <Notification
        show={notif.show}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
        iconImage={notif.iconImage}
        title={notif.title}
        message={notif.message}
      />
    </>
  );
};

export default ProfileToko;
