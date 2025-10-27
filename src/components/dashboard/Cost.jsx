

import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import DonutChart from "./DonutChart";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
// businessman-sitting
import Businessman from "../../assets/businessman-sitting.svg";

function Cost() {
  const navigate = useNavigate();

  return (
    <div className="banner-container">
      <div className="banner-content">
        <h1 className="banner-title">
          Start your compliance workflow and simplify GTIN management!
        </h1>
        <Button
          type="filled"
          size="large"
          className="start-button"
          icon={<ArrowRightOutlined />}
          onClick={() => navigate("/rule-management")}
        >
          Start New Workflow
        </Button>
      </div>
      <div className="banner-image">
        <img
          src={Businessman}
          alt={`Businessman`}
          className="w-56 h-56 object-contain pr-6"
        />
        {/* <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-10%20at%2010.05.45%E2%80%AFPM-bSV9QAVH8wDTDcz9IdkMLZGG6SR5M6.png"
          alt="Businessman sitting on chair"
          className="person-image"
        /> */}
      </div>

      <style jsx>{`
        .banner-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f5a9b8 0%, #e57383 100%);
          padding: 2rem 4rem;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .banner-content {
          max-width: 50%;
          z-index: 2;
        }

        .banner-title {
          color: white;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
          line-height: 1.2;
        }

        .banner-image {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: flex-end;
        }

        .person-image {
          height: 90%;
          object-fit: contain;
        }

        :global(.start-button) {
          background-color: white !important;
          color: #e57383 !important;
          border: none !important;
          font-weight: 600 !important;
          height: 48px !important;
          padding: 0 24px !important;
          font-size: 16px !important;
          border-radius: 4px !important;
        }

        @media (max-width: 768px) {
          .banner-container {
            flex-direction: column;
            padding: 2rem;
          }

          .banner-content {
            max-width: 100%;
            margin-bottom: 2rem;
          }

          .banner-title {
            font-size: 1.8rem;
          }

          .banner-image {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .person-image {
            height: auto;
            max-width: 80%;
          }
        }
      `}</style>
    </div>
    // <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-3xl min-h-56 max-h-56">
    //   <div className="ml-10">
    //     <div className="flex items-center">
    //       <h1 className="text-black dark:text-gray-100">Cost</h1>
    //       <InformationCircleIcon className="h-6 text-black dark:text-gray-100" />
    //     </div>

    //     <div className="flex mt-16 ">
    //       <div className="flex flex-col items-center p-2">
    //         <h1 className="mb-2 text-4xl font-bold text-black dark:text-gray-100">
    //           40%
    //         </h1>
    //         <p className="text-[#8C89B4] dark:text-gray-400 text-sm">
    //           Budget Utilization
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="relative ">
    //     <DonutChart />

    //     {/* <div className="absolute top-[40%] left-[6rem]">
    //       <p className="text-gray-400 text-md">Budget</p>
    //       <h1 className="text-xl font-bold text-black dark:text-gray-100">$5000</h1>
    //     </div> */}
    //   </div>

    //   <div className="px-6 py-5 border-l-2 border-gray-200 dark:border-gray-600">
    //     <div className="flex p-2">
    //       <span className="h-14 w-1 rounded-xl bg-[#7F1DF8] mr-4"></span>

    //       <div className="">
    //         <h1 className="text-2xl text-black font-semi-bold dark:text-gray-100">
    //           $ 2000
    //         </h1>
    //         <p className="text-md text-[#7B7B7B] dark:text-gray-400">Spent</p>
    //       </div>
    //     </div>

    //     <div className="flex p-2">
    //       <span className="h-14 w-1 rounded-xl bg-[#5AF940] mr-4"></span>

    //       <div className="">
    //         <h1 className="text-2xl text-black font-semi-bold dark:text-gray-100">
    //           $ 3000
    //         </h1>
    //         <p className="text-md text-[#7B7B7B] dark:text-gray-400">
    //           Remaining
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Cost;
