import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "antd";
import CustomHandle from "../../../ui/customHandle/CustomHandle";

const EventNodeExecutable = ({ data }) => {
  const hasGenerateFlowOption = data.options?.some(
    (option) => option.label.toLowerCase() === "generate flow"
  );

  const handleGenerateFlow = () => {
    if (data.onAnswer) {
      data.onAnswer("generate flow");
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-montserrat text-l font-bold mb-3 ml-1">
          Event Flow
        </h1>
      </div>
      <div className="h-[16] min-h-[32] min-w-[320px] shadow-lg shadow-[#166DBE1A] max-w-[400px] w-auto  break-words bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-xl p-2">
        <CustomHandle
          type="target"
          position={Position.Top}
          tooltipText="Drag to connect as a target!"
        />

        <h1 className="ml-6 mt-4 font-montserrat font-medium text-sm text-[#343434BF] mb-2">
          Event Flow: {data.question || "(Not Specified)"}
        </h1>

        {hasGenerateFlowOption && (
          <Button
            className="ml-6 mb-4 mt-2"
            onClick={handleGenerateFlow}
            color="primary"
            variant="filled"
          >
            Generate Flow
          </Button>
          // <button
          //     onClick={handleGenerateFlow}
          //     className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          // >
          //     Generate Flow
          // </button>
        )}

        {/* <Handle
                    type="target"
                    position={Position.Top}
                    className="w-2 h-2 bg-blue-500"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-2 h-2 bg-blue-500"
                /> */}
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a target!"
        />
      </div>
    </div>
  );
};

export default EventNodeExecutable;
