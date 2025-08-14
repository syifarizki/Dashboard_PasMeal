import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../Popup/ConfirmationModal";
import { Menu } from "../../services/Menu";

const MenuDetail = ({ menu, onClose, onDelete }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!menu) return null;

  const handleEdit = () => {
    navigate(`/MenuPage/EditMenuPage/${menu.id}`);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await Menu.deleteMenu(menu.id, token);
      onDelete(menu.id); // update list menu di parent
      onClose();
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      alert("Gagal menghapus menu. Cek console untuk detail error.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="fixed z-60 top-0 left-0 right-0 bottom-0 lg:top-[64px] lg:left-[256px] bg-black/20 flex items-end justify-center">
      {!showConfirm && (
        <div className="bg-white w-full lg:max-w-[calc(100vw-256px)] rounded-t-xl p-4 shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-primary text-black font-bold"
          >
            <LiaTimesSolid className="w-4 h-4 cursor-pointer font-extrabold" />
          </button>

          <div className="space-y-3 p-4">
            <div className="grid grid-cols-[10rem_1fr] gap-x-4">
              <span className="text-base font-bold">Nama Menu</span>
              <span className="text-base">{menu.nama_menu}</span>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-x-4">
              <span className="text-base font-bold">Harga</span>
              <span className="text-base">Rp. {menu.harga}</span>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-x-4">
              <span className="text-base font-bold">Deskripsi</span>
              <span className="text-base">{menu.deskripsi}</span>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-x-4">
              <span className="text-base font-bold">Waktu Penyajian</span>
              <span className="text-base">{menu.estimasi_menit} menit</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-xl shadow cursor-pointer"
            >
              <HiOutlinePencilSquare className="w-5 h-5" />
              <span>Ubah</span>
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-xl shadow cursor-pointer"
            >
              <RiDeleteBin6Line className="w-5 h-5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmationModal
          title={`Hapus Menu "${menu.nama_menu}"?`}
          description="Menu yang sudah dihapus tidak dapat dikembalikan. Apakah Anda yakin untuk menghapusnya?"
          confirmText={loading ? "Menghapus..." : "Ya, hapus"}
          cancelText="Batal"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default MenuDetail;
