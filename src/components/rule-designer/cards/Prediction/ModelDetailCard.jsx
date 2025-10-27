
import React, { useState, useEffect } from "react";
import { Input, Form, Button, Select, Card } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useReactFlow, Handle, useHandleConnections } from "@xyflow/react";
import "../node.css";
import { fetchPredictedData } from "../../../../services/predection.services";
import InfoButton from "../../../../ui/InfoButton/InfoButton";
import PredictionCardsIcon from "../../../../assets/PredictionCardsIcon.svg";
import { RobotOutlined } from "@ant-design/icons";

const { Option } = Select;

const ModelDetailCard = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Basic Card");
  const { setNodes } = useReactFlow();

  const [modelData, setModelData] = useState(
    data || {
      model: "",
      apiKey: "",
      temperature: "",
      maxTokens: "",
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
    const updatedData = { ...modelData, [key]: value };
    setModelData(updatedData);
    updateNodeData(updatedData); // Update the node data
    console.log("Updated Data: ", data);
  };

  return (
    <div className="w-[28vw]">
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 absolute inset-0 rounded border-[0.65px] border-transparent bg-gradient-to-t from-white  to-[#F85B5B] relative   mx-auto"
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
              src={PredictionCardsIcon}
              alt="Model Training Card"
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
                  className=" text-base text-[#8C0707] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#790606] font-semibold mr-3 font-xl cursor-pointer">
                  {"LLM Model"}
                </h4>
                <InfoButton text="This is a LMM Model Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C0707] mt-4">
            The Model Details Card Help You Choose an LLM Model to Enhance Your
            Workflow{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <Card className=" bg-red-100 border border-red-300 rounded-xl shadow-md p-4 font-montserrat">
        {/* Node Header */}
        <div className="flex items-center gap-2 mb-3">
          <RobotOutlined className="text-red-600 text-xl" />
          <h3 className="text-lg font-semibold text-blue-900">LLM Model</h3>
        </div>

        {/* Model Selection */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Select Model</label>
          <Select
            className="w-full nodrag"
            value={data.model}
            onChange={(value) => updateData("model", value)}
          >
            <Option value="gpt-4">GPT-4</Option>
            <Option value="claude-2">Claude-2</Option>
            <Option value="gemini-1.5">Gemini 1.5</Option>
            <Option value="groq">Groq</Option>
          </Select>
        </div>

        {/* API Key */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">API Key</label>
          <Input.Password
            placeholder="Enter API Key"
            value={data.apiKey}
            onChange={(e) => updateData("apiKey", e.target.value)}
          />
        </div>

        {/* Temperature */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Temperature</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="0.7"
            value={data.temperature}
            onChange={(e) => updateData("temperature", e.target.value)}
          />
        </div>

        {/* Max Tokens */}
        <div className="mb-2">
          <label className="text-sm text-gray-700">Max Tokens</label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={data.maxTokens}
            onChange={(e) => updateData("maxTokens", e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
};

export default ModelDetailCard;
