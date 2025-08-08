import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";

const columns = [
  "No",
  "Nama Pelanggan",
  "Tanggal",
  "Harga",
  "Status Pesanan",
  "Detail",
];

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [riwayatList, setRiwayatList] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const filtered = storedOrders.filter(
      (order) => order.status === "Pesanan Selesai"
    );
    setRiwayatList(filtered);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const filtered = storedOrders.filter(
        (order) => order.status === "Pesanan Selesai"
      );
      setRiwayatList(filtered);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const transformedData = riwayatList.map((order, idx) => ({
    No: idx + 1,
    "Nama Pelanggan": order.name,
    Tanggal: order.time,
    Harga: order.total,
    "Status Pesanan": order.status,
    Detail: order.orderNumber,
  }));

  return (
    <div className="p-4 overflow-y-auto h-full mt-15 space-y-4">
      {riwayatList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <img
            src="/images/emptyorder.png"
            alt="Belum ada riwayat"
            className="w-48 mb-4"
          />
          <p className="text-orange-500 font-bold text-lg">
            Belum Ada Riwayat Pesanan
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {riwayatList.map((order) => (
              <div
                key={order.orderNumber}
                onClick={() =>
                  navigate(`/OrderDetailPage/${order.orderNumber}`, {
                    state: { from: "history" },
                  })
                }
                className="cursor-pointer active:scale-[0.98] transition-transform duration-150"
              >
                <OrderCard {...order} />
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <Table
              columns={columns}
              data={transformedData}
              customRender={{
                No: (row) => (
                  <div className="bg-gray-200 text-gray-800 text-sm rounded px-2 py-1 inline-block font-semibold">
                    #{row.No}
                  </div>
                ),
                "Nama Pelanggan": (row) => (
                  <span className="font-bold uppercase">
                    {row["Nama Pelanggan"]}
                  </span>
                ),
                Tanggal: (row) => (
                  <span className="text-primary font-medium text-base">
                    {row.Tanggal}
                  </span>
                ),
                Harga: (row) => (
                  <span className="text-black font-medium text-base">
                    {row.Harga}
                  </span>
                ),
                "Status Pesanan": (row) => (
                  <span className="font-semibold text-[#005B96] text-base">
                    {row["Status Pesanan"]}
                  </span>
                ),
                Detail: (row) => (
                  <button
                    onClick={() =>
                      navigate(`/OrderDetailPage/${row.Detail}`, {
                        state: { from: "history" },
                      })
                    }
                    className="text-primary cursor-pointer"
                    title="Lihat Detail"
                  >
                    <IoMdEye className="w-7 h-7" />
                  </button>
                ),
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
