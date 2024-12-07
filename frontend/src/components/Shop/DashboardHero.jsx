import React, { useEffect, useState } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@mui/material";
import { Bar, Line } from "react-chartjs-2"; // Import Line chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Import LineElement for line chart
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
  LineElement, // Register LineElement
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

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 7);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const groupOrdersByDate = (orders) => {
    const grouped = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = { totalAmount: 0, orderCount: 0 };
      }
      grouped[date].totalAmount += order.totalPrice || 0;
      grouped[date].orderCount += 1;
    });

    return grouped;
  };

  const groupedOrders = groupOrdersByDate(orders);

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

    const sortedDates = Object.keys(filteredOrders).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const sortedFilteredOrders = {};
    sortedDates.forEach((date) => {
      sortedFilteredOrders[date] = filteredOrders[date];
    });

    return sortedFilteredOrders;
  };

  const filteredOrders = getFilteredData(startDate, endDate);

  const chartData = {
    labels: Object.keys(filteredOrders),
    datasets: [
      {
        label: "Tổng tiền (US$) - Cột",
        data: Object.values(filteredOrders).map((order) => order.totalAmount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 3)",
        borderWidth: 1,
        type: "bar", // Biểu đồ cột
        datalabels: {
          align: "top",
          anchor: "end",
          color: "black",
          formatter: (value) => value.toFixed(2),
        },
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(filteredOrders),
    datasets: [
      {
        label: "Số lượng đơn hàng - Đường",
        data: Object.values(filteredOrders).map((order) => order.orderCount),
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        type: "line", // Biểu đồ đường
        datalabels: {
          align: "bottom",
          anchor: "start",
          color: "black",
          formatter: (value) => value.toFixed(0),
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `US$ ${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "black",
        formatter: (value) => value.toFixed(2),
      },
    },
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Số dư tài khoản{" "}
              <span className="text-[16px]">(-10% phí dịch vụ)</span>
            </h3>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              ${availableBalance || "0.00"}
            </h5>
          </div>

          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] mx-20 text-[#077f9c]">Rút tiền</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
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

        <div className="w-full mb-4 800px:w-[30%] min-h-[10vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
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
      <div className="w-full min-h-[50vh] bg-white shadow rounded px-2 py-5">
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
            <span className="ml-4">Tổng số ngày: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</span>
          </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-full max-w-[48%]">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="w-full max-w-[48%]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default DashboardHero;
