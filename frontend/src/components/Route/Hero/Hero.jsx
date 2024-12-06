import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 700px:min-h-[70vh] w-[full] ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
        backgroundSize: "cover", // Đảm bảo hình ảnh phủ đầy vùng chứa
        backgroundPosition: "center", // Hình ảnh căn giữa theo chiều ngang và dọc
        backgroundRepeat: "no-repeat", // Tránh lặp lại hình ảnh
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Chào Mừng Các Bạn Đến Với Chúng Tôi <br />
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          Chúng tôi cung cấp cả sản phẩm chất lượng giúp chăm sóc sức khỏe và cải thiện của sống
          <br /> Khám phá ngay những lựa chọn an toàn và hiệu quả để sống khỏe mỗi ngày{" "}
          <br />
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">Mua</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
