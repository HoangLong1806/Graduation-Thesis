import React, { useEffect, useState } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import styles from "../../styles/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.order || {});
  const { seller = {} } = useSelector((state) => state.seller || {});
  const { products = [] } = useSelector((state) => state.products || {});
  
  // Set the default start date to 7 days ago from today
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 7);
  
  const [startDate, setStartDate] = useState(defaultStartDate); // Lưu ngày bắt đầu
  const [endDate, setEndDate] = useState(new Date()); // Lưu ngày kết thúc

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  // Hàm nhóm đơn hàng theo ngày
  const groupOrdersByDate = (orders) => {
    const grouped = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += order.totalPrice || 0;
    });

    return grouped;
  };

  // Nhóm các đơn hàng theo ngày
  const groupedOrders = groupOrdersByDate(orders);

  // Hàm lọc dữ liệu theo khoảng thời gian
  const getFilteredData = (startDate, endDate) => {
    const filteredOrders = Object.keys(groupedOrders)
      .filter((date) => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
      })
      .reduce((acc, date) => {
        acc[date] = groupedOrders[date];
        return acc;
      }, {});

    return filteredOrders;
  };

  // Lọc dữ liệu cho khoảng thời gian đã chọn
  const filteredOrders = getFilteredData(startDate, endDate);

  // Tạo dữ liệu cho biểu đồ
  const chartData = {
    labels: Object.keys(filteredOrders), // Các ngày (YYYY-MM-DD)
    datasets: [
      {
        label: "Tổng tiền (US$)",
        data: Object.values(filteredOrders), // Tổng tiền mỗi ngày
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu sắc của các cột
        borderColor: "rgba(75, 192, 192, 1)", // Màu viền của các cột
        borderWidth: 1,
        datalabels: {
          align: "top",
          anchor: "end",
          color: "black",
          formatter: (value) => value.toFixed(2), // Hiển thị số tiền với 2 chữ số sau dấu phẩy
        },
      },
    ],
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `US$ ${tooltipItem.raw.toFixed(2)}`; // Hiển thị tổng tiền với 2 chữ số sau dấu phẩy
          },
        },
      },
      datalabels: {
        display: true,
        color: "black",
        formatter: (value) => value.toFixed(2), // Hiển thị số tiền trực tiếp trên cột
      },
    },
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        {/* Tổng quan: Số dư tài khoản */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Số dư tài khoản <span className="text-[16px]">(-10% phí dịch vụ)</span>
            </h3>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              ${availableBalance || "0.00"}
            </h5>
          </div>

          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] mx-20 text-[#077f9c]">Rút tiền</h5>
          </Link>
        </div>

        {/* Tổng quan: Tất cả đơn hàng */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Tất cả đơn hàng
            </h3>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {orders.length}
            </h5>
          </div>

          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 mx-10 text-[#077f9c]">Xem đơn hàng</h5>
          </Link>
        </div>

        {/* Tổng quan: Tất cả sản phẩm */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Tất cả sản phẩm
            </h3>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {products.length}
            </h5>
          </div>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Xem sản phẩm</h5>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Đơn hàng mới nhất</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <div className="flex justify-between items-center mb-4">
          {/* Chọn khoảng thời gian */}
          <div className="flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="mr-4 p-2 border rounded"
            />
            <span className="mr-4">đến</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="p-2 border rounded"
            /> 
          <span className="ml-4">Tổng số ngày: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
          </div>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DashboardHero;
