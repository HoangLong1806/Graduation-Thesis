import React, { useEffect, useState } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { format, differenceInDays, subDays } from "date-fns";
import "../../styles/admin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    if (adminOrders) {
      const filteredOrders = adminOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate; // Kiểm tra xem ngày đơn hàng có nằm trong khoảng thời gian đã chọn không
      });

      const data = filteredOrders.reduce((acc, item) => {
        const orderDate = new Date(item.createdAt);
        const dateKey = orderDate.toISOString().split('T')[0]; // Lấy ngày dạng YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = { earnings: 0, orders: 0 };
        acc[dateKey].earnings += item.totalPrice;
        acc[dateKey].orders += 1;
        return acc;
      }, {});

      const sortedLabels = Object.keys(data).sort();
      const earningsData = sortedLabels.map(date => data[date].earnings);
      const ordersData = sortedLabels.map(date => data[date].orders);

      setChartData({
        earningsChartData: {
          labels: sortedLabels,
          datasets: [
            {
              label: "Earnings",
              data: earningsData,
              backgroundColor: "#ff6384", // Màu cho biểu đồ cột
              borderColor: "#ff6384",
              borderWidth: 1,
              type: 'bar', // Biểu đồ cột
            },
          ],
        },
        ordersChartData: {
          labels: sortedLabels,
          datasets: [
            {
              label: "Orders",
              data: ordersData,
              fill: false,
              borderColor: "#077f9c",
              tension: 0.1,
              type: 'line', // Biểu đồ đường
            },
          ],
        },
      });
    }
  }, [adminOrders, startDate, endDate]);

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

          <h3 className="text-[22px] font-Poppins pb-2">Thống kê</h3>

          {/* Chọn ngày bắt đầu và ngày kết thúc */}
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <div className="flex items-center space-x-4">
                <h5 className="text-[18px] font-[400]">Ngày thống kê:</h5>
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
            <h5 className="text-[18px] font-[400]">Tổng số ngày: {totalDays}</h5>
          </div>
<br />
          {/* Biểu đồ */}
          <div className="w-full flex gap-4 h-[40vh] bg-white rounded">
            <div className="w-[50%]">
              {chartData && chartData.earningsChartData ? (
                <Bar data={chartData.earningsChartData} options={{ responsive: true }} />
              ) : (
                <div>Loading chart data...</div>
              )}
            </div>

            <div className="w-[50%]">
              {chartData && chartData.ordersChartData ? (
                <Line data={chartData.ordersChartData} options={{ responsive: true }} />
              ) : (
                <div>Loading chart data...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
