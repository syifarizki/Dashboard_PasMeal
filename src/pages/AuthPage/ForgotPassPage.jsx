import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputPhone from "../../components/Input/InputPhone";
import { AuthApi } from "../../services/Auth"; 

const ForgotPassPage = () => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      setErrorMessage("Nomor telepon harus diisi.");
      return;
    }

    try {
      const res = await AuthApi.forgotPassword(phone);
      setSuccessMessage(
        res.message || "Tautan reset kata sandi telah dikirim."
      );
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Gagal mengirim tautan reset."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* === Left Slider === */}
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 text-center bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      {/* === Right Form === */}
      <div className="relative flex items-start pt-40 lg:pt-50 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          {/* Back Button and Title */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/LoginPage")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Lupa Kata Sandi</h2>
          </div>

          {/* Logo dan Instruksi */}
          <div className="flex flex-col -mt-20 mb-8">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Masukkan nomor telepon Anda untuk atur ulang kata sandi
            </h5>
          </div>

          {successMessage && (
            <div className="text-green-600 text-sm mb-5">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-600 text-sm mb-5">{errorMessage}</div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputPhone
              label="Nomor WhatsApp"
              value={phone}
              onChange={setPhone}
              placeholder="08xxxxxxxxxx"
            />

            <PrimaryButton
              text="Kirim"
              type="submit"
              className="w-full mt-2"
              disabled={!phone}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
