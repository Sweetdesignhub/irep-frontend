import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import InfoButton from "../../../../../ui/InfoButton/InfoButton";
import RuleCardsIcon from "../../../../../assets/RuleCardsIcon.svg";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";
const GenerateFlowCard = ({ data }) => {
  const [promptText, setPromptText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Rule Card");
  const handlePromptChange = (event) => {
    setPromptText(event.target.value);
  };

  return (
    <div className="w-[28vw] ">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 bg-gradient-to-t relative from-white/50 via-orange-200 to-orange-500  mx-auto"
        style={{
          //   borderWidth: "2px",
          //   borderStyle: "solid",
          borderRadius: "12px", // Matches rounded-xl
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={RuleCardsIcon}
              alt="Rule Card"
              className="w-16 h-16 bg-white p-1 inline-block mr-8 shadow-md rounded"
            />
            {/* Editable Title */}
            <div className="flex flex-col items-start">
              {isEditing ? (
                <Input
                  type="text"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  onBlur={handleBlur}
                  autoFocus
                  className="color-red bg-[#FDE6C3] text-[#8C3107]" // Apply the .titles class here
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className=" text-base text-[#8C3107] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#792A06] font-semibold mr-3 font-xl cursor-pointer">
                  {"Generate Flow"}
                </h4>
                <InfoButton text="This is a Rule Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C3107] mt-4">
            The Rule Card Help You Add more context for your Generate Response{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-md">
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-blue-500"
        />
        <h1 className="text-lg font-bold text-black mb-2">Give more Context</h1>
        <textarea
          value={promptText}
          onChange={handlePromptChange}
          placeholder="Tell us a bit more about the flow"
          className="w-full h-20 p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {/* <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" /> */}
      </div>
      <div className="relative group">
        {/* Tooltip */}
        <Tooltip title="Connect to this node!" placement="top">
          {/* Icon Above Handle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlusOutlined className="text-blue-500 text-sm" />
          </div>
        </Tooltip>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />{" "}
    </div>
  );
};

export default GenerateFlowCard;
