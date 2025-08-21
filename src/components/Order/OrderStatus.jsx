import { useState, useEffect } from "react";
import { LuTimer } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

const formatWaktu = (totalDetik) => {
  if (totalDetik < 0) return "00:00";
  const menit = Math.floor(totalDetik / 60);
  const detik = totalDetik % 60;
  return `${String(menit).padStart(2, "0")}:${String(detik).padStart(2, "0")}`;
};

const OrderStatus = ({ order }) => {
  const { status_label: status, estimasi_selesai_at } = order;
  const [sisaWaktu, setSisaWaktu] = useState(0);

  const statusLower = status?.toLowerCase() || "";

  // 🔧 Normalisasi tampilan status
  const displayStatus = statusLower === "selesai" ? "Pesanan Selesai" : status;

  const isInProgress =
    statusLower === "pesanan diproses" ||
    statusLower === "pesanan diantar" ||
    statusLower === "siap diambil";

  useEffect(() => {
    if (!isInProgress || !estimasi_selesai_at) {
      return;
    }

    const waktuSelesaiMillis = new Date(estimasi_selesai_at).getTime();

    const hitungSisaWaktu = () => {
      const sisa = Math.round((waktuSelesaiMillis - Date.now()) / 1000);
      setSisaWaktu(sisa > 0 ? sisa : 0);
    };

    hitungSisaWaktu();
    const interval = setInterval(hitungSisaWaktu, 1000);

    return () => clearInterval(interval);
  }, [status, estimasi_selesai_at, isInProgress]);

  return (
    <div
      className={`font-semibold rounded-full py-2 px-4 mb-4 flex items-center ${
        isInProgress
          ? "bg-green-200 text-green-700 justify-between"
          : "bg-blue-100 text-[#005B96] justify-center"
      }`}
    >
      <span className="flex items-center gap-2">
        {(statusLower === "selesai" || statusLower === "pesanan selesai") && (
          <div className="p-1 rounded-full bg-[#005B96] flex items-center justify-center">
            <FaCheck className="text-white w-3 h-3" />
          </div>
        )}
        <span>{displayStatus}</span>
      </span>

      {isInProgress && (
        <div className="flex items-center gap-1">
          <LuTimer className="text-lg" />
          <span className="font-bold">{formatWaktu(sisaWaktu)}</span>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
