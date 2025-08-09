import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputText from "../../components/Input/InputText";
import Notification from "../../components/Popup/Notification";
import { AuthApi } from "../../services/Auth";

const OtpPage = () => {
  const [kode_otp, setKodeOtp] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const no_hp = location.state?.no_hp || "";

  const showSuccessAlert = () => {
    setAlertData({
      iconImage: "/images/berhasil.png",
      title: "Selamat",
      message: "Akun Anda telah terdaftar",
      buttonText: "Oke",
      buttonAction: () => {
        setShowAlert(false);
        navigate("/RegisterTokoPage");
      },
    });
    setShowAlert(true);
  };

  const showErrorAlert = (message) => {
    setAlertData({
      iconImage: "/images/gagal.png",
      title: "Gagal",
      message:
        message ||
        "Kode OTP yang Anda masukkan tidak valid. Silakan coba lagi.",
      buttonText: "Oke",
    });
    setShowAlert(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kode_otp) return;

    try {
      setLoading(true);
      const res = await AuthApi.verifyOtp({ no_hp, kode_otp });
      console.log("OTP sukses:", res);
      showSuccessAlert();
    } catch (error) {
      console.error("OTP gagal:", error);
      showErrorAlert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 text-center bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      <div className="relative flex items-start pt-40 lg:pt-50 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/RegisterPage")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Daftar Akun</h2>
          </div>

          <div className="flex flex-col -mt-20 mb-8">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Masukkan kode verifikasi yang dikirim ke nomor WhatsApp
            </h5>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputText
              type="text"
              label="Kode OTP"
              value={kode_otp}
              onChange={(e) => setKodeOtp(e.target.value)}
              placeholder="Kode OTP"
            />
            <div className="flex justify-between items-center text-sm">
              <p className="flex items-center gap-2">Belum mendapatkan kode?</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Fitur kirim ulang OTP belum tersedia.");
                }}
                className="text-orange-500 font-medium"
              >
                Kirim ulang
              </button>
            </div>

            <PrimaryButton
              type="submit"
              text={loading ? "Memverifikasi..." : "Verifikasi"}
              className="w-full"
              disabled={!kode_otp || loading}
            />
          </form>
        </div>
      </div>

      <Notification
        show={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertData}
      />
    </div>
  );
};

export default OtpPage;
