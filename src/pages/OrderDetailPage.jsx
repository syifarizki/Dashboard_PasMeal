import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PrimaryButton from "../components/Button/PrimaryButton";
import ConfirmationModal from "../components/Popup/ConfirmationModal";
import OrderStatus from "../components/Order/OrderStatus";
import OrderCustomerInfo from "../components/Order/OrderCustomerInfo";
import OrderDetails from "../components/Order/OrderDetail";

const OrderDetailPage = () => {
  const { orderNumber } = useParams(); 
  const [order, setOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [status, setStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = storedOrders.find(
      (o) => o.orderNumber === parseInt(orderNumber)
    );
    if (foundOrder) {
      setOrder(foundOrder);
      setStatus(foundOrder.status);
    }
  }, [orderNumber]);

  const updateStatus = (newStatus) => {
    if (!order) return;
    const updatedOrder = { ...order, status: newStatus };
    setStatus(newStatus);
    setOrder(updatedOrder);
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = storedOrders.map((o) =>
      o.orderNumber === order.orderNumber ? updatedOrder : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
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
   if (order?.table === "Ambil Sendiri") {
     updateStatus("Siap Diambil");
   } else {
     updateStatus("Pesanan Diantar");
   }
 };


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

      <div className="fixed bottom-6 inset-x-0 flex justify-center px-8 z-50 lg:ml-[256px] lg:w-[calc(100%-256px)]">
        <div className="w-full max-w-6xl">
          {status !== "Pesanan Selesai" && (
            <PrimaryButton
              text={
                status === "Menunggu Diproses"
                  ? "Proses Pesanan"
                  : status === "Pesanan diproses"
                  ? order?.table === "Ambil Sendiri"
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

      {showConfirmModal && (
        <ConfirmationModal
          title={
            order?.table === "Ambil Sendiri"
              ? "Siap Diambil Sekarang?"
              : "Kirim Pesanan Sekarang?"
          }
          description={
            order?.table === "Ambil Sendiri"
              ? "Pastikan pesanan kamu sudah siap untuk diambil?"
              : "Pastikan pesanan kamu sudah siap untuk dikirim?"
          }
          confirmText={
            order?.table === "Ambil Sendiri"
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
