import { FaCheck } from "react-icons/fa";
import { PiMoneyBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase() || "";
  switch (statusLower) {
    case "pesanan diproses":
    case "siap diambil":
    case "pesanan diantar":
      return " text-[#42A444]";
    case "menunggu diproses":
      return " text-[#005B96]";
    case "selesai":
    case "pesanan selesai":
      return " text-[#005B96]";
    default:
      return " text-[#005B96]";
  }
};

const OrderCard = ({
  id,
  nomor,
  nama,
  no_hp,
  tanggal_bayar,
  total_harga,
  metode_bayar,
  tipe_pengantaran,
  status,
}) => {
  const navigate = useNavigate();

const handleClick = () => {
  const isHistory = status?.toLowerCase().includes("selesai");

  if (isHistory) {
    navigate(`/OrderDetailPage/riwayat/${id}`, {
      state: { from: "history" },
    });
  } else {
    navigate(`/OrderDetailPage/masuk/${id}`, {
      state: { from: "orders" },
    });
  }
};



  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-lg mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="bg-gray-200 text-xs px-2 py-1 rounded font-semibold text-gray-700">
            #{nomor}
          </span>
          <span className="text-orange-500 text-sm font-medium">
            {tanggal_bayar}
          </span>
        </div>
        <span className="text-gray-700 text-xs font-medium capitalize">
          {tipe_pengantaran?.replace("_", " ")}
        </span>
      </div>

      <div className="w-full h-[1px] bg-gray-200" />

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-sm uppercase">{nama}</p>
            {no_hp && <p className="text-sm text-black mt-1">{no_hp}</p>}
          </div>
          <div className="flex items-center gap-1 text-black">
            <PiMoneyBold className="text-lg" />
            <span className="text-sm font-medium lowercase">
              {metode_bayar}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 mt-2">
          <span className="font-bold text-base">
            Rp {Number(total_harga || 0).toLocaleString("id-ID")}
          </span>
          <div className="flex items-center gap-2">
            {status?.toLowerCase() === "pesanan selesai" && (
              <div className="p-1 rounded-full bg-[#005B96] flex items-center justify-center">
                <FaCheck className="text-white w-2 h-2" />
              </div>
            )}
            <span
              className={`text-sm font-semibold ${getStatusStyles(status)}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
