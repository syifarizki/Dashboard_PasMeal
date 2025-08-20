import { FaCheckCircle } from "react-icons/fa";
import { PiMoneyBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

// untuk warna status pesanan
const getStatusStyles = (status) => {
  const statusLower = status?.toLowerCase() || "";
  switch (statusLower) {
    case "pesanan diproses":
      return " text-[#42A444]";
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
    navigate(`/OrderDetailPage/${id}`);
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
        <span className="text-gray-700 text-xs font-medium">
          {tipe_pengantaran}
        </span>
      </div>

      <div className="w-full h-[1px] bg-gray-200" />

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-base uppercase">{nama}</p>
            <p className="text-sm text-gray-600 mt-1">{no_hp}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <PiMoneyBold className="text-lg" />
            <span className="text-sm font-medium uppercase">
              {metode_bayar}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 mt-2">
          <span className="font-bold text-base">
            Rp {Number(total_harga || 0).toLocaleString("id-ID")}
          </span>
          <span
            className={`px-3 py-1 text-sm rounded-full font-semibold inline-block ${getStatusStyles(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
