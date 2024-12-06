import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import AdminSideBar from "../components/Admin/Layout/AdminSidebar";
import { DataGrid } from "@mui/x-data-grid";
import ReactPaginate from 'react-paginate';

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

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
      field: "joinedAt",
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
        joinedAt: new Date(item.createdAt).toLocaleDateString('vi-VN'),
      });
    });

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);

  // Handle page click and update rows displayed
  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = row.slice(startIndex, endIndex);  // Get rows for the current page

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] min-h-[25vh] bg-white rounded">
              {/* Pass only the currentRows to DataGrid */}
              <DataGrid
                rows={currentRows}  // Pass only rows for the current page
                columns={columns}
                disableSelectionOnClick
                autoHeight
              />

              {/* Pagination */}
              <div className="pagination-container flex justify-center py-4">
                <ReactPaginate
                  pageCount={Math.ceil(row.length / rowsPerPage)}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination flex items-center space-x-2'}
                  activeClassName={'active'}
                  pageClassName={'page px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                  previousClassName={'previous px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                  nextClassName={'next px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300'}
                  disabledClassName={'disabled cursor-not-allowed opacity-50'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
