import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";
import OnboardingSlider from "../components/OnboardingSlider";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white grid grid-rows-[auto_1fr_auto] lg:grid-rows-1 lg:grid-cols-2">
      {/* Logo Section - Mobile/Tablet Only */}
      <div className="lg:hidden pt-10 px-6 text-center">
        <h1 className="text-3xl font-bold md:text-6xl md:font-extrabold ">
          <span className="text-secondary">Pas</span>
          <span className="text-orange-500">Meal</span>
        </h1>
      </div>
      {/* Slider Section */}
      <div className="flex flex-col justify-center items-center px-6 lg:px-12 text-center lg:bg-gray-50 lg:row-span-1">
        <div className="max-w-md">
          {/* Gunakan komponen OnboardingSlider tanpa props activeIndex atau onboardings */}
          <OnboardingSlider />
        </div>
      </div>
      {/* Logo and Button Section */}
      <div className="flex flex-col justify-center items-center lg:px-12 lg:bg-white lg:shadow-xl lg:shadow-black lg:row-span-1">
        {/* Logo - Desktop Only */}
        <div className="hidden lg:block max-w-md w-full">
          <h1 className="text-6xl font-extrabold mb-16 text-center">
            <span className="text-secondary">Pas</span>
            <span className="text-orange-500">Meal</span>
          </h1>
        </div>
        {/* Button Section */}
        <div className="w-full lg:max-w-md mt-10 lg:mt-0">
          <div className="bg-orange-500 px-6 pt-8 lg:px-8 lg:pt-12 pb-10 lg:pb-12 rounded-t-3xl lg:rounded-3xl space-y-4 lg:space-y-6 flex flex-col items-center">
            <PrimaryButton
              text="Masuk"
              onClick={() => navigate("/LoginPage")}
              className="w-[80%] max-w-[300px]"
            />

            <SecondaryButton
              text="Daftar Akun"
              onClick={() => navigate("/RegisterPage")}
              className="w-[80%] max-w-[300px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;

