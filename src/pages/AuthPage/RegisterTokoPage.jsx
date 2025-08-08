import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputText from "../../components/Input/InputText";

const RegisterKiosPage = () => {
  const [namaToko, setNamaToko] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register toko clicked");
    console.log("Nama Toko:", namaToko);
    console.log("Nama Rekening:", namaRekening);
    console.log("Nomor Rekening:", noRekening);
    navigate("/LoginPage");
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* === Left Slider === */}
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 text-center bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      {/* === Right Otp Form === */}
      <div className="relative flex items-start pt-40 lg:pt-50  justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          {/* Back Button and Title */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Daftar Akun</h2>
          </div>

          {/* Logo */}
          <div className="flex flex-col -mt-20 mb-8 ">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Daftarkan Toko Anda untuk mulai penjualan{" "}
            </h5>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputText
              type="text"
              label="Nama Toko"
              value={namaToko}
              onChange={(e) => setNamaToko(e.target.value)}
              placeholder="Nama Toko"
            />
            <InputText
              type="text"
              label="Nama Rekening"
              value={namaRekening}
              onChange={(e) => setNamaRekening(e.target.value)}
              placeholder="Nama Rekening"
            />
            <InputText
              type="text"
              label="Nomor Rekening"
              value={noRekening}
              onChange={(e) => setNoRekening(e.target.value)}
              placeholder="Nomor Rekening"
            />

            <PrimaryButton
              text="Lanjut"
              onClick={handleSubmit}
              className="w-full mt-2"
              disabled={!namaToko || !namaRekening || !noRekening}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterKiosPage;