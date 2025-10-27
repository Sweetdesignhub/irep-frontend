
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// const data = [
//   {
//     successfull: 3300,
//     failed: 900,
//     month: "Oct",
//   },
//   {
//     successfull: 3000,
//     failed: 1300,
//     month: "Nov",
//   },
//   {
//     successfull: 3500,
//     failed: 800,
//     month: "Dec",
//   },
//   {
//     successfull: 2500,
//     failed: 200,
//     month: "Jan",
//   },
//   {
//     successfull: 1200,
//     failed: 900,
//     month: "Feb",
//   },
//   {
//     successfull: 3100,
//     failed: 200,
//     month: "Mar",
//   },
//   {
//     successfull: 4000,
//     failed: 900,
//     month: "Apr",
//   },
// ];

function UsageTrend({ executionData }) {
  const data = Array.isArray(executionData)
    ? executionData.map((item) => ({
        failed: item.failed,
        month: item.month,
        successfull: item.successful,
      }))
    : [];

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-left dark:text-white">Usage Trend</h1>

        <div className="flex items-center justify-center ">
          <div className="h-3 w-3 -mt-4 rounded-full bg-[#1DEB26] dark:bg-[#34D399] mr-3"></div>
          <p className="mr-7">Successful</p>

          <div className="h-3 w-3 -mt-4 rounded-full bg-[#FF3B25] dark:bg-[#EF4444] mr-3"></div>
          <p>Failed</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full mt-10">
        <BarChart
          width={600}
          height={350}
          data={data}
          // data={executionData.map((item) => ({
          //   failed: item.failed,
          //   month: item.month,
          //   successful: item.successful,
          // }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 150, backgroundColor: "#ccc" }} />
          {/* <Legend /> */}
          <Bar
            dataKey="successfull"
            barSize={10}
            fill="#1DEB26"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="failed"
            barSize={10}
            fill="#FF3B25"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </div>
    </div>
  );
}

export default UsageTrend;
