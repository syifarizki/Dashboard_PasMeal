import { FaCheckCircle } from "react-icons/fa";
import { PiMoneyBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const OrderCard = ({
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
    navigate(`/DetailPesananPage/${nomor}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md rounded-lg mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="bg-gray-300 text-xs px-2 py-1 rounded font-semibold text-gray-700">
            #{nomor}
          </span>
          <span className="text-orange-500 text-sm font-medium">
            {tanggal_bayar}
          </span>
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {tipe_pengantaran}
        </span>
      </div>

      <div className="w-full h-[1px] bg-gray-300" />

      {/* Body */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-base">{nama}</p>
            <p className="text-sm text-gray-600 mt-1">{no_hp}</p>
          </div>

          <div className="flex items-center gap-1">
            <PiMoneyBold className="text-lg" />
            <span className="text-sm font-medium lowercase">{metode_bayar}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-base">
            {Number(total_harga || 0).toLocaleString("id-ID")}
          </span>
          <div className="flex items-center gap-1 text-sm text-[#005B96] font-medium">
            {status === "Selesai" && (
              <FaCheckCircle className="text-base text-[#005B96]" />
            )}
            {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
