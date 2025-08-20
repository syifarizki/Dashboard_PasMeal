const OrderDetails = ({ order }) => {
  if (!order) {
    return (
      <div className="lg:w-1/2 bg-white p-4 border-gray-300 rounded-xl lg:rounded-none lg:border-0">
        <p className="text-lg font-bold">Rincian Pesanan</p>
        <p className="text-gray-500 text-sm">Belum ada data pesanan</p>
      </div>
    );
  }

  // Fungsi untuk format angka ke Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="lg:w-1/2 bg-white p-4 border-gray-300 rounded-xl lg:rounded-none lg:border-0">
      <div className="text-lg font-bold mb-2">Rincian Pesanan</div>
      <div className="mb-4">
        {order.menu?.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-lg font-semibold mb-1"
          >
            <span>{`${item.jumlah} ${item.nama_menu} `}</span>
            <span>{formatRupiah(item.harga * item.jumlah)}</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="text-sm">
          <span className="font-medium text-lg">Catatan :</span>
          <p className="text-lg font-medium">
            {order.catatan || "-"}
          </p>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-lg font-medium">
            {formatRupiah(order.total_harga || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
