import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { Pesanan } from "../services/Pesanan";

// Komponen Loading dan Error sederhana
const LoadingSpinner = () => (
  <div className="text-center p-10">Memuat pesanan...</div>
);
const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 p-10">{message}</div>
);

const columns = [
  "No",
  "Nama Pelanggan",
  "Tanggal",
  "Harga",
  "Status Pesanan",
  "Detail",
];

const ITEMS_PER_PAGE = 5;

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");

      // Ambil parameter dari URL
      const kiosIdFromUrl = searchParams.get("kiosId");
      const tokenFromUrl = searchParams.get("token");

      try {
        let data;
        // --- LOGIKA UTAMA ---
        if (kiosIdFromUrl && tokenFromUrl) {
          // Skenario 1: Akses via link WA dengan token sementara
          console.log("Mengakses via token sementara...");
          data = await Pesanan.verifyKiosToken(kiosIdFromUrl, tokenFromUrl);
        } else {
          // Skenario 2: Akses normal setelah login
          console.log("Mengakses via login normal...");
          const token = localStorage.getItem("token");
          if (!token) {
            // Jika tidak ada token sama sekali, navigasi ke login
            navigate("/LoginPage");
            return;
          }
          const response = await Pesanan.getPesananMasuk(token);
          data = response.data || []; 
        }

        const formattedData = data.map((order, index) => ({
          ...order,
          nomor: order.nomor_antrian || index + 1, 
          status: order.status_label || order.status, 
        }));

        setOrderList(formattedData);
      } catch (err) {
        console.error("Gagal ambil pesanan masuk:", err);
        setError(err.response?.data?.message || "Gagal memuat data pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    const handleFocus = () => {
      if (!searchParams.get("token")) {
        fetchOrders();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [searchParams, navigate]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  
  const transformedData = orderList.map((order) => ({
    No: order.nomor,
    "Nama Pelanggan": order.nama || order.nama_pemesan,
    Tanggal:
      order.tanggal_bayar || new Date(order.created_at).toLocaleString("id-ID"),
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
      {orderList.length === 0 ? (
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
            {orderList.map((order) => (
              <OrderCard
                key={order.id}
                nomor={order.nomor}
                nama={order.nama || order.nama_pemesan}
                no_hp={order.no_hp}
                tanggal_bayar={
                  order.tanggal_bayar ||
                  new Date(order.created_at).toLocaleString("id-ID")
                }
                total_harga={order.total_harga}
                metode_bayar={order.metode_bayar || "QRIS"}
                tipe_pengantaran={order.tipe_pengantaran}
                status={order.status}
                onClick={() => navigate(`/OrderDetailPage/${order.id}`)}
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
                    onClick={() => navigate(`/OrderDetailPage/${row.id}`)}
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
