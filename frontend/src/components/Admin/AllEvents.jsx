import { Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

import { Link } from "react-router-dom";
import { server } from '../../server';
import ReactPaginate from 'react-paginate';

const AllEvents = () => {
    const [events, setEvents] = useState([]);


    useEffect(() => {
        axios.get(`${server}/event/get-all-events`, { withCredentials: true }).then((res) => {
            setEvents(res.data.events);
        });
    }, []);



    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Price",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "Stock",
            headerName: "Stock",
            type: "number",
            minWidth: 80,
            flex: 0.5,
        },

        {
            field: "sold",
            headerName: "Sold out",
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: "Preview",
            flex: 0.8,
            minWidth: 100,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {

                return (
                    <>
                        <Link to={`/product/${params.id}?isEvent=true`}>
                            <Button>
                                <AiOutlineEye size={20} />
                            </Button>
                        </Link>
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

        </>
    );
};

export default AllEvents;
