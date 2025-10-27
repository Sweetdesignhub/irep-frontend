import React from "react";
import { getBezierPath } from "@xyflow/react";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons"; // Import antd arrow icon

const CustomEdge = ({
  id,
  label,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  // Generate the Bezier path for the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // console.log("====label is: ", label);

  return (
    <>
      {/* Render the edge path */}
      <path
        id={id}
        d={edgePath}
        style={{
          ...style,
          stroke: "#C1C1C1", // Custom stroke color
          strokeWidth: 3.5, // Custom stroke width
          strokeDasharray: "10,10", // Dashed line style
          fill: "none", // Remove black fill inside the edge
        }}
        className="custom-edge-path" // Custom class for styling
      />

      {/* Render the label in a rectangular box */}
      <foreignObject
        x={labelX - 100} // Adjust position for the rectangle box
        y={labelY - 20} // Adjust position for the rectangle box
        // width="auto"
        width={200}
        height={60}
        className="cursor-pointer" // Pointer on hover
      >
        <div
          className="flex items-center justify-center bg-[#C1C1C1] text-white text-sm font-bold rounded-lg p-1 
               opacity-90 hover:opacity-100  transition-transform transition-opacity duration-300"
        >
          {label || "Next Node"}
        </div>
      </foreignObject>

      {/* Render the arrow icon at the edge's end */}
      <foreignObject
        x={targetX - 48} // Adjust position based on the icon size
        y={targetY - 16} // Adjust position based on the icon size
        width={56}
        height={56}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent", // Set background to transparent
          }}
        >
          <CaretDownOutlined style={{ fontSize: "40px", color: "#C1C1C1" }} />
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
