import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import ReactPaginate from 'react-paginate';

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    dispatch(getAllEventsShop(seller._id));
    window.location.reload();
    window.location.reload();
  }

  const columns = [
    { field: "id", headerName: "Mã sự kiện", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên sự kiện",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Giá tiền ( đơn giá đô )",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Số lượng",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Số lượng bán",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Xem sự kiện",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: " Xóa sự kiện",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => handleDelete(params.id)}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
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

export default AllEvents;
