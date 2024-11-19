import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { MdBorderClear } from 'react-icons/md'
import { DataGrid } from "@mui/x-data-grid";
import { Button } from '@mui/material'
import axios from 'axios'
import { server } from '../../server'
import { useDispatch, useSelector } from 'react-redux'
import { get, set } from 'mongoose'
import { getAllOrdersOfAdmin } from '../../redux/actions/order'
import Loader from '../Layout/Loader'
import { getAllSellers } from '../../redux/actions/sellers'
const AdminDashboardMain = () => {
   
    const dispatch = useDispatch();
    const {adminOrders,adminOrderLoading} = useSelector((state) => state.order);
    const {sellers} = useSelector((state) => state.seller);

    console.log(adminOrders);
    
    useEffect(() => {   
       dispatch(getAllOrdersOfAdmin());
       dispatch(getAllSellers());
       
    }, [])
    console.log(sellers);
    
  
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
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/dashboard/order/${params.id}`}>
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

    adminOrders && adminOrders.forEach((item)=> {
        row.push({
            id: item._id,
            itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
            itemsQty: item.qty,
            total: item.totalPrice,
            status: item.status,
        })});
       
    return (
        <>
        {
            adminOrderLoading ? (
                <Loader />
            ):(
                <div className='w-full p-4 '>
                <h3 className="text-[22px] font-Poppins pb-2"> Overview </h3>
                <div className="w-full block 800px:flex items-center justify-between">
                    <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5"> 
                        <div className="flex items-center">
                            <AiOutlineMoneyCollect
                                size={30}
                                className="mr-2"
                                fill="#00000085"
                            />
                            <h3
                                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                            >
                                Total Earni
    
                            </h3>
                        </div>
                        <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">$</h5>
    
                    </div>
    
                    <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                        <div className="flex items-center">
                            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                            <h3
                                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                            >
                                All Sellers
                            </h3>
                        </div>
                        <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">12</h5>
                        <Link to="/admin-sellers">
                            <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
                        </Link>
                    </div>
    
                    <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                        <div className="flex items-center">
                            <AiOutlineMoneyCollect
                                size={30}
                                className="mr-2"
                                fill="#00000085"
                            />
                            <h3
                                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                            >
                                All Orders
                            </h3>
                        </div>
                        <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminOrders && adminOrders.length}</h5>
                        <Link to="/adamin-orders">
                            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
                        </Link>
                    </div>
                </div>
                <br />
                <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
                <div style={{ width: "100%", maxWidth: "1200px", overflow: "auto", margin: "0 auto" }}>
                    <DataGrid
                        rows={row}
                        columns={columns}
                        autoHeight
                        pageSize={10}
                        disableSelectionOnClick
                    />
                </div>
    
    
    
            </div>
            )
        }
        </>
       
    )
}

export default AdminDashboardMain