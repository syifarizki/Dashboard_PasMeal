import React, { useState } from "react";
import ImageUpload from "../Input/ImageUpload";
import InputText from "../Input/InputText";
import TextArea from "../Input/TextArea";
import PrimaryButton from "../Button/PrimaryButton";

const ProfileToko = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset semua field
  const handleCancel = () => {
    setStoreName("");
    setDescription("");
    setBankName("");
    setAccountNumber("");
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit data (bisa ganti console.log jadi API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data disimpan:", {
      storeName,
      description,
      bankName,
      accountNumber,
      imageFile,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg shadow-md border border-gray-300"
    >
      <h5 className="text-xl font-bold mb-6 -mt-3">Edit Toko Disini</h5>
      <hr className="border-t border-black -mt-4 mb-4" />

      {/* Upload Gambar */}
      <div className="flex justify-center">
          <div className="flex justify-center -mb-3">
            <ImageUpload
              image={imagePreview}
              onImageChange={handleImageUpload}
            />
          </div>
      </div>

      {/* Form Input */}
      <div className="space-y-4">
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

      {/* Tombol Aksi */}
      <div className="flex justify-end mt-6 gap-2">
        <PrimaryButton
          text="Batal"
          onClick={handleCancel}
          className="px-6"
          type="button"
        />
        <PrimaryButton text="Simpan" type="submit" className="px-6 " />
      </div>
    </form>
  );
}

export default ProfileToko;