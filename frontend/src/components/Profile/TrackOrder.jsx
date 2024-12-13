import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      {" "}
      <>
        {data && data?.status === "Đang xử lý" ? (
          <h1 className="text-[20px]">Your Order is processing in shop.</h1>
        ) : data?.status === "Đang chuyển cho đối tác giao hàng" ? (
          <h1 className="text-[20px]">
            Your Order is on the way for delivery partner.
          </h1>
        ) : data?.status === "Đang vận chuyển" ? (
          <h1 className="text-[20px]">
            Your Order is on the way with our delivery partner.
          </h1>
        ) : data?.status === "Đã nhận" ? (
          <h1 className="text-[20px]">
            Your Order is in your city. Our Delivery man will deliver it.
          </h1>
        ) : data?.status === "Đang trên đường" ? (
          <h1 className="text-[20px]">
            Our Delivery man is going to deliver your order.
          </h1>
        ) : data?.status === "Đã giao hàng" ? (
          <h1 className="text-[20px]">Your order is delivered!</h1>
        ) : data?.status === "Đang xử lý hoàn tiền" ? (
          <h1 className="text-[20px]">Your refund is processing!</h1>
        ) : data?.status === "Chấp nhận hoàn tiền" ? (
          <h1 className="text-[20px]">Your Refund is success!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
