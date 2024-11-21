import React, { useEffect, useState } from 'react'
import { server } from '../../../server'

import { useSelector } from 'react-redux'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { AiOutlineArrowRight } from 'react-icons/ai'

const DashboardMessages = () => {
    const { shop } = useSelector(state => state.seller);
    const { seller, isLoading } = useSelector((state) => state.seller);
    const [conversations, setConversations] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const messageList = axios.get(`${server}/conversation/get-all-conversation-seller/${seller?._id}`, { withCredentials: true }).then(res => {
            setConversations(res.data.conversations)
        }).catch(err => {
            console.log(err)
        });


    }, [seller])

    return (
        <div className='w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded'>

            {/* All mee list chat */}
            {
                !open && (
                    <>
                        <h1 className='text-center text-[25px] py-3 font-Poppins'>All messege</h1>
                        {
                            conversations && conversations.map((item, index) => (
                                <MessageList data={item} key={index} index={index} setOpen={setOpen} />
                            ))
                        }
                    </>

                )
            }
            {open && (
                <SellerInbox  setOpen={setOpen}/>
            )}


        </div>
    )
}

const MessageList = ({ index, data, setOpen }) => {
    const navigate = useNavigate();
    const handleClick = (id) => {
        navigate(`?${id}`)
        setOpen(true);
    }
    const [active, setActive] = useState(0);
    return (
        <div className={`w-full flex p-3 px-8 ${active === index ? 'bg-[#ecebeb]' : 'bg-transparent'} cursor-pointer`}
            onClick={(e) => setActive(index) || handleClick(data._id)}
        >
            <div className='relative'>
                <img src="https://top10tphcm.com/wp-content/uploads/2023/02/gai-dep-nhat-viet-nam-3.jpg" alt="" className='w-[70px] h-[70px] rounded-full' />

                <div className='w-[12px] h-[12px] bg-green-400 rounded-full absolute top-1 right-1' >

                </div>
            </div>
            <div className='pl-4'>
                <h1 className='text-[18px]'> Name</h1>
                <p className='text-[16px] text-[#000c]'>Nội dung tin nhắn <br /> </p>
            </div>
        </div>
    )
}

const SellerInbox = ({setOpen}) => {
    return (
        <div className='w-full min-h-full'>
            {/* message header */}
            <div className="w-full flex p-3 items-center justify-between">
                <div className="flex">
                    <img src="https://top10tphcm.com/wp-content/uploads/2023/02/gai-dep-nhat-viet-nam-3.jpg" alt="" className='w-[60px] h-[60px] rounded-full' />
                    <div className='pl-3'>
                        <h1 className='text-[18px] font-[600]'> Name</h1>
                        <h1>onl hay offf</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} />
            </div>

        </div>
    )
}
export default DashboardMessages