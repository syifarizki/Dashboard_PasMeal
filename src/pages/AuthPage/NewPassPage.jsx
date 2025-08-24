import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputPassword from "../../components/Input/InputPassword";
import Notification from "../../components/Popup/Notification";
import { AuthApi } from "../../services/Auth";

const NewPassPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil token dari query string
  const token = new URLSearchParams(location.search).get("token");

  const showSuccessAlert = () => {
    setAlertData({
      iconImage: "/images/berhasil.png",
      title: "Berhasil",
      message: "Kata sandi telah diperbarui",
      buttonText: "Oke",
      buttonAction: () => {
        setShowAlert(false);
        navigate("/LoginPage");
      },
    });
    setShowAlert(true);
  };

  const showErrorAlert = (message) => {
    setAlertData({
      iconImage: "/images/gagal.png",
      title: "Gagal",
      message,
      buttonText: "Tutup",
      buttonAction: () => setShowAlert(false),
    });
    setShowAlert(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Kata sandi wajib Baru diisi.";
    else if (password.length < 8)
      newErrors.password = "Kata sandi minimal 8 karakter.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Konfirmasi kata sandi Baru wajib diisi.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Konfirmasi tidak sama dengan kata sandi Baru.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showErrorAlert("Token tidak ditemukan atau sudah kadaluarsa.");
      return;
    }

    if (!validate()) return;

    try {
      await AuthApi.resetPassword({ token, password, confirmPassword });
      showSuccessAlert();
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Terjadi kesalahan, coba lagi.";
      showErrorAlert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 text-center bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-start pt-40 lg:pt-50 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          {/* Back button on small screen */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/ForgotPassPage")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Lupa Kata Sandi</h2>
          </div>

          {/* Logo & Instruction */}
          <div className="flex flex-col -mt-20 mb-8">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Permintaan atur ulang kata sandi diterima. Silakan masukkan kata
              sandi baru Anda
            </h5>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputPassword
              label="Kata Sandi Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi Baru"
              errorMessage={errors.password}
            />

            <InputPassword
              label="Konfirmasi Kata Sandi Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Kata Sandi Baru"
              errorMessage={errors.confirmPassword}
            />

            <PrimaryButton
              type="submit"
              text="Ubah Kata Sandi"
              className="w-full mt-2"
            />
          </form>
        </div>
      </div>

      {/* Notification */}
      <Notification
        show={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertData}
      />
    </div>
  );
};

export default NewPassPage;
