import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Layout
import DashboardLayout from "./pages/Layouts/AppLayout";
import AuthLayout from "./pages/Layouts/AuthLayout";

// Auth Pages
import Splash from "./components/Splash";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import RegisterPage from "./pages/AuthPage/RegisterPage";
import OtpPage from "./pages/AuthPage/OtpPage";
import RegisterTokoPage from "./pages/AuthPage/RegisterTokoPage";
import ForgotPassPage from "./pages/AuthPage/ForgotPassPage";
import NewPassPage from "./pages/AuthPage/NewPassPage";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import EditMenuPage from "./pages/EditMenuPage";
import AddMenuPage from "./pages/AddMenuPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/AuthPage/ProfilePage";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // cek token dari URL (auto login)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      navigate("/OrderPage", { replace: true });
    }
  }, [location, navigate]);

  // loading splash
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Splash />;

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<MainPage />} />
        <Route path="LoginPage" element={<LoginPage />} />
        <Route path="RegisterPage" element={<RegisterPage />} />
        <Route path="OtpPage" element={<OtpPage />} />
        <Route path="RegisterTokoPage" element={<RegisterTokoPage />} />
        <Route path="ForgotPassPage" element={<ForgotPassPage />} />
        <Route path="NewPassPage" element={<NewPassPage />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="DashboardPage" element={<DashboardPage />} />
        <Route path="MenuPage" element={<MenuPage />} />
        <Route path="OrderPage" element={<OrderPage type="masuk" />} />
        <Route
          path="OrderHistoryPage"
          element={<OrderHistoryPage type="riwayat" />}
        />
        <Route path="MenuPage/EditMenuPage/:id" element={<EditMenuPage />} />
        <Route path="AddMenuPage" element={<AddMenuPage />} />
        <Route path="OrderDetailPage/:type/:id" element={<OrderDetailPage />} />
        <Route path="ProfilePage" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppWrapper;
