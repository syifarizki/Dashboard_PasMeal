import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { Pesanan } from "../services/Pesanan";

const LoadingSpinner = () => (
  <div className="text-center p-15">Memuat riwayat pesanan...</div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 p-15">{message}</div>
);

const columns = [
  "No",
  "Nama Pelanggan",
  "Tanggal",
  "Harga",
  "Status Pesanan",
  "Detail",
];

// Styling status
const getStatusStyles = (status) => {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "pesanan selesai":
      return "text-[#005B96]";
    default:
      return "text-gray-500";
  }
};

// Format tanggal konsisten
const formatTanggal = (tanggal) => {
  if (!tanggal) return "N/A";
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(tanggal)
    .toLocaleString("id-ID", options)
    .replace(/\./g, ":") 
    .replace(",", "") 
    .replace("pukul ", ""); 
};

const OrderHistoryPage = ({ type = "riwayat" }) => {
  const navigate = useNavigate();
  const [riwayatList, setRiwayatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 const fetchRiwayat = useCallback(
   async (page = 1) => {
     setIsLoading(true);
     setError("");
     try {
       const token = localStorage.getItem("token");
       if (!token) {
         navigate("/LoginPage");
         return;
       }

       const response = await Pesanan.getRiwayatPesanan(token, page);

       const formattedData = (response.data || []).map((order, index) => ({
         id: order.id,
         nomor: (page - 1) * 8 + index + 1,
         nama: order.nama_pemesan || "Tidak diketahui",
         no_hp: order.no_hp || "-", 
         tanggal_bayar:
           order.tanggal_bayar ?? order.created_at ?? new Date().toISOString(),
         total_harga: Number(order.total_harga) || 0,
         metode_bayar: order.metode_bayar || order.payment_type || "N/A",
         tipe_pengantaran: order.tipe_pengantaran || "-",
         status: order.status === "done" ? "Pesanan Selesai" : order.status,
       }));

       setRiwayatList(formattedData);
       setTotalPages(response.totalPages || 1);
     } catch (err) {
       console.error("Gagal mengambil riwayat pesanan:", err);
       setError(err.response?.data?.message || "Gagal memuat data riwayat.");
     } finally {
       setIsLoading(false);
     }
   },
   [navigate]
 );


  useEffect(() => {
    fetchRiwayat(currentPage);
    const handleFocus = () => fetchRiwayat(currentPage);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [currentPage, fetchRiwayat]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const transformedData = riwayatList.map((order) => ({
    No: order.nomor,
    "Nama Pelanggan": order.nama,
    Tanggal: formatTanggal(order.tanggal_bayar),
    Harga: `Rp ${order.total_harga.toLocaleString("id-ID")}`,
    "Status Pesanan": order.status,
    id: order.id,
    raw: order,
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
          {/* Mobile */}
          <div className="block lg:hidden space-y-4">
            {riwayatList.map((order) => (
              <div
                key={order.id}
                onClick={() =>
                  navigate(`/OrderDetailPage/${type}/${order.id}`, {
                    state: { from: "history" },
                  })
                }
                className="cursor-pointer active:scale-[0.98] transition-transform duration-150"
              >
                <OrderCard
                  {...order}
                  tanggal_bayar={formatTanggal(order.tanggal_bayar)}
                  no_hp={order.no_hp}
                />
              </div>
            ))}
          </div>

          {/* Desktop */}
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
                  <span
                    className={`px-3 py-1 text-base rounded-full font-semibold inline-block ${getStatusStyles(
                      row["Status Pesanan"]
                    )}`}
                  >
                    {row["Status Pesanan"]}
                  </span>
                ),
                Detail: (row) => (
                  <button
                    onClick={() =>
                      navigate(`/OrderDetailPage/${type}/${row.id}`)
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

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1} 
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
