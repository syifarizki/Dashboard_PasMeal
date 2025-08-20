import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import ConfirmationModal from "../components/Popup/ConfirmationModal";
import OrderStatus from "../components/Order/OrderStatus";
import OrderCustomerInfo from "../components/Order/OrderCustomerInfo";
import OrderDetails from "../components/Order/OrderDetail";
import { Pesanan } from "../services/Pesanan";

const OrderDetailPage = () => {
  const { id } = useParams(); // ambil id dari URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch order detail dari backend
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/LoginPage");
          return;
        }

        const response = await Pesanan.getDetailPesananMasuk(id, token);
        setOrder(response);
        setStatus(response.status_label || response.status || "Pending");
      } catch (err) {
        console.error("Gagal ambil detail pesanan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate]);

  // Update status di frontend
  const updateStatus = (newStatus) => {
    if (!order) return;
    setOrder({ ...order, status: newStatus });
    setStatus(newStatus);
  };

  const handleStatusChange = () => {
    if (status === "Menunggu Diproses") {
      updateStatus("Pesanan diproses");
    } else if (status === "Pesanan diproses") {
      setShowConfirmModal(true);
    } else if (status === "Pesanan Diantar" || status === "Siap Diambil") {
      updateStatus("Pesanan Selesai");
    }
  };

  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    if (order?.tipe_pengantaran === "Ambil Sendiri") {
      updateStatus("Siap Diambil");
    } else {
      updateStatus("Pesanan Diantar");
    }
  };

  if (loading) return <div className="p-4">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-4">Pesanan tidak ditemukan.</div>;

  return (
    <div className="relative p-6 px-4 max-w-6xl mx-auto bg-white mt-15">
      <OrderStatus status={status} />

      <div className="lg:flex lg:rounded-xl lg:overflow-hidden lg:shadow-sm lg:border lg:border-gray-300">
        <OrderCustomerInfo
          order={order}
          showDetail={showDetail}
          setShowDetail={setShowDetail}
        />
        <div className="hidden lg:block w-px bg-gray-300" />
        <OrderDetails order={order} />
      </div>

      {/* Tombol Aksi */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
        <div className="w-full max-w-6xl">
          {status !== "Pesanan Selesai" && (
            <PrimaryButton
              text={
                status === "Menunggu Diproses"
                  ? "Proses Pesanan"
                  : status === "Pesanan diproses"
                  ? order?.tipe_pengantaran === "Ambil Sendiri"
                    ? "Pesanan Siap Diambil"
                    : "Kirim Pesanan"
                  : status === "Pesanan Diantar"
                  ? "Pesanan Sudah Diantar"
                  : status === "Siap Diambil"
                  ? "Pesanan Sudah Diambil"
                  : ""
              }
              onClick={handleStatusChange}
              className="w-full py-3 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <ConfirmationModal
          title={
            order?.tipe_pengantaran === "Ambil Sendiri"
              ? "Siap Diambil Sekarang?"
              : "Kirim Pesanan Sekarang?"
          }
          description={
            order?.tipe_pengantaran === "Ambil Sendiri"
              ? "Pastikan pesanan kamu sudah siap untuk diambil?"
              : "Pastikan pesanan kamu sudah siap untuk dikirim?"
          }
          confirmText={
            order?.tipe_pengantaran === "Ambil Sendiri"
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
