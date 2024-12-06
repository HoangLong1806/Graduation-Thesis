import React from 'react'
import { AiOutlineGift } from 'react-icons/ai'
import { BiMessageSquareDetail, BiSolidMessageSquareDetail } from 'react-icons/bi'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { backend_url } from '../../server'
import { RxDashboard } from 'react-icons/rx'
import { GrWorkshop } from 'react-icons/gr'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { BsBag } from 'react-icons/bs'
import { CiMoneyBill } from 'react-icons/ci'

const AdminHeader = ({ }) => {
  const { user } = useSelector((state) => state.user);
  const defaultAvatar = "../../Assests/avatar.jpg";

  const location = useLocation();

  // Xác định giá trị active dựa trên đường dẫn hiện tại
  const getActiveIndex = (path) => {
    switch (path) {
      case "/admin/dashboard":
        return 1;
      case "/admin-orders":
        return 2;
      case "/admin-sellers":
        return 3;
      case "/admin-users":
        return 4;
      case "/admin-products":
        return 5;
      case "/admin-events":
        return 6;
      case "/admin-withdraw-request":
        return 7;
      case "/profile":
        return 8;
      default:
        return 0;
    }
  };

  const active = getActiveIndex(location.pathname);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img
            src="https://i.postimg.cc/t4w3PdVk/Long-Nam-6.png"
            alt=""
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/admin/dashboard" className="800px:block hidden">
            <RxDashboard
              color={`${active === 1 ? "crimson" : "#555"}`}
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>


          <Link to="/admin-orders" className="800px:block hidden">
            <FiShoppingBag
              color={`${active === 2 ? "crimson" : "#555"}`}
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>


          <Link to="/admin-sellers" className="800px:block hidden">
            <GrWorkshop
              color={`${active === 3 ? "crimson" : "#555"}`}
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/admin-users" className="800px:block hidden">
            <HiOutlineUserGroup color={`${active === 4 ? "crimson" : "#555"}`} size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/admin-products" className="800px:block hidden">
            <BsBag

              size={30}
              className="mx-5 cursor-pointer"
              color={`${active === 5 ? "crimson" : "#555"}`}
            />
          </Link>
          <Link to="/admin-events" className="800px:block hidden">
            <MdOutlineLocalOffer

              size={30}
              className="mx-5 cursor-pointer"
              color={`${active === 6 ? "crimson" : "#555"}`}
            />
          </Link>
          <Link to="/admin-withdraw-request" className="800px:block hidden">
            <CiMoneyBill

              size={30}
              className="mx-5 cursor-pointer"
              color={`${active === 7 ? "crimson" : "#555"}`}
            />
          </Link>

          <img
            src={`${user?.avatar?.url}`}
            // src={user?.avatar?.public_id ? `${backend_url}${user.avatar.public_id}` : defaultAvatar}

            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />

        </div>
      </div>
    </div>
  )
}

export default AdminHeader