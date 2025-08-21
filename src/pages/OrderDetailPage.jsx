import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import ConfirmationModal from "../components/Popup/ConfirmationModal";
import OrderStatus from "../components/Order/OrderStatus";
import OrderCustomerInfo from "../components/Order/OrderCustomerInfo";
import OrderDetails from "../components/Order/OrderDetail";
import { Pesanan } from "../services/Pesanan";

const statusKeyMap = {
  "pesanan diproses": "processing",
  "siap diambil": "ready",
  "pesanan diantar": "delivering",
  "pesanan selesai": "done",
};

const OrderDetailPage = () => {
  const { id, type } = useParams(); // ⬅️ ambil dari URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("menunggu diproses");
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isRiwayat = type === "riwayat"; // ⬅️ tentuin dari param

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/LoginPage");
          return;
        }

        let response = null;
        try {
          if (isRiwayat) {
            response = await Pesanan.getDetailRiwayatPesanan(id, token);
          } else {
            response = await Pesanan.getDetailPesananMasuk(id, token);
          }
        } catch (err) {
          console.error("Gagal ambil detail pesanan (API utama):", err);
          if (isRiwayat) {
            try {
              response = await Pesanan.getDetailPesananMasuk(id, token);
              console.log("Fallback ke pesanan masuk berhasil");
            } catch (fallbackErr) {
              console.error("Fallback gagal:", fallbackErr);
            }
          }
        }

        if (response) {
          setOrder(response);
          setStatus(
            (response.status_label || "menunggu diproses").toLowerCase()
          );
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Kesalahan tidak terduga:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate, isRiwayat]);

  const updateStatus = async (newStatusLabel) => {
    if (!order) return;

    const normalizedStatus = newStatusLabel.toLowerCase();
    const newStatusKey = statusKeyMap[normalizedStatus];

    if (!newStatusKey) {
      return console.error(
        `Key untuk status "${newStatusLabel}" tidak ditemukan.`
      );
    }

    try {
      const token = localStorage.getItem("token");
      await Pesanan.updateStatusPesanan(id, newStatusKey, token);

      setOrder((prev) => ({ ...prev, status_label: newStatusLabel }));
      setStatus(normalizedStatus);
    } catch (err) {
      console.error("Gagal update status pesanan:", err);
      alert("Gagal memperbarui status pesanan. Silakan coba lagi.");
    }
  };

  const handleStatusChange = () => {
    if (status === "menunggu diproses") {
      updateStatus("Pesanan diproses");
    } else if (status === "pesanan diproses") {
      setShowConfirmModal(true);
    } else if (status === "pesanan diantar" || status === "siap diambil") {
      updateStatus("Pesanan Selesai");
    }
  };

  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    const tipe = order?.tipe_pengantaran?.toLowerCase();
    if (tipe === "ambil sendiri") {
      updateStatus("Siap Diambil");
    } else {
      updateStatus("Pesanan Diantar");
    }
  };

  if (loading) return <div className="p-4">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-4">Pesanan tidak ditemukan.</div>;

  const getButtonText = () => {
    if (status === "menunggu diproses") return "Proses Pesanan";
    if (status === "pesanan diproses") {
      return order?.tipe_pengantaran?.toLowerCase() === "ambil sendiri"
        ? "Pesanan Siap Diambil"
        : "Kirim Pesanan";
    }
    if (status === "pesanan diantar") return "Pesanan Sudah Diantar";
    if (status === "siap diambil") return "Pesanan Sudah Diambil";
    return "";
  };

  return (
    <div className="relative p-6 px-4 max-w-6xl mx-auto bg-white mt-15">
      <OrderStatus order={order} />

      <div className="lg:flex lg:rounded-xl lg:overflow-hidden lg:shadow-sm lg:border lg:border-gray-300">
        <OrderCustomerInfo
          order={order}
          showDetail={showDetail}
          setShowDetail={setShowDetail}
        />
        <div className="hidden lg:block w-px bg-gray-300" />
        <OrderDetails order={order} />
      </div>

      {!isRiwayat && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
          <div className="w-full max-w-6xl">
            {status !== "pesanan selesai" &&
              status !== "selesai" &&
              getButtonText() && (
                <PrimaryButton
                  text={getButtonText()}
                  onClick={handleStatusChange}
                  className="w-full py-3 rounded-full"
                />
              )}
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          title={
            order?.tipe_pengantaran?.toLowerCase() === "ambil sendiri"
              ? "Siap Diambil Sekarang?"
              : "Kirim Pesanan Sekarang?"
          }
          description={
            order?.tipe_pengantaran?.toLowerCase() === "ambil sendiri"
              ? "Pastikan pesanan kamu sudah siap untuk diambil."
              : "Pastikan pesanan kamu sudah siap untuk dikirim."
          }
          confirmText={
            order?.tipe_pengantaran?.toLowerCase() === "ambil sendiri"
              ? "Sudah"
              : "Kirim Sekarang"
          }
          cancelText="Batal"
          onConfirm={handleConfirmSend}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;
