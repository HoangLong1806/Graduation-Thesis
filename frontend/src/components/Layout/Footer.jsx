import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#000] text-white flex flex-col items-center">

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full sm:px-8 px-5 py-16 text-center  ">
        <ul className="px-5 flex flex-col items-center sm:items-start">
          <img
            src="https://i.postimg.cc/t4w3PdVk/Long-Nam-6.png"
            alt=""
            style={{ filter: "brightness(0) invert(1)", maxWidth: "150px" }}
            className="mb-4"
          />
          <p className="text-sm">Hãy xem nơi đây như ngôi nhà của mình. Hãy mua sắm hết mình</p>
          <div className="flex items-center mt-4">
            <AiFillFacebook size={25} className="cursor-pointer mx-2" />
            <AiOutlineTwitter size={25} className="cursor-pointer mx-2" />
            <AiFillInstagram size={25} className="cursor-pointer mx-2" />
            <AiFillYoutube size={25} className="cursor-pointer mx-2" />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-4 font-semibold">Nhà Phát triển</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full text-center pt-4 text-gray-400 text-sm pb-8 border-t border-gray-700">
        <span>© 2024 Website bán hàng online</span>
        <br />
        <span>Terms · 087</span>
      </div>
    </div>
  );
};

export default Footer;