
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

const data = [
  {
    name: "Team 1",
    successfull: 2900,
    failed: 400,
  },
  {
    name: "Team 2",
    successfull: 2500,
    failed: 500,
  },
  {
    name: "Team 3",
    successfull: 1500,
    failed: 100,
  },
  {
    name: "Team 4",
    successfull: 1000,
    failed: 500,
  },
  {
    name: "Team 5",
    successfull: 550,
    failed: 120,
  },
  {
    name: "Team 6",
    successfull: 1239,
    failed: 180,
  },
  {
    name: "Team 7",
    successfull: 1500,
    failed: 100,
  },
];

export default function TeamUsage() {
  return (
    <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-left dark:text-white">Team Usage</h1>

        <div className="flex items-center">
          <div className="h-3 w-3 -mt-4  rounded-full bg-[#1DEB26] dark:bg-[#34D399] mr-3"></div>
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
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          {/* <Legend /> */}

          <Bar
            stackId="a"
            dataKey="failed"
            barSize={10}
            fill="#FF3B25"
            // radius={[0, 60, 60, 0]}
            // background={{ fill: "#eee" }}
          />
          <Bar
            stackId="a"
            dataKey="successfull"
            barSize={10}
            fill="#1DEB26"
            radius={[0, 60, 60, 0]}
          />
        </BarChart>
      </div>
    </div>
  );
}
