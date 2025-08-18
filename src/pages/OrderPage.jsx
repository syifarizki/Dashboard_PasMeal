import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";
import Pagination from "../components/Pagination"; 
import { Pesanan } from "../services/Pesanan";

const columns = [
  "No",
  "Nama Pelanggan",
  "Tanggal",
  "Harga",
  "Status Pesanan",
  "Detail",
];

const ITEMS_PER_PAGE = 5; // Jumlah item per halaman

const OrderPage = () => {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await Pesanan.getPesananMasuk(token);
        setOrderList(data || []);
      } catch (err) {
        console.error("Gagal ambil pesanan masuk:", err);
      }
    };

    fetchOrders();

    const handleFocus = () => fetchOrders();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Filter pesanan yang aktif
  const activeOrders = orderList.filter((order) => order.status !== "done");

  // Transformasi data untuk tabel
  const transformedData = activeOrders.map((order) => ({
    No: order.nomor,
    "Nama Pelanggan": order.nama,
    Tanggal: order.tanggal_bayar,
    Harga: `Rp. ${Number(order.total_harga).toLocaleString("id-ID")}`,
    "Status Pesanan": order.status,
    id: order.id,
  }));

  // Pagination 
  const totalPages = Math.ceil(transformedData.length / ITEMS_PER_PAGE);
  const paginatedData = transformedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          {/* Mobile */}
          <div className="block lg:hidden space-y-4">
            {activeOrders.map((order, idx) => (
              <OrderCard
                key={order.id ?? idx}
                nomor={order.nomor}
                nama={order.nama}
                no_hp={order.no_hp}
                tanggal_bayar={order.tanggal_bayar}
                total_harga={order.total_harga}
                metode_bayar={order.metode_bayar}
                tipe_pengantaran={order.tipe_pengantaran}
                status={order.status}
                onClick={() =>
                  navigate(`/OrderDetailPage/${order.id}`, {
                    state: { from: "order" },
                  })
                }
              />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <Table
              columns={columns}
              data={paginatedData} 
              customRender={{
                No: (row) => (
                  <div className="bg-gray-200 text-gray-800 text-sm rounded px-2 py-1 inline-block font-semibold">
                    #{row.No}
                  </div>
                ),
                "Nama Pelanggan": (row) => (
                  <span className="font-bold uppercase text-base">
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
                  <span className="font-semibold text-base text-[#005B96]">
                    {row["Status Pesanan"]}
                  </span>
                ),
                Detail: (row) => (
                  <button
                    onClick={() =>
                      navigate(`/OrderDetailPage/${row.id}`, {
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
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
