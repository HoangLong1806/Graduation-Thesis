import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import ReactPaginate from 'react-paginate';

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Mã đơn hàng", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Đã giao hàng" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng mặt hàng",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Tổng tiền ( đơn giá đô )",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];

  orders.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
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
      )}
    </>
  );
};

export default AllOrders;
