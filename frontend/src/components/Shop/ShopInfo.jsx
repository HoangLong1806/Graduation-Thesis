import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";


const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop || {});
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [id]);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    axios
      .get(`${server}/shop/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/");
        window.location.reload(true);
      })
      .catch((error) => {
        console.error(error.response?.data?.message || "Logout failed");
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex justify-center items-center">
          {data.avatar?.public_id ? (
            <img
              src={`${backend_url}${data.avatar.public_id}`}
              alt="Shop Avatar"
              className="w-[150px] h-[150px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[150px] h-[150px] rounded-full bg-gray-300 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-center py-2 text-[20px]">{data.name || "No Name"}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
          {data.description || "No Description Available"}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{data.address || "No Address Provided"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{data.phoneNumber || "No Phone Number"}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Number</h5>
        <h4 className="text-[#000000a6]">10</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Rating</h5>
        <h4 className="text-[#000000a6]">{data.ratings}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000a6]">
          {data?.createdAt ? data.createdAt.slice(0, 10) : "No Date Available"}
        </h4>
      </div>

      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/settings">
           <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className="text-white">Edit Shop</span>
          </div>
           </Link>
          <div
            className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;


