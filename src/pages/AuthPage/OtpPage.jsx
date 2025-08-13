import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState(null); // pesan hijau/merah
  const [resendStatus, setResendStatus] = useState(null); // "success" | "error"

  const navigate = useNavigate();
  const no_hp = localStorage.getItem("no_hp") || "";

  // Setup timer awal
  useEffect(() => {
    const savedExpirationTime = localStorage.getItem("otpExpirationTime");

    if (savedExpirationTime) {
      const expirationTime = parseInt(savedExpirationTime, 10);
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.floor((expirationTime - currentTime) / 1000)
      );

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setCanResend(false);
      } else {
        setTimer(0);
        setCanResend(true);
      }
    } else {
      const expirationTime = Date.now() + 180 * 1000;
      localStorage.setItem("otpExpirationTime", expirationTime.toString());
      setTimer(180);
      setCanResend(false);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer]);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  // Notification untuk verifikasi sukses
  const showSuccessAlert = () => {
    setAlertData({
      iconImage: "/images/berhasil.png",
      title: "Selamat",
      message: "Akun Anda telah terdaftar",
      buttonText: "Oke",
      buttonAction: () => {
        setShowAlert(false);
        navigate("/LoginPage");
      },
    });
    setShowAlert(true);
  };

  // Notification untuk verifikasi gagal
  const showErrorAlert = (message) => {
    setAlertData({
      iconImage: "/images/gagal.png",
      title: "Gagal",
      message: message || "Kode OTP tidak valid. Silakan coba lagi.",
      buttonText: "Oke",
    });
    setShowAlert(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek OTP expired
    const savedExpirationTime = localStorage.getItem("otpExpirationTime");
    const currentTime = Date.now();
    if (
      !savedExpirationTime ||
      parseInt(savedExpirationTime, 10) < currentTime
    ) {
      showErrorAlert("Kode OTP Anda telah kadaluwarsa. Silakan kirim ulang.");
      setTimer(0);
      setCanResend(true);
      return;
    }

    if (!kode_otp) return;

    try {
      setLoading(true);
      const res = await AuthApi.verifyOtp({ no_hp, kode_otp });
      localStorage.setItem("token", res.token);
      localStorage.removeItem("otpExpirationTime");
      showSuccessAlert();
    } catch (error) {
      showErrorAlert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await AuthApi.resendOtp(no_hp);

      // Reset timer & expiry
      const expirationTime = Date.now() + 180 * 1000;
      localStorage.setItem("otpExpirationTime", expirationTime.toString());
      setTimer(180);
      setCanResend(false);
      setKodeOtp("");

      setResendMessage("Kode OTP baru telah dikirim.");
      setResendStatus("success");
    } catch (err) {
      setResendMessage(err.response?.data?.message || "Gagal mengirim OTP.");
      setResendStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left slider */}
      <div className="hidden lg:flex justify-center items-center px-6 lg:px-12 bg-gray-50">
        <div className="max-w-md w-full">
          <OnboardingSlider />
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex items-start pt-40 lg:pt-50 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
        <div className="w-full max-w-sm">
          {/* Back button */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/RegisterTokoPage")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Daftar Akun</h2>
          </div>

          {/* Logo & instructions */}
          <div className="flex flex-col -mt-20 mb-4">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Masukkan kode verifikasi yang dikirim ke nomor WhatsApp
            </h5>
          </div>

          {/* Pesan OTP kirim ulang */}
          {resendMessage && (
            <p
              className={`text-sm mb-2 ${
                resendStatus === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {resendMessage}
            </p>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputText
              type="text"
              label="Kode OTP"
              value={kode_otp}
              onChange={(e) => setKodeOtp(e.target.value)}
              placeholder="Kode OTP"
            />

            {/* Resend & Timer */}
            <div className="flex items-center justify-between my-4 text-xs md:text-sm">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-black">Tidak mendapatkan kode OTP?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  className={`transition-colors cursor-pointer ${
                    canResend ? "text-primary" : "text-black cursor-not-allowed"
                  }`}
                  disabled={!canResend}
                >
                  Kirim ulang
                </button>
              </div>
              <span className="font-medium text-black">
                {formatTime(timer)}
              </span>
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

      {/* Notification Popup */}
      <Notification
        show={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertData}
      />
    </div>
  );
};

export default OtpPage;
