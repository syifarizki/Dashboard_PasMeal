import { FaCheckCircle } from "react-icons/fa";
import { PiMoneyBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const OrderCard = ({
  orderNumber,
  time,
  table,
  name,
  phone,
  total,
  status,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/DetailPesananPage/${orderNumber}`);
  };

  const statusColor =
    status === "Menunggu Diproses"
      ? "text-[#005B96]"
      : status === "Pesanan diproses" || status === "Sudah Dikirim"
      ? "text-green-600"
      : status === "Pesanan Selesai"
      ? "text-[#005B96]"
      : "text-black";

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-lg mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-gray-300 text-sm px-2 py-1 rounded text-black font-semibold">
              #{orderNumber}
            </span>
            <span className="text-orange-500 font-medium">{time}</span>
          </div>
          <span className="text-sm text-gray-800 font-medium">{table}</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-black" />

      <div className="p-4 pt-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg">{name}</p>
            <p className="text-sm text-gray-700">{phone}</p>
          </div>
          <div className="flex items-center gap-1">
            <PiMoneyBold className="text-xl" />
            <span className="text-sm font-medium">Qris</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-lg">{total}</span>
          <div className={`flex items-center font-medium gap-1 ${statusColor}`}>
            {status === "Pesanan Selesai" && (
              <FaCheckCircle className="text-base" />
            )}
            {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
