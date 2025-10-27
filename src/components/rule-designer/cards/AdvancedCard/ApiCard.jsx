

import { Card, Input, Select, Button } from "antd";
import { ApiOutlined, PlusOutlined } from "@ant-design/icons";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import "../node.css";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import InfoButton from "../../../../ui/InfoButton/InfoButton";
import AdvancedCardsIcon from "../../../../assets/AdvancedCardsIcon.svg";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

const { Option } = Select;

export default function ApiCard({ data, id, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Advance Card");
  const { setNodes } = useReactFlow();

  const [apiData, setApiData] = useState(
    data || {
      endpoint: "",
      method: "GET",
      queryParams: "",
      token: "",
      requestBody: "",
    }
  );

  const updateNodeData = (newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      )
    );
  };
  // Function to update the local state and node data
  const updateData = (key, value) => {
    const updatedData = { ...apiData, [key]: value };
    setApiData(updatedData);
    updateNodeData(updatedData); // Update the node data
    console.log("Updated Data: ", data);
  };

  return (
    <div className="w-[28vw]">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div
        className="flex items-center justify-between rounded-xl py-10 px-10 bg-gradient-to-t relative from-white/50 via-[#64F661] to-[#29FF3E]  mx-auto"
        style={{
          borderRadius: "12px",
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={AdvancedCardsIcon}
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
                  className="color-red bg-[#FDE6C3] text-[#8C077F]" // Apply the .titles class here
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className=" text-base  text-[#2A8C07] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#087906] font-semibold mr-3 font-xl cursor-pointer">
                  {"API Card  "}
                </h4>
                <InfoButton text="This is a Api Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#2A8C07] mt-4">
            The API Card Helps You Make an API Call to A certain URL{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <Card className="bg-green-100 border border-green-300 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <ApiOutlined className="text-green-600 text-xl" />
          <h3 className="text-lg font-semibold text-green-900">API Node</h3>
        </div>

        {/* API Endpoint */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">API Endpoint</label>
          <Input
            placeholder="https://api.example.com"
            value={apiData.endpoint}
            onChange={(e) => updateData("endpoint", e.target.value)}
          />
        </div>

        {/* Request Type */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Request Type</label>
          <Select
            className="w-full nodrag"
            value={apiData.method}
            onChange={(value) => updateData("method", value)}
          >
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        </div>

        {/* Query Params */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Query Params</label>
          <Input
            placeholder="key=value&key2=value2"
            value={apiData.queryParams}
            onChange={(e) => updateData("queryParams", e.target.value)}
          />
        </div>

        {/* Token */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Authorization Token</label>
          <Input.Password
            placeholder="Bearer token"
            value={apiData.token}
            onChange={(e) => updateData("token", e.target.value)}
          />
        </div>

        {/* Request Body */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Request Body</label>
          <Input.TextArea
            placeholder='{ "key": "value" }'
            rows={3}
            value={apiData.requestBody}
            onChange={(e) => updateData("requestBody", e.target.value)}
          />
        </div>

        {/* Add Button
        <Button type="primary" icon={<PlusOutlined />} block>
          Add API Call
        </Button> */}

        {/* Input and Output Handles */}
      </Card>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
}
