import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import OrderCard from "../components/Order/OrderCard";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { Pesanan } from "../services/Pesanan";

const LoadingSpinner = () => (
  <div className="text-center p-15">Memuat pesanan...</div>
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

// warna status pesanan
const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase() || "";
  switch (statusLower) {
    case "pesanan diproses":
      return "text-[#42A444]";
    case "siap diambil":
    case "pesanan diantar":
      return "text-[#42A444]";
    case "menunggu diproses":
      return "text-[#005B96]";
    case "selesai":
    case "pesanan selesai":
      return "text-[#005B96]";
    default:
      return "text-[#005B96]";
  }
};

const OrderPage = ({ type = "masuk" }) => {
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

      try {
        let token = localStorage.getItem("token");

        // cek kalau ada token di URL (auto login via link)
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
          token = tokenFromUrl;
          localStorage.setItem("token", tokenFromUrl);
        }

        if (!token) {
          navigate("/LoginPage");
          return;
        }

        // Ambil pesanan sesuai type
        let response;
       if (type === "masuk") {
         if (searchParams.get("token")) {
           //  kalau token dari URL → pakai endpoint WA
           response = await Pesanan.getPesananMasukWA(token, page);
         } else {
           // login biasa
           response = await Pesanan.getPesananMasuk(token, page);
         }
       } else {
         response = await Pesanan.getRiwayatPesanan(token, page);
       }


        const data = response?.data || [];
        const pages = response?.totalPages || 1;

        const formattedData = data.map((order, index) => ({
          ...order,
          id: order.id,
          nomor: order.nomor_antrian || (page - 1) * 8 + index + 1,
          nama: order.nama || order.nama_pemesan || "Tidak diketahui",
          no_hp: order.no_hp || "-",
          created_at: order.created_at || new Date().toISOString(),
          tanggal_bayar: order.tanggal_bayar || null,
          total_harga: Number(order.total_harga) || 0,
          metode_bayar: order.metode_bayar || "QRIS",
          tipe_pengantaran: order.tipe_pengantaran || "-",
          status: order.status_label || order.status || "Pending",
        }));

        setOrderList(formattedData);
        setTotalPages(pages);
      } catch (err) {
        console.error("Gagal ambil pesanan:", err);
        setError(err.response?.data?.message || "Gagal memuat data pesanan.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, navigate, type]
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

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
    raw: order,
  }));

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
              <OrderCard key={order.id} {...order} />
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
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
