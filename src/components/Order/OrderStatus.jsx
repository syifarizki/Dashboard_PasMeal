import { LuTimer } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

const OrderStatus = ({ status }) => {
  const isInProgress =
    status === "Pesanan diproses" ||
    status === "Pesanan Diantar" ||
    status === "Siap Diambil";

  return (
    <div
      className={`font-semibold rounded-full py-2 px-4 mb-4 flex items-center ${
        isInProgress
          ? "bg-green-200 text-green-700 justify-between"
          : "bg-blue-100 text-[#005B96] justify-center"
      }`}
    >
      <span className="flex items-center gap-2">
        {status === "Pesanan Selesai" && (
          <div className="p-1 rounded-full bg-[#005B96] flex items-center justify-center">
            <FaCheck className="text-white w-3 h-3" />
          </div>
        )}
        <span>{status}</span>
      </span>

      {isInProgress && (
        <div className="flex items-center gap-1">
          <LuTimer className="text-lg" />
          <span className="font-bold">00.10.00</span>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
