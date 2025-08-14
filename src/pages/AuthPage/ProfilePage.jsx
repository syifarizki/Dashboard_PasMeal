import React, { useState, useEffect } from "react";
import Profile from "../../components/Profile/Profile";
import ProfileToko from "../../components/Profile/ProfileToko";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "akun"
  );

  // Simpan tab aktif ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="w-full mt-20 max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-gray-300">
      {/* Tab Buttons */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("akun")}
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "akun"
              ? "text-white bg-primary"
              : "text-gray-600 border-b"
          } rounded-t-lg`}
        >
          Edit Profil
        </button>
        <button
          onClick={() => setActiveTab("toko")}
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "toko"
              ? "text-white bg-primary"
              : "text-gray-600 border-b"
          } rounded-t-lg`}
        >
          Edit Toko
        </button>
      </div>

      {/* Tab Content */}
      <div className="my-5 mx-6">
        {activeTab === "akun" && <Profile />}
        {activeTab === "toko" && <ProfileToko />}
      </div>
    </div>
  );
};

export default ProfilePage;
