import { Button } from '@mui/material'; // Dùng package mới
import { DataGrid } from '@mui/x-data-grid'; // Dùng package mới
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import styles from '../../styles/styles';
import { RxCross1 } from 'react-icons/rx';

const AllCoupouns = () => {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const { products, isLoading } = useSelector((state) => state.products);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(seller._id));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
        window.location.reload();
    };
    const handleSubmit = (e) => { };

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
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];

    const row = [];

    products &&
        products.forEach((item) => {
            row.push({
                id: item._id,
                name: item.name,
                price: "US$ " + item.discountPrice,
                Stock: item.stock,
                sold: item?.sold_out,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <div className="w-full flex justify-end ">
                        <div className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 `}
                            onClick={() => setOpen(true)}
                        >
                            <span className='text-white'>
                                Create Coupon Code
                            </span>
                        </div>
                    </div>
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                    />
                    {
                        open && (
                            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000]  flex items-center justify-center">
                                <div className="w-[90%] 800px:w-[50%] h-[80vh] bg-white rounded-md shadow p-4">
                                    <div className='w-full flex justify-end'>
                                        <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
                                    </div>
                                    <h5 className=" text-[30px] font-Poppins text-center">
                                        Create Coupon Code
                                    </h5>
                                    {/* create coupon code */}
                                    <form onSubmit={handleSubmit}>
                                        <br />

                                        <div>
                                            <label className="pb-2">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter product name...."
                                            />
                                        </div>

                                    </form>

                                </div>

                            </div>
                        )
                    }
                </div>
            )}
        </>
    );
};

export default AllCoupouns;