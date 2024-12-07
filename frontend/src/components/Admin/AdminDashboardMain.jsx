import React, { useEffect, useState } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Đừng quên import CSS của react-datepicker
import { format, differenceInDays, subDays } from "date-fns"; // Thêm thư viện tính số ngày
import "../../styles/admin.css";

// Helper function to format currency to two decimal places
const formatMoney = (amount) => {
  return amount.toFixed(2);
};

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  const [startDate, setStartDate] = useState(subDays(new Date(), 7)); // Ngày bắt đầu là 7 ngày trước ngày hiện tại
  const [endDate, setEndDate] = useState(new Date()); // Ngày kết thúc là ngày hiện tại
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  useEffect(() => {
    // Lọc và tính toán dữ liệu cho biểu đồ
    if (adminOrders) {
      const filteredOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate; // Kiểm tra xem ngày đơn hàng có nằm trong khoảng thời gian đã chọn không
      });

      const data = filteredOrders.reduce((acc, item) => {
        const orderDate = new Date(item.createdAt);
        const dateKey = orderDate.toISOString().split('T')[0]; // Lấy ngày dạng YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = 0;
        acc[dateKey] += item.totalPrice;
        return acc;
      }, {});

      const labels = Object.keys(data);
      const values = Object.values(data);

      setChartData({
        labels,
        datasets: [
          {
            label: "Earnings",
            data: values,
            fill: false,
            borderColor: "#077f9c",
            tension: 0.1,
          },
        ],
      });
    }
  }, [adminOrders, startDate, endDate]);

  // Tính tổng số ngày giữa startDate và endDate
  const totalDays = differenceInDays(endDate, startDate);

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
          <div className="w-full block 800px:flex items-center justify-between">
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
                <h3 className="productTitle text-[18px] leading-5 font-[400] text-[#00000085]">Total Earning</h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                ${adminOrders && formatMoney(adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0))}
              </h5>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                <h3 className="productTitle text-[18px] leading-5 font-[400] text-[#00000085]">All Sellers</h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{sellers && sellers.length}</h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
              </Link>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
                <h3 className="productTitle text-[18px] leading-5 font-[400] text-[#00000085]">All Orders</h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminOrders && adminOrders.length}</h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
              </Link>
            </div>
          </div>

          {/* <br /> */}
          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>

          {/* Chọn ngày bắt đầu và ngày kết thúc */}
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <div className="flex items-center space-x-4">
              <h5 className="text-[18px] font-[400]">Select Date Range:</h5>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="px-2 py-1 border border-gray-300 rounded"
                  placeholderText="Start Date"
                />
                <span>-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="px-2 py-1 border border-gray-300 rounded"
                  placeholderText="End Date"
                />
              </div>
            </div>
              <h5 className="text-[18px] font-[400]">Total Days: {totalDays}</h5> {/* Hiển thị tổng số ngày */}
            <div>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="w-full min-h-[50vh] bg-white rounded">
            {chartData ? (
              <Line data={chartData} options={{ responsive: true }} />
            ) : (
              <div>Loading chart data...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
