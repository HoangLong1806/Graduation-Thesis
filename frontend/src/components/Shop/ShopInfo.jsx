import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";

const ShopInfo = ({ isOwner }) => {

  const { navigate } = useNavigate();
  const [data, setData] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { products } = useSelector((state) => state.products); ///
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(id)); ///

    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
      setData(res.data.shop);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, [])


  const logoutHandler = async () => {
    axios
      .get(`${server}/shop/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };


  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);
  //---------------------------------------//
  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="w-full py-5">
              <div className="w-full flex item-center justify-center">
                <img
                  src={`${data.avatar?.url}`}
                  alt=""
                  className="w-[150px] h-[150px] object-cover rounded-full"
                />
              </div>
              <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
              <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
                {data.description}
              </p>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Địa chỉ</h5>
              <h4 className="text-[#000000a6]">{data.address}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Số điện thoại</h5>
              <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
            </div>
            <div className="p-3">


              <h5 className="font-[600]">Số lượng sản phẩm</h5>
              <h4 className="text-[#000000a6]">{products && products.length}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">
                Xếp hạng cửa hàng</h5>
              <h4 className="text-[#000000a6]">{averageRating}/5</h4>

            </div>
            <div className="p-3">
              <h5 className="font-[600]">Ngày tạo</h5>
              <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
            </div>
            {isOwner && (
              <div className="py-3 px-4">
                <Link to="/settings">
                  <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                    <span className="text-white">Chỉnh sửa cửa hàng</span>
                  </div>
                </Link>
                <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                  onClick={logoutHandler}
                >
                  <span className="text-white">Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        )
      }
    </>
  );
};

export default ShopInfo;
