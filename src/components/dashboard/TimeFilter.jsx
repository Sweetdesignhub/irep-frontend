

import React from "react";
import TopBar from "./TopBar";

function TimeFilter() {
  const user = localStorage.getItem("authUser");
  let firstName = ''

  if (user) {
    const parsedUser = JSON.parse(user);
    firstName = parsedUser.name.split(" ")[0];
  } else {
    console.log("No user found in localStorage.");
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <h2 className="text-[#343434] dark:text-white font-semibold lg:mr-4 mb-4 lg:mb-0">
        Hey {firstName}. 494 rules have failed and require your attention
      </h2>
      <div className="border border-transparent bg-clip-padding relative p-4 rounded-lg">
        <div className="absolute inset-0 rounded-lg border-[1px] border-solid" style={{
          borderImageSource: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(207, 97, 246, 0) 32.68%, rgba(198, 91, 248, 0) 68.17%, #FB29FF 97.25%)',
          borderImageSlice: 1
        }} />
        {/* Content goes here */}
        Top-to-Bottom Gradient Border Content
      </div>
      <TopBar />

      <div className="flex w-full lg:w-auto lg:justify-end">
        <p className="text-[#617283] cursor-pointer dark:text-gray-400 mr-4 mb-2 lg:mb-0">
          All time
        </p>
        <p className="text-[#617283] cursor-pointer dark:text-gray-400 mr-4 mb-2 lg:mb-0">
          Last 7 days
        </p>
        <p className="text-[#617283] cursor-pointer dark:text-gray-400 mr-4 mb-2 lg:mb-0">
          Last 30 days
        </p>
        <p className="text-[#617283] cursor-pointer dark:text-gray-400">
          Date Range
        </p>
      </div>
    </div>
  );
}

export default TimeFilter;
