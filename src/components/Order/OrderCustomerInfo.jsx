// src/components/Order/OrderCustomerInfo.jsx

import { PiMoneyBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const OrderCustomerInfo = ({ order, showDetail, setShowDetail }) => {
  return (
    <div className="lg:w-1/2 bg-white p-4 border border-gray-300 rounded-xl lg:rounded-none lg:border-0">
      {/* --- Tampilan Mobile --- */}
      <div className="block lg:hidden">
        <div className="flex justify-between items-center">
          <div>
            {/* Menggunakan 'order.nama' */}
            <div className="font-semibold">{order.nama}</div>
            <div className="text-lg text-orange-500 font-medium">
              {/* Menggunakan 'order.tanggal_bayar' */}
              {order.tanggal_bayar}
            </div>
          </div>
          <div className="bg-gray-200 px-2 py-1 text-sm rounded">
            {/* Menggunakan 'order.id' */}#{order.id}
          </div>
        </div>
        <div className="text-sm mt-3 space-y-2">
          <div className="flex border-y py-1 text-center">
            <div className="w-1/2 flex items-center justify-center text-lg font-medium">
              {order.tipe_pengantaran}
            </div>
            <div className="w-1/2 flex items-center justify-center gap-2 border-l pl-3 text-xl">
              <PiMoneyBold className="w-7 h-7 " />
              <span className="font-medium lowercase text-sm ">
                {order.metode_bayar || "Qris"}
              </span>
            </div>
          </div>
          {showDetail && (
            <div className="flex justify-between pt-2 text-lg font-medium">
              <span>No. Telepon</span>
              {/* Menggunakan 'order.no_hp' */}
              <span>{order.no_hp}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="lg:hidden text-primary font-bold text-lg text-center mt-2 w-full flex justify-center items-center gap-1"
        >
          {showDetail ? (
            <>
              Tutup Detail <IoIosArrowUp className="text-base" />
            </>
          ) : (
            <>
              Lihat Detail <IoIosArrowDown className="text-base" />
            </>
          )}
        </button>
      </div>

      {/* --- Tampilan Desktop --- */}
      <div className="hidden lg:block space-y-2 text-lg">
        <div className="flex justify-between font-medium pb-0.5">
          <span>Nomor Pesanan</span>
          <span className="bg-gray-200 px-2 py-1 text-sm rounded">
            #{order.id}
          </span>
        </div>
        <div className="flex justify-between pb-0.5">
          <span className="font-medium">Nama Pelanggan</span>
          <span className="font-bold">{order.nama}</span>
        </div>
        <div className="flex justify-between font-medium pb-0.5">
          <span>Tanggal Pesanan</span>
          <span className="text-orange-500 ">{order.tanggal_bayar}</span>
        </div>
        <div className="flex justify-between font-medium pb-0.5">
          <span>Tipe Pengantaran</span>
          <span>{order.tipe_pengantaran}</span>
        </div>
        <div className="flex justify-between pb-0.5">
          <span className="font-medium">Pembayaran</span>
          <span className="flex items-center gap-1 font-medium lowercase">
            <PiMoneyBold className="text-xl" /> {order.metode_bayar || "Qris"}
          </span>
        </div>
        <div className="flex justify-between font-medium pb-0.5">
          <span>No. Telepon</span>
          <span>{order.no_hp}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
