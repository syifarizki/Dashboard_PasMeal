const OrderDetails = ({ order }) => {
  return (
    <div className="lg:w-1/2 bg-white p-4 border-gray-300 rounded-xl lg:rounded-none lg:border-0">
      <div className="text-lg font-bold mb-2">Rincian Pesanan</div>
      <div className="mb-4">
        {order.rincian.map((r, i) => (
          <div
            key={i}
            className="flex justify-between text-lg font-medium mb-1"
          >
            <span>{r.item}</span>
            <span>{r.harga}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="text-sm">
          <span className="font-medium text-lg">Catatan :</span>
          <p className=" text-lg font-medium">{order.catatan}</p>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className=" text-lg font-medium">{order.total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
