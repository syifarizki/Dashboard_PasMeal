import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import OnboardingSlider from "../../components/OnboardingSlider";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputText from "../../components/Input/InputText";
import InputPassword from "../../components/Input/InputPassword";
import InputPhone from "../../components/Input/InputPhone";
import InputEmail from "../../components/Input/InputEmail";

const RegisterPage = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [name, setName] = useState("");
  const [noPhone, setNoPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!noPhone.trim()) newErrors.noPhone = "Nomor WhatsApp wajib diisi.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email wajib diisi.";
    else if (!emailRegex.test(email))
      newErrors.email = "Format email tidak valid.";

    if (!password) newErrors.password = "Kata sandi wajib diisi.";
    else if (password.length < 8)
      newErrors.password = "Kata sandi minimal 8 karakter.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Konfirmasi tidak sama dengan kata sandi.";

    if (!agreeToTerms)
      newErrors.terms = "Anda harus menyetujui syarat dan kebijakan.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Registrasi berhasil");
      navigate("/OtpPage");
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

      {/* Right Register Form */}
      <div className="relative flex items-start pt-40 lg:pt-30 justify-center px-6 lg:px-12 bg-white shadow-xl shadow-black">
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
            <h2 className="text-2xl font-bold text-black">Daftar Akun</h2>
          </div>

          {/* Logo */}
          <div className="flex flex-col -mt-20 mb-5">
            <img
              src="/images/pasmeal.png"
              alt="PasMeal"
              className="w-100 mb-1 lg:w-90"
            />
            <h5 className="text-md text-black font-medium text-center">
              Daftarkan akun Anda untuk melanjutkan
            </h5>
          </div>

          {/* Form */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            <InputText
              label="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama"
              errorMessage={errors.name}
            />
            <InputPhone
              label="Nomor WhatsApp"
              value={noPhone}
              onChange={setNoPhone}
              placeholder="Nomor WhatsApp"
              errorMessage={errors.noPhone}
            />

            <InputEmail
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              errorMessage={errors.email}
            />

            <InputPassword
              label="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              errorMessage={errors.password}
            />

            <InputPassword
              label="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Kata Sandi"
              errorMessage={errors.confirmPassword}
            />
            <div className="mb-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-gray-700 text-sm ">
                Saya menyetujui semua{" "}
                <span className="text-primary font-semibold">
                  Syarat dan Kebijakan Privasi
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
              )}
            </div>

            <PrimaryButton
              text="Daftar"
              onClick={handleSubmit}
              className="w-full"
            />
          </form>

          {/* Link ke login */}
          <div className="mt-2 text-sm text-center text-gray-500">
            Anda sudah memiliki akun?{" "}
            <a href="/LoginPage" className="text-orange-500 font-medium">
              Masuk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;



