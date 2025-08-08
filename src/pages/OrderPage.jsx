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

const OrderPage = () => {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrderList(storedOrders);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrderList(storedOrders);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Ambil hanya pesanan yang belum selesai
  const activeOrders = orderList.filter(
    (order) => order.status !== "Pesanan Selesai"
  );

  const transformedData = activeOrders.map((order, idx) => ({
    No: idx + 1,
    "Nama Pelanggan": order.name,
    Tanggal: order.time,
    Harga: order.total,
    "Status Pesanan": order.status,
    Detail: order.orderNumber,
  }));

  return (
    <div className="p-4 overflow-y-auto h-full mt-15 space-y-4">
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <img
            src="/images/emptyorder.png"
            alt="Belum ada pesanan"
            className="w-48 mb-4"
          />
          <p className="text-orange-500 font-bold text-lg">Belum Ada Pesanan</p>
        </div>
      ) : (
        <>
          <div className="block lg:hidden space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.orderNumber}
                onClick={() =>
                  navigate(`/OrderDetailPage/${order.orderNumber}`, {
                    state: { from: "order" },
                  })
                }
                className="cursor-pointer active:scale-[0.98] transition-transform duration-150"
              >
                <OrderCard {...order} />
              </div>
            ))}
          </div>

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
                "Status Pesanan": (row) => {
                  const status =
                    row["Status Pesanan"] === "Sudah Dikirim"
                      ? "Pesanan Diproses"
                      : row["Status Pesanan"];

                  return (
                    <span
                      className={`font-semibold text-base ${
                        row["Status Pesanan"] === "Menunggu Diproses"
                          ? "text-[#005B96]"
                          : row["Status Pesanan"] === "Pesanan diproses" ||
                            row["Status Pesanan"] === "Sudah Dikirim"
                          ? "text-green-600"
                          : "text-[#005B96]"
                      }`}
                    >
                      {status}
                    </span>
                  );
                },
                Detail: (row) => (
                  <button
                    onClick={() =>
                      navigate(`/OrderDetailPage/${row.Detail}`, {
                        state: { from: "order" },
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

export default OrderPage;
