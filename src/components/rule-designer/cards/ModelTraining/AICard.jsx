import React, { useState, useEffect } from "react";
import { Input, Select, Form, Button, message } from "antd";
import Papa from "papaparse";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import "../node.css";
import axios from "axios";
import InfoButton from "../../../../ui/InfoButton/InfoButton";
import ModelTrainingCardsIcon from "../../../../assets/ModelTrainingCardsIcon.svg";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

const AICard = ({ id, data }) => {
  const [nodeTitle, setNodeTitle] = useState(data.title || "");
  const [selectedModel, setSelectedModel] = useState(data.model || "");
  const [selectedDataset, setSelectedDataset] = useState(data.dataset || "");
  const [dependentVariable, setDependentVariable] = useState(
    data.dependent || ""
  );
  const [header, setHeader] = useState("AI Model Training Card");

  const [targetVariable, setTargetVariable] = useState(data.target || "");
  const [datasets, setDatasets] = useState([]);
  const [columns, setColumns] = useState([]);
  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => setIsEditing(true);
  // Access React Flow instance
  const { setNodes } = useReactFlow();

  useEffect(() => {
    // Fetch existing datasets from backend
    axios
      .get(`${host}/rules/dataset`)
      .then((response) => setDatasets(response.data))
      .catch((error) => message.error("Error fetching datasets"));

    // console.log("DATASETS: ", datasets[0]?.fileUrl);
  }, []);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setNodeTitle(newTitle);

    // Update node data in React Flow
    updateNodeData({ title: newTitle });
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setColumns([]); // Clear columns when model changes

    // Update node data in React Flow
    updateNodeData({ model: value });
  };

  const handleDatasetChange = async (value) => {
    setSelectedDataset(value);

    // Get the file URL from the datasets array
    const dataset = datasets.find((dataset) => dataset.id === value);
    const selectedFileUrl = dataset?.fileUrl;
    console.log("Dataset is: ", dataset);
    if (!selectedFileUrl) {
      message.error("Dataset file URL not found.");
      return;
    }

    try {
      // Fetch the CSV file from the backend
      const response = await axios.get(`${host}/${selectedFileUrl}`, {
        responseType: "blob",
      });
      const fileBlob = response.data;

      // Convert the Blob to text and parse with PapaParse
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.data.length > 0) {
              const parsedColumns = Object.keys(result.data[0]); // Extract column names
              setColumns(parsedColumns);
              message.success("Columns fetched successfully!");

              // Update node data in React Flow
              updateNodeData({
                dataset: dataset.title,
                columns: parsedColumns,
              });
            } else {
              message.warning("No data found in the selected dataset.");
            }
          },
          error: (error) => {
            console.error("Error parsing the file:", error);
            message.error("Failed to parse the dataset file.");
          },
        });
      };

      reader.onerror = () => {
        message.error("Failed to read the dataset file.");
      };

      reader.readAsText(fileBlob); // Read the Blob as text
    } catch (error) {
      console.error("Error fetching the dataset file:", error);
      message.error("Failed to fetch the dataset file.");
    }
  };

  const handleDependentChange = (value) => {
    setDependentVariable(value);

    // Update node data in React Flow
    updateNodeData({ dependent: value });
    console.log("Data is: ", data);
  };

  const handleTargetChange = (value) => {
    setTargetVariable(value);

    // Update node data in React Flow
    updateNodeData({ target: value });
  };

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
  const getDateColumns = () => {
    const timeKeywords = ["date", "period", "time", "timestamp"];
    return columns.filter((col) =>
      timeKeywords.some((keyword) => col.toLowerCase().includes(keyword))
    );
  };
  // options={[
  //   { label: "Sales Forecast", value: "SALES_FORECAST" },
  //   { label: "CNN", value: "CNN" },
  //   { label: "Data Analysis", value: "DATA_ANALYSIS" },
  // ]}
  const getModifiedLabel = (value) => {
    switch (value) {
      case "SALES_FORECAST":
        return "📂 Sales Forecast";
      case "CNN":
        return "📁 CNN";
      case "DATA_ANALYSIS":
        return "🔗 Data Analysis";
      default:
        return "To Decide";
    }
  };
  return (
    // <div className="Card">
    <div className="w-[30vw] ">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 absolute inset-0 rounded border-[0.65px] border-transparent bg-gradient-to-t from-[#61F6ED00]  to-[#29CCFF] relative   mx-auto"
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
              src={ModelTrainingCardsIcon}
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
                  className=" text-base text-[#073C8C] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#064279] font-semibold mr-3 font-xl cursor-pointer">
                  {getModifiedLabel(selectedModel) || "To Decide"}
                </h4>
                <InfoButton text="This is a Rule Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#073C8C] mt-4">
            The Model Traing Card Help You Choose an AI to Enhance Your Workflow{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <div>
        {/* <div className="flex items-center justify-between py-4 px-4 rounded-lg w-64 mx-auto ">
          <h4 className="titles text-base font-bold text-gray-800 cursor-pointer">
            AI CARD
          </h4>

          <InfoButton text="This is a Rule Card" />
        </div> */}
        <div
          className="flex items-center justify-between text-xl w-[30vw] py-16 rounded-lg w-64 mx-auto  font-sans bg-white bg-opacity-90 flex flex-col items-center justify-center w-[20vw] min-h-[50px] p-6 rounded-xl border border-gray-200 shadow-md space-y-4 border-4 border-transparent bg-clip-padding"
          style={{
            borderImage:
              "linear-gradient(to top, #61F6ED00 0%, #61F6ED00 32.68%, #61F6ED00 68.17%, #61F6ED00 97.25%) 1",
          }}
        >
          <Form layout="vertical">
            {/* Node Title */}
            <div>
              <Form.Item
                label={
                  <span className="text-xl text-blue-500">Node Header:</span>
                }
              >
                <Input
                  placeholder="Enter Node Header"
                  value={nodeTitle}
                  onChange={handleTitleChange}
                  className="text-black nodrag text-xl !bg-blue-200 w-80 placeholder-grey"
                />
              </Form.Item>
            </div>

            {/* Select AI Model */}
            <Form.Item
              label={
                <span className="text-xl text-blue-500">Select AI Model</span>
              }
            >
              <Select
                placeholder="Choose an AI Model"
                value={selectedModel}
                size="large"
                onChange={handleModelChange}
                options={[
                  { label: "Sales Forecast", value: "SALES_FORECAST" },
                  { label: "CNN", value: "CNN" },
                  { label: "Data Analysis", value: "DATA_ANALYSIS" },
                ]}
                className="text-[#5BE5F800] size-middle nodrag selector text-xl !bg-blue-200 w-80 placeholder-grey"
              />
            </Form.Item>

            {/* Select Dataset */}
            {selectedModel && (
              <Form.Item
                label={
                  <span className="text-xl   text-blue-500">
                    Select Dataset
                  </span>
                }
              >
                <Select
                  placeholder="Choose from available datasets"
                  value={selectedDataset}
                  size="large"
                  onChange={handleDatasetChange}
                  options={datasets.map((dataset) => ({
                    label: dataset.title,
                    value: dataset.id,
                  }))}
                  className="text-[#5BE5F800] size-middle nodrag selector text-xl !bg-blue-200 w-80 placeholder-grey"
                />
              </Form.Item>
            )}

            {/* Dependent and Target Variables for Sales Forecast */}
            {selectedModel === "SALES_FORECAST" && columns?.length > 0 && (
              <>
                <Form.Item
                  label={
                    <div className="flex flex-row justify-between py-2">
                      <span className="text-xl pr-4 text-blue-500 mt-1">
                        Dependent Variable
                      </span>
                      <InfoButton text="This Variable can only be a Date Variable and If a Date Variable not present then No Variable can be chosen" />
                    </div>
                  }
                >
                  <Select
                    placeholder="Select Date Column"
                    value={dependentVariable}
                    size="large"
                    options={getDateColumns().map((col) => ({
                      label: col,
                      value: col,
                    }))}
                    // options={columns.map((col) => ({ label: col, value: col }))}
                    onChange={handleDependentChange}
                    className="text-[#5BE5F800] !bg-blue-500 size-middle nodrag selector text-xl  w-80 placeholder-grey"
                    dropdownClassName="!bg-blue-500 !text-white"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <div className="flex flex-row justify-between py-2">
                      <span className="text-xl pr-4 text-blue-500 mt-1">
                        Target Variable
                      </span>
                      <InfoButton text="This Variable can only be a Date Variable and If a Date Variable not present then No Variable can be chosen" />
                    </div>
                  }
                >
                  <Select
                    placeholder="Select Target Variable"
                    value={targetVariable}
                    size="large"
                    options={columns.map((col) => ({ label: col, value: col }))}
                    onChange={handleTargetChange}
                    className="text-[#5BE5F800] size-middle nodrag selector text-xl !bg-blue-200 w-80 placeholder-grey"
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </div>
        {/* <Handle type="target" position="top" id="in" />
        <Handle type="target" position="right" id="dataset" />
        <Handle type="source" position="bottom" id="out" /> */}
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a source!"
        />
      </div>
    </div>
  );
};

export default AICard;
