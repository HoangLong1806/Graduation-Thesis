import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlineTrackChanges,
} from "react-icons/md";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();

  const [visible, setVisible] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="w-full">
      {/* profile page */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              
                <img src={`${backend_url}${user?.avatar?.url}`} className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]" alt="" />
                
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <AiOutlineCamera />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    placeholder="Please Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    placeholder="Please Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    placeholder="Please Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className=" w-[100%] 800px:w-[48%]">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      placeholder="Please Password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}
      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {/* refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {/* TrackOrder */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {/* PaymentMethod */}
      {active === 6 && (
        <div>
          <PaymentMethod />
        </div>
      )}
      {/* Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
      
    </div>
  );
};

const AllOrders = () => {
  const orders = [
    {
      _id: "1463hvbfbhrt28820221",
      orderItems: [
        {
          name: "iphone 13asdkasdasdasdasdas",
        },
      ],
      totalPrice: 1000,
      orderStatus: "Delivered",
    },
  ];
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

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const orders = [
    {
      _id: "1463hvbfbhrt28820221",
      orderItems: [
        {
          name: "iphone 13asdkasdasdasdasdas",
        },
      ],
      totalPrice: 1000,
      orderStatus: "Delivered",
    },
  ];
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

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const TrackOrder = () => {
  const orders = [
    {
      _id: "1463hvbfbhrt28820221",
      orderItems: [
        {
          name: "iphone 13asdkasdasdasdasdas",
        },
      ],
      totalPrice: 1000,
      orderStatus: "Delivered",
    },
  ];
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
            <Link to={`/order/${params.id}`}>
              <Button>
                <MdOutlineTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + item.totalPrice,
        status: item.orderStatus,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};
const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          Payment Methods
        </h1>
        <div className={`${styles.button} !rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img
            src="https://vudigital.co/wp-content/uploads/2022/04/8.webp"
            className="w-[60px] h-[50px]"
            alt=""
          />
          <h5 className="pl-5 font-[600]">Long</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>1234 ********* ****** ****</h6>
          <h5 className="pl-6">08/2022</h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
const Address = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Address
        </h1>
        <div className={`${styles.button} !rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white rounded-[4px] flex items-center px-5 shadow justify-between pr-5 py-4">
        <div className="flex items-center">
          <h5 className="font-[600]">Default</h5>
        </div>
        <div className="flex items-center">
          <h6>12 Nguyễn Văn Bảo P4, Gò Vấp, Tp Hồ Chí Minh</h6>
        </div>
        <div className="flex items-center">
          <h6>(+84) 842815579</h6>
        </div>
        <div className="flex items-center justify-end">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
