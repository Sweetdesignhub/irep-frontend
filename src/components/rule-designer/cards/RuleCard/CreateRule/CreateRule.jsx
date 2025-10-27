import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import "./CreateRule.css";
import { Button, Select, Space, Input, notification } from "antd";
import { Delete, CopyPlus, SquarePlus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import plusImg from "../../../../../assets/plus_button.png";
import {
  PlusCircleTwoTone,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import InfoButton from "../../../../../ui/InfoButton/InfoButton";
// import CustomEdge from "../../../../ExecutableDecisionEngine/CustomEdge/CustomEdge";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";
import RuleCardsIcon from "../../../../../assets/RuleCardsIcon.svg";

const CreateRule = ({ id, data }) => {
  const reactFlowInstance = useReactFlow();
  const [dropDownValue, setDropDownValue] = useState(data.dropDownValue || "");
  const [eventDropDownValue, setEventDropDownValue] = useState([]);

  const [inputValue, setInputValue] = useState(data.inputValue || "");
  const [possibleInputs, setPossibleInputs] = useState(
    data.possibleInputs || ""
  );
  const [fileOptions, setFileOptions] = useState(
    data.fileOptions || { types: "", size: "" }
  );
  const [selectTypes, setSelectTypes] = useState(data.selectTypes || "");
  const [typeCombinations, setTypeCombinations] = useState("");
  const [dropDownInputValue, setDropDownInputValue] = useState(
    data.dropDownInputValue || ""
  );
  const [outputValue, setOutputValue] = useState(data.outputValue || ""); // State for output value
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [contextValue, setContextValue] = useState("");

  // New state for AWS Textract
  const [awsTextractDetails, setAwsTextractDetails] = useState(
    data.awsTextractDetails || {
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
    }
  );
  const [queryDetails, setQueryDetails] = useState(data.queryDetails || ""); // Query to be run on Textract results
  const [outcomeDetails, setOutcomeDetails] = useState(
    data.outcomeDetails || ""
  ); // Possible outcomes
  const [header, setHeader] = useState("Rule Card");
  const [isEditing, setIsEditing] = useState(false);
  const { Option } = Select;

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = (e) => {
    setHeader(e.target.value);
    setIsEditing(false);
  };
  const updateNodeData = (newData) => {
    reactFlowInstance.setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  useEffect(() => {
    updateNodeData({
      dropDownValue,
      eventDropDownValue,
      inputValue,
      fileOptions,
      awsTextractDetails,
      queryDetails,
      outcomeDetails,
    });
  }, [
    dropDownValue,
    eventDropDownValue,
    inputValue,
    fileOptions,
    awsTextractDetails,
    queryDetails,
    outcomeDetails,
  ]);

  const handleDropDownChange = (e) => {
    setDropDownValue(e);
    // setDropDownValue(e.target.value);
  };

  // const handleEventDropDownChange = (event) => {
  //     const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
  //     setEventDropDownValue(selectedOptions);
  // };
  const handleEventDropDownChange = (values) => {
    // console.log("Selected Values is : ", values);
    setEventDropDownValue(values); // Update the state with the selected values
  };
  const handleCreateNodesAndEdges = () => {
    setIsButtonDisabled(true); // Disable the button

    setTimeout(() => setIsButtonDisabled(false), 2000);

    if (dropDownValue === "OUTPUT_NODE") {
      alert("Output node does not spawn new nodes.");
      return;
    }

    if (dropDownValue === "DROP_DOWN" && !possibleInputs) {
      alert("Please enter possible values for the dropdown!");
      return;
    }

    if (dropDownValue === "DROP_DOWN") {
      const inputs = possibleInputs.map((input) => input.trim());
      const newNodes = [];
      const newEdges = [];

      inputs.forEach((input, index) => {
        const newNodeId = uuidv4();
        const currentNode = reactFlowInstance.getNode(id);

        const newNode = {
          id: newNodeId,
          position: {
            x: currentNode.position.x + (index - 2) * 600, // Spread nodes horizontally
            y: currentNode.position.y + 1000,
          },
          data: { label: input },
          type: "Rule Card",
        };

        const newEdge = {
          id: `edge+${id}+${newNodeId}`,
          source: id,
          target: newNodeId,
          type: "custom",
          animated: true,
          label: input, // Label the edge with the input
        };

        newNodes.push(newNode);
        newEdges.push(newEdge);
      });

      reactFlowInstance.setNodes((prevNodes) => [...prevNodes, ...newNodes]);
      reactFlowInstance.setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    } else if (dropDownValue === "UPLOAD_FILE") {
      if (!queryDetails || !outcomeDetails) {
        alert("Please fill in all required fields for Upload File!");
        return;
      }

      const outcomes = outcomeDetails
        .split(",")
        .map((outcome) => outcome.trim());

      const newNodes = [];
      const newEdges = [];

      outcomes.forEach((outcome, index) => {
        const newNodeId = uuidv4();
        const currentNode = reactFlowInstance.getNode(id);

        const newNode = {
          id: newNodeId,

          position: {
            x: currentNode.position.x + (index - 2) * 600, // Spread nodes horizontally
            y: currentNode.position.y + 1000,
          },
          data: {
            label: `${outcome}`,
            awsTextractDetails,
            queryDetails,
          },
          type: "Rule Card",
        };

        const newEdge = {
          id: `edge+${id}+${newNodeId}`,
          source: id,
          target: newNodeId,
          animated: true,
          type: "custom",
          label: `${outcome}`,
        };

        newNodes.push(newNode);
        newEdges.push(newEdge);
      });

      reactFlowInstance.setNodes((prevNodes) => [...prevNodes, ...newNodes]);
      reactFlowInstance.setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    } else if (dropDownValue === "SELECT_TYPES") {
      if (!selectTypes || !typeCombinations) {
        alert(
          "Please provide types and combinations for creating child nodes!"
        );
        return;
      }

      const types = selectTypes.split(",").map((type) => type.trim());
      const combinations = typeCombinations
        .split(",")
        .map((combo) => combo.trim());
      const newNodes = [];
      const newEdges = [];

      combinations.forEach((combination, index) => {
        const newNodeId = uuidv4();
        const currentNode = reactFlowInstance.getNode(id);
        console.log("combination", combination);
        const newNode = {
          id: newNodeId,
          position: {
            x: currentNode.position.x + (index - 2) * 600, // Spread nodes horizontally
            y: currentNode.position.y + 1000,
          },
          data: { label: combination },
          type: "Rule Card",
        };

        const newEdge = {
          id: `edge+${id}+${newNodeId}`,
          source: id,
          target: newNodeId,
          animated: true,
          label: combination, // Label the edge with the combination
        };

        newNodes.push(newNode);
        newEdges.push(newEdge);
      });

      reactFlowInstance.setNodes((prevNodes) => [...prevNodes, ...newNodes]);
      reactFlowInstance.setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    } else if (dropDownValue === "EVENT_NODE") {
      const newNodes = [];
      const newEdges = [];

      const newNodeId = uuidv4();
      const currentNode = reactFlowInstance.getNode(id);

      const newNode = {
        id: newNodeId,
        position: {
          x: currentNode.position.x, // Spread nodes horizontally
          y: currentNode.position.y + 1000,
        },
        data: { label: "generate flow" },
        type: "Generate Flow Card",
      };

      const newEdge = {
        id: `edge+${id}+${newNodeId}`,
        source: id,
        target: newNodeId,
        animated: true,
        // type: custom,
        label: "generate flow", // Label the edge with the combination
      };
      console.log("Generate Flow", newNode);

      newNodes.push(newNode);
      newEdges.push(newEdge);

      reactFlowInstance.setNodes((prevNodes) => [...prevNodes, ...newNodes]);
      reactFlowInstance.setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    }
  };

  const getModifiedLabel = (value) => {
    switch (value) {
      case "DROP_DOWN":
        return "📂 Drop Down";
      case "UPLOAD_FILE":
        return "📁 Upload File";
      case "OUTPUT_NODE":
        return "🔗 Output Node";
      case "EVENT_NODE":
        return "⚡ Event Node";
      default:
        return "To Decide";
    }
  };
  return (
    <div className="w-[30vw] ">
      {/* Title Of Rule Card */}
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
                  {getModifiedLabel(dropDownValue) || "To Decide"}
                </h4>
                <InfoButton text="This is a Rule Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C3107] mt-4">
            The Rule Card Help You Decide Your Workflow{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <div>
        {/* <div class="card_inner bg-[#FDE6C3]"> */}
        <div className="font-sans  bg-white bg-opacity-90 flex flex-col items-start pl-16 justify-center min-h-[50px] pb-6 pt-12 rounded-xl border border-transparent shadow-[0px_9px_16px_0px_#E75F171F] space-y-4 bg-clip-border border-[1px] border-gradient-to-r from-white/50 via-orange-300 to-orange-500">
          {/* <Handle type="target" position={Position.Top} /> */}
          <div className="flex flex-col w-[25vw] items-start gap-2">
            <label
              htmlFor="node-header"
              className="text-xl font-medium text-[#7A2B07]"
            >
              Node Header:
            </label>
            <Input
              id="node-header"
              type="text"
              placeholder="Enter Your Node Header"
              value={inputValue}
              className="text-[#7A2B07] text-xl w-80 custom-rule-node-question"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-[25vw] items-start py-4 gap-2">
            <label
              htmlFor="node-select"
              className="text-xl font-medium text-[#7A2B07]"
            >
              Select Node Type
            </label>
            <Select
              id="node-select"
              size="large"
              placeholder="Select Which Option This Node Should Hold"
              className="nodrag nowheel text-xl w-80 text-[#7A2B07]"
              onChange={handleDropDownChange}
              dropdownClassName="!text-white"
              //   dropdownStyle={{ backgroundColor: "#FDE6C3" }} // Changes dropdown background
              options={[
                { value: "DROP_DOWN", label: "Drop Down" },
                { value: "UPLOAD_FILE", label: "Upload File" },
                { value: "OUTPUT_NODE", label: "Output Node" },
                { value: "EVENT_NODE", label: "Event Node" },
              ]}
            />
          </div>

          {dropDownValue === "EVENT_NODE" && (
            <div className="text-black font-bold p-8 italic text-center w-80 space-y-4 mb-4 p-4 rounded-lg shadow-md">
              <Input
                type="text"
                className="w-full p-2 border rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event context..."
                value={contextValue}
                onChange={(e) => {
                  setContextValue(e.target.value);
                  console.log(contextValue);
                }}
              />
              <Select
                className="nodrag nowheel w-64"
                mode="multiple"
                defaultValue="Generate Flow"
                placeholder="Select options"
                onChange={handleEventDropDownChange}
                allowClear
                options={[
                  {
                    value: "GENERATE_FLOW",
                    label: "Generate Flow",
                  },
                  {
                    value: "TEST_FLOW",
                    label: "Test WorkFlow",
                  },
                ]}
                placeholder="select it"
              />
            </div>
          )}

          {dropDownValue === "OUTPUT_NODE" && (
            <div className="font-bold text-2xl text-center text-[#7A2B07] w-80  space-y-4 mb-4 p-4 rounded-lg shadow-md">
              {inputValue}
            </div>
          )}

          {dropDownValue === "DROP_DOWN" && (
            <div className="custom-rule-node-drop-down-container text-[#7A2B07] w-80 space-y-4 mb-4 p-4 rounded-lg shadow-md">
              {/* Input Field with Add Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Input
                  type="text"
                  value={dropDownInputValue}
                  className="text-[#7A2B07] w-80 input-title custom-rule-node mt-2"
                  onChange={(e) => setDropDownInputValue(e.target.value)}
                  placeholder="Enter a value"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      dropDownInputValue.trim() &&
                      !possibleInputs.includes(dropDownInputValue.trim())
                    ) {
                      setPossibleInputs([
                        ...possibleInputs,
                        dropDownInputValue.trim(),
                      ]);
                      setDropDownInputValue(""); // Clear input field
                    } else if (
                      e.key === "Enter" &&
                      dropDownInputValue.trim() &&
                      possibleInputs.includes(dropDownInputValue.trim())
                    ) {
                      notification.warning({
                        message: "Warning",
                        description: "Same Value Already present",
                      });
                    }
                  }}
                />

                <Button
                  type="button"
                  onClick={() => {
                    if (dropDownInputValue.trim()) {
                      setPossibleInputs([
                        ...possibleInputs,
                        dropDownInputValue.trim(),
                      ]);
                      setDropDownInputValue(""); // Clear input field
                    }
                  }}
                  className="input-title ml-2 mb-2 p-1 text-blue-500 rounded-full"
                >
                  <Plus />
                </Button>
              </div>

              {/* Display Entered Values */}
              <div style={{ marginTop: "1rem" }}>
                {possibleInputs &&
                  possibleInputs.map((value, index) => (
                    <div className="flex items-center justify-center ">
                      <div
                        key={index}
                        className="input-title custom-rule-node mt-2"
                      >
                        <span>{value}</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() =>
                          setPossibleInputs(
                            possibleInputs.filter((_, i) => i !== index)
                          )
                        }
                        className="ml-2 mb-2 p-1 text-red-500  rounded-full"
                      >
                        <Delete />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {dropDownValue === "UPLOAD_FILE" && (
            <div className="upload-file-section w-80 space-y-4 mb-4 p-4 rounded-lg shadow-md">
              <h4 className="text-xl text-[#7A2B07] flex flex-row justify-between font-medium text-gray-700">
                Textract Query
                <InfoButton text="Here Ask A Query Like What is the Invoice Number or What is total Amount" />
              </h4>
              <textarea
                value={queryDetails}
                onChange={(e) => setQueryDetails(e.target.value)}
                placeholder="Query to analyze extracted data "
                className="w-full  p-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <h4 className="text-xl text-[#7A2B07]  flex flex-row justify-between font-medium text-gray-700">
                Outcome Details
                <InfoButton text="Here Write the Possible Answers to the Query in" />
              </h4>
              <textarea
                value={outcomeDetails}
                onChange={(e) => setOutcomeDetails(e.target.value)}
                placeholder="Comma-separated outcomes"
                className="w-full p-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {dropDownValue === "SELECT_TYPES" && (
            <div className=" w-[15vw] space-y-4 mb-4 p-4 rounded-lg shadow-md">
              {/* <label>Select Types (e.g., type1, type2):</label> */}
              <Input
                type="text"
                value={selectTypes}
                className="custom-rule-node-select"
                onChange={(e) => setSelectTypes(e.target.value)}
                placeholder="Comma-separated values"
              />
              {/* <label>Combinations for Child Nodes (e.g., type1-type2):</label> */}
              <Input
                type="text"
                value={typeCombinations}
                className="custom-rule-node-select"
                onChange={(e) => setTypeCombinations(e.target.value)}
                placeholder="Comma-separated combinations"
              />
            </div>
          )}

          {dropDownValue && dropDownValue !== "OUTPUT_NODE" && (
            <div>
              <Button
                className="pl-8 w-80 h-10 bg-[#FDE6C3] mb-4 flex justify-center items-center"
                onClick={handleCreateNodesAndEdges}
                color="#7A2B07"
                variant="dashed"
                disabled={isButtonDisabled}
              >
                <img src={plusImg} alt="icon" className="h-7 w-7" />
                <h2 className="pl-0 text-[#7A2B07]">Create Nodes and Edges</h2>
              </Button>
            </div>
          )}

          {/* <Handle type="source" position={Position.Bottom} /> */}
        </div>
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a source!"
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default CreateRule;
