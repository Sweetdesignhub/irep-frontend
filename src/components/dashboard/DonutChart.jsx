

import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { DownCircleOutlined } from "@ant-design/icons";
const data = [
  { name: "Spent", value: 2000 },
  { name: "Remaining", value: 3000 },
];

const colors = ["#7F1DF8", "#4BF920"];

export default function DonutChart() {
  return (

    <PieChart width={250} height={250}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4BF920" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#4BF920" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={50}
        fill="url(#colorUv)"
      />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="url(#colorPv)"
        label
      /> */}
      <Pie
        data={data}
        dataKey="value"
        innerRadius={55}
        outerRadius={75}
        fill="#8884d8"
        // fill={index === 0 ? "#4BF920" : "url(#colorUv)"}
      >
        {data.map((entry, index) => (
          <div>
            <DownCircleOutlined />
            <Cell
              key={`cell-${index}`}
              fill={index === 0 ? "#4BF920" : "url(#colorUv)"}
            />
          </div>
        ))}
      </Pie>
    </PieChart>
  );
}
// import React from "react";
// import { PieChart, Pie, Cell } from "recharts";

// const data = [
//   { name: "Spent", value: 2000 },
//   { name: "Remaining", value: 3000 },
// ];

// export default function DonutChart() {
//   return (
//     <PieChart width={250} height={250}>
//       <defs>
//         {/* Gradient for the "Spent" segment */}
//         <linearGradient id="gradientSpent" gradientTransform="rotate(245.77)">
//           <stop offset="18.75%" stopColor="#7914FB" />
//           <stop offset="86.97%" stopColor="#D7B1E1" />
//         </linearGradient>

//         {/* Gradient for the "Remaining" segment */}
//         <linearGradient id="gradientRemaining" gradientTransform="rotate(255.21)">
//           <stop offset="37.85%" stopColor="#20F95D" stopOpacity="0" />
//           <stop offset="91.64%" stopColor="#4BF920" />
//         </linearGradient>
//       </defs>

//       <Pie
//         data={data}
//         dataKey="value"
//         innerRadius={55}
//         outerRadius={75}
//       >
//         <Cell key="cell-0" fill="url(#gradientSpent)" />
//         <Cell key="cell-1" fill="url(#gradientRemaining)" />
//       </Pie>
//     </PieChart>
//   );
// }
