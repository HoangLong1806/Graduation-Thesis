import React from "react";
import { backend_url } from "../../server";
import styles from "../../styles/styles";
import CountDown from "./CountDown";

const EventCard = ({ active, data }) => {
  
  
  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        {data?.images?.[0] ? (
          <img
            src={`${backend_url}${data.images[0]}`}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data?.name || "No Name"}</h2>
        <p>{data?.description || "No Description"}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data?.originalPrice ? `${data.originalPrice}$` : "No Price"}
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data?.discountPrice ? `${data.discountPrice}$` : "No Discount Price"}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data?.sold_out ? `${data.sold_out} sold` : "No Sales Data"}
          </span>
        </div>
        {data && <CountDown data={data} />}
        <br />
      </div>
    </div>
  );
};

export default EventCard;

// import React from "react";
// import { backend_url } from "../../server";
// import styles from "../../styles/styles";
// import CountDown from "./CountDown";

// const EventCard = ({ active, data }) => {
//   return (
//     <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
//       <div className="w-full lg:-w[50%] m-auto">
//         <img
//           src={`${backend_url}${data.images[0]}`}
//           alt="" />
//       </div>
//       <div className="w-full lg:[w-50%] flex flex-col justify-center">
//         <h2 className={`${styles.productTitle}`}>{data.name}</h2>
//         <p>
//           {data.description}
//         </p>
//         <div className="flex py-2 justify-between">
//           <div className="flex">
//             <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
//               {data.originalPrice}$
//             </h5>
//             <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
//               {data.discountPrice}$
//             </h5>
//           </div>
//           <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
//             120 sold
//           </span>
//         </div>
//         <CountDown data={data} />
//         <br />
//       </div>
//     </div>
//   );
// };

// export default EventCard;
