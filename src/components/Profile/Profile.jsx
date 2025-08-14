import React, { useState, useEffect } from "react";
import InputText from "../../components/Input/InputText";
import InputPhone from "../../components/Input/InputPhone";
import InputEmail from "../../components/Input/InputEmail";
import PrimaryButton from "../../components/Button/PrimaryButton";
import Notification from "../../components/Popup/Notification";
import { Penjual } from "../../services/Penjual";

const Profile = () => {
  const [name, setName] = useState("");
  const [noPhone, setNoPhone] = useState("");
  const [email, setEmail] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await Penjual.getProfile(token);
        if (res.data) {
          setName(res.data.nama || "");
          setNoPhone(res.data.no_hp || "");
          setEmail(res.data.email || "");
          setInitialData(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
      }
    };
    loadProfile();
  }, [token]);

  const handleCancel = () => {
    if (initialData) {
      setName(initialData.nama || "");
      setNoPhone(initialData.no_hp || "");
      setEmail(initialData.email || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Penjual.updateProfile({
        nama: name,
        no_hp: noPhone,
        email: email,
        token,
      });
      if (res.data) {
        setInitialData(res.data);
        setShowPopup(true); 
      }
    } catch (err) {
      console.error("Gagal update profil:", err);
      alert("Gagal memperbarui profil");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md border border-gray-300"
      >
        <h5 className="text-xl font-bold mb-6 -mt-3">Edit Profil Disini</h5>
        <hr className="border-t border-black -mt-4 mb-5" />
        <div>
          <InputText
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
          />
          <InputPhone
            label="Nomor WhatsApp"
            value={noPhone}
            onChange={setNoPhone}
            placeholder="Nomor WhatsApp"
          />
          <InputEmail
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <PrimaryButton
            type="button"
            text="Batal"
            onClick={handleCancel}
            className="px-4 py-2"
          />
          <PrimaryButton type="submit" text="Simpan" className="px-4 py-2" />
        </div>
      </form>

      {/* Popup notifikasi */}
      <Notification
        show={showPopup}
        onClose={() => setShowPopup(false)}
        iconImage="/images/berhasil.png" 
        title="Berhasil!"
        message="Profil berhasil diperbarui."
        buttonText="Tutup"
      />
    </>
  );
};

export default Profile;
