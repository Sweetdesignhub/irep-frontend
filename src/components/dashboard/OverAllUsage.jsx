

import React from 'react';
import { ArrowUpIcon } from "@heroicons/react/24/outline";

function OverAllUsage({ totalRules, status, successfull, failed }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 min-h-56">
      <h1 className="text-black dark:text-gray-100">Overall Usage</h1>

      <div className="mt-4 flex justify-center w-full p-2 items-center flex-col border-b-2 border-gray-200 dark:border-gray-600 relative">
        <h1 className="font-bold text-3xl text-black dark:text-gray-100">{totalRules}</h1>
        <p className="text-[#8C89B4] dark:text-gray-400 text-xs">Rule Execution</p>
        <div className="absolute right-8 top-3 flex items-center text-[#43A945]">
          <ArrowUpIcon className="h-3" />
          <p className="text-xs">{status}%</p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-2">
        <div className="border-r-2 border-gray-200 dark:border-gray-600 flex flex-col items-center w-full">
          <h1 className="font-bold text-xl text-[#1DEB26]">{successfull}</h1>
          <p className="text-[#7B7B7B] dark:text-gray-400 text-xs">Successful</p>
        </div>

        <div className="flex flex-col items-center w-full">
          <h1 className="font-bold text-xl text-[#FF3B25]">{failed}</h1>
          <p className="text-[#7B7B7B] dark:text-gray-400 text-xs">Failed</p>
        </div>
      </div>
    </div>
  )
}

export default OverAllUsage;
