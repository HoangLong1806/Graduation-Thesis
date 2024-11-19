import React from 'react'
import styles from '../../styles/styles'
import { AiOutlineMoneyCollect } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { MdBorderClear } from 'react-icons/md'
const AdminDashboardHeroMain = () => {
    return (
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
                    <Link to="/dashboard-withdraw-money">
                        <h5 className="pt-4 pl-[2] text-[#077f9c]">All Money</h5>
                    </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                        <h3
                            className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                        >
                            All Orders
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">12</h5>
                    <Link to="/dashboard-orders">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
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
                            All Products
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">12</h5>
                    <Link to="/dashboard-products">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
                    </Link>
                </div>
            </div>
            <br />
        </div>
    )
}

export default AdminDashboardHeroMain