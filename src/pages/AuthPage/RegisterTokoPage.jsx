import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputText from "../../components/Input/InputText";
import { AuthApi } from "../../services/Auth";

const RegisterKiosPage = () => {
  const [namaToko, setNamaToko] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMsg("Token tidak ditemukan, silakan login ulang.");
        setLoading(false);
        return;
      }

      await AuthApi.registerKios({
        namaToko,
        namaBank: namaRekening,
        noRekening,
        token,
      });

      navigate("/LoginPage");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal mendaftarkan toko.");
    } finally {
      setLoading(false);
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
          {/* Back Button */}
          <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => navigate("/OtpPage")}
              className="p-2 rounded-full bg-primary text-black font-extrabold hover:bg-orange-600 transition"
              aria-label="Kembali"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-bold text-black">Daftar Akun</h2>
          </div>

          {/* Logo */}
          <div className="flex flex-col -mt-20 mb-8">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-2"
            />
            <h5 className="text-md text-black font-medium text-center">
              Daftarkan Toko Anda untuk mulai penjualan
            </h5>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-500 text-sm mb-2 text-center">{errorMsg}</p>
          )}

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
              type="submit"
              text={loading ? "Menyimpan..." : "Lanjut"}
              className="w-full mt-2"
              disabled={!namaToko || !namaRekening || !noRekening || loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterKiosPage;
