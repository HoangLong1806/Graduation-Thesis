import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { DataGrid } from "@mui/x-data-grid";
import ReactPaginate from 'react-paginate';
import "../../styles/admin.css";

const AdminDashboardMain = () => {
    const dispatch = useDispatch();

    const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
    const { sellers } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin());
        dispatch(getAllSellers());
    }, [dispatch]);

    const adminEarning =
        adminOrders && adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

    const adminBalance = adminEarning?.toFixed(2);

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "createdAt",
            headerName: "Order Date",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
    ];

    const row = [];

    adminOrders &&
        adminOrders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
                total: item?.totalPrice + " $",
                status: item?.status,
                createdAt: item?.createdAt.slice(0, 10),
            });
        });

    // State cho phân trang
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(7);

    // Tính toán số lượng dữ liệu cần hiển thị dựa trên trang hiện tại
    const handlePageClick = (event) => {
        setPage(event.selected);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = row.slice(startIndex, endIndex);

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
                                <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                                    Total Earning
                                </h3>
                            </div>
                            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">$ {adminBalance}</h5>
                        </div>

                        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                            <div className="flex items-center">
                                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                                <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                                    All Sellers
                                </h3>
                            </div>
                            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{sellers && sellers.length}</h5>
                            <Link to="/admin-sellers">
                                <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
                            </Link>
                        </div>

                        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                            <div className="flex items-center">
                                <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
                                <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                                    All Orders
                                </h3>
                            </div>
                            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminOrders && adminOrders.length}</h5>
                            <Link to="/admin-orders">
                                <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
                            </Link>
                        </div>
                    </div>

                    <br />
                    <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>

                    {/* DataGrid */}
                    <div className="w-full min-h-[25vh] bg-white rounded">
                        <DataGrid
                            rows={currentRows}
                            columns={columns}
                            pageSize={rowsPerPage}
                            disableSelectionOnClick
                            pagination={false} // Tắt phân trang mặc định của DataGrid
                        />

                        <div className="pagination-container flex justify-center py-4">
                            <ReactPaginate
                                pageCount={Math.ceil(row.length / rowsPerPage)}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination flex items-center space-x-2'}
                                activeClassName={'active'} // Lớp cho trang được chọn
                                pageClassName={'page px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                                previousClassName={'previous px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                                nextClassName={'next px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                                disabledClassName={'disabled cursor-not-allowed opacity-50'}
                            />
                        </div>
                    </div>


                </div>
            )}
        </>
    );
};

export default AdminDashboardMain;
