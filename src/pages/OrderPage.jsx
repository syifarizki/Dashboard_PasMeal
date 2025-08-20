import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { Pesanan } from "../services/Pesanan";

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

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError("");

      const kiosIdFromUrl = searchParams.get("kiosId");
      const tokenFromUrl = searchParams.get("token");

      try {
        let response;
        if (kiosIdFromUrl && tokenFromUrl) {
          response = await Pesanan.verifyKiosToken(kiosIdFromUrl, tokenFromUrl);
        } else {
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/LoginPage");
            return;
          }
          response = await Pesanan.getPesananMasuk(token, page);
        }

        // backend sudah return { page, totalPages, data }
        const { data = [], totalPages = 1 } = response;

        const formattedData = (Array.isArray(data) ? data : []).map(
          (order, index) => ({
            ...order,
            id: order.id,
            nomor: order.nomor_antrian || index + 1,
            nama: order.nama || order.nama_pemesan || "Tidak diketahui",
            no_hp: order.no_hp || "-",
            created_at: order.created_at || new Date().toISOString(),
            tanggal_bayar: order.tanggal_bayar || null,
            total_harga: Number(order.total_harga) || 0,
            metode_bayar: order.metode_bayar || "QRIS",
            tipe_pengantaran: order.tipe_pengantaran || "-",
            status: order.status_label || order.status || "Pending",
          })
        );

        setOrderList(formattedData);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Gagal ambil pesanan masuk:", err);
        setError(err.response?.data?.message || "Gagal memuat data pesanan.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, navigate] // dependency untuk useCallback
  );

  useEffect(() => {
    fetchOrders(currentPage);

    const handleFocus = () => {
      if (!searchParams.get("token")) {
        fetchOrders(currentPage);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [searchParams, currentPage, fetchOrders]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const transformedData = orderList.map((order) => ({
    No: order.nomor,
    "Nama Pelanggan": order.nama,
    Tanggal:
      order.tanggal_bayar || new Date(order.created_at).toLocaleString("id-ID"),
    Harga: `Rp. ${order.total_harga.toLocaleString("id-ID")}`,
    "Status Pesanan": order.status,
    id: order.id,
    raw: order, // simpan original buat mobile
  }));

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
            {transformedData.map((row) => (
              <OrderCard
                key={row.id}
                id={row.id}
                nomor={row.raw.nomor}
                nama={row.raw.nama}
                no_hp={row.raw.no_hp}
                tanggal_bayar={
                  row.raw.tanggal_bayar ||
                  new Date(row.raw.created_at).toLocaleString("id-ID")
                }
                total_harga={row.raw.total_harga}
                metode_bayar={row.raw.metode_bayar}
                tipe_pengantaran={row.raw.tipe_pengantaran}
                status={row.raw.status}
                onClick={() => navigate(`/OrderDetailPage/${row.id}`)}
              />
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
          </div>

          {/* Pagination tampil di semua layar */}
          <div className="flex justify-center mt-4">
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
