import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputText from "../../components/Input/InputText";
import InputPassword from "../../components/Input/InputPassword";
import Notification from "../../components/Popup/Notification";
import { AuthApi } from "../../services/Auth"; 

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const navigate = useNavigate();

  const showSuccessAlert = () => {
    setAlertData({
      iconImage: "/images/berhasil.png",
      title: "Berhasil",
      message: "Selamat datang di PasMeal!",
      buttonText: "Oke",
      buttonAction: () => {
        setShowAlert(false);
        navigate("/DashboardPage");
      },
    });
    setShowAlert(true);
  };

  const showErrorAlert = (message = "Nama atau kata sandi salah") => {
    setAlertData({
      iconImage: "/images/gagal.png",
      title: "Gagal",
      message: message,
      buttonText: "Coba Lagi",
    });
    setShowAlert(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthApi.login(name, password);

      // misalnya API balikin token dan user data
      if (res?.token) {
        // simpan token ke localStorage
        localStorage.setItem("token", res.token);

        // kalau rememberMe aktif, bisa simpan name/password juga
        if (rememberMe) {
          localStorage.setItem("rememberName", name);
        } else {
          localStorage.removeItem("rememberName");
        }

        showSuccessAlert();
      } else {
        showErrorAlert(res?.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errMsg =
        error?.response?.data?.message || "Terjadi kesalahan pada server";
      showErrorAlert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Slider */}
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 text-center bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      {/* Right Form */}
      <div className="relative flex items-start pt-40 lg:pt-50 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          {/* Back Button */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Masuk</h2>
          </div>

          {/* Logo */}
          <div className="flex flex-col -mt-20 mb-8">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Silahkan masuk ke Akun Anda
            </h5>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputText
              type="text"
              label="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
            />
            <InputPassword
              label="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
            />
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 border-gray-300 cursor-pointer"
                />
                Ingatkan saya
              </label>
              <Link
                to="/ForgotPassPage"
                className="text-orange-500 font-medium"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            <PrimaryButton
              text="Masuk"
              onClick={handleSubmit}
              className="w-full"
              disabled={!name || !password}
            />
          </form>

          {/* Register */}
          <div className="mt-4 text-sm text-center text-gray-500">
            Tidak memiliki akun?{" "}
            <Link to="/RegisterPage" className="text-orange-500 font-medium">
              Daftar Disini
            </Link>
          </div>
        </div>
      </div>

      {/* Popup Alert */}
      <Notification
        show={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertData}
      />
    </div>
  );
};

export default LoginPage;
