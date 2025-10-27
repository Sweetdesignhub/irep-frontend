// src/components/OutputNode.js
import React from "react";
import { Handle } from "@xyflow/react";

const OutputNode = ({ data }) => {
  const { question, options } = data;
  console.log("Output Node: ", data);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-72">
      <h4 className="text-lg text-black font-semibold mb-2">{question}</h4>
      {/* <p className="text-gray-600">
                Output: {options.length > 0 ? options.map(option => option.label).join(', ') : "No options"}
            </p> */}

      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  );
};

export default OutputNode;
