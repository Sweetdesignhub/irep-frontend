import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "antd";
import {
  ArrowLeftOutlined,
  DatabaseOutlined,
  ApiOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import DatabaseQueryCard from "./SubCards/DatabaseQueryCard";
import LiveDataConnection from "./SubCards/LiveDataConnection";
import DatabaseCardsIcon from "../../../../assets/DatabaseCardsIcon.svg";
import InfoButton from "../../../../ui/InfoButton/InfoButton";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import { Handle, Position } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import DatabaseWriteCard from "./SubCards/DatabaseWriteCard";

const MainDataAccessCard = ({ id, data }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [header, setHeader] = useState("Database Card");
  const [handles, setHandles] = useState([1]); // Initial single handle
  const { setNodes } = useReactFlow();

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(`dataAccessCard-${id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedCard(parsedData.selectedCard || null);
      setHeader(parsedData.header || "Database Card");
      // Update parent node data if it exists
      if (parsedData.config) {
        updateNodeData(parsedData.config);
      }
    }
  }, [id]);

  const handleDoubleClick = () => setIsEditing(true);
  const addHandle = () => setHandles([...handles, handles.length + 1]);
  const removeHandle = () => setHandles(handles.slice(0, -1));

  const cardOptions = [
    {
      id: "database-query",
      title: "Database Query",
      description: "Run queries on your database.",
      icon: <DatabaseOutlined className="text-blue-500 text-2xl" />,
    },
    // database-write
    {
      id: "api-integration",
      title: "API Integration ",
      description: "Fetch data from external APIs.",
      icon: <ApiOutlined className="text-purple-500 text-2xl" />,
    },
    // {
    //   id: "database-write",
    //   title: "Database Write",
    //   description: "Add Data to your Database",
    //   icon: <ApiOutlined className="text-purple-500 text-2xl" />,
    // },
  ];

  const updateNodeData = (newData) => {
    console.log("New Data is: ", newData);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      );
      console.log("Updated Nodes State: ", updatedNodes);
      return updatedNodes;
    });
  };

  // Function to handle saving database configuration
  const handleSaveDatabaseConfig = (dbConfig) => {
    const newData = {
      type: "database-query",
      ...dbConfig,
      // lastUpdated: new Date().toISOString(),
    };
    saveData(newData);
  };

  const saveData = (config) => {
    console.log("DB config: ", config);
    const dataToSave = {
      selectedCard,
      header,
      config,
      lastSaved: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(`dataAccessCard-${id}`, JSON.stringify(dataToSave));

    // Update parent component
    updateNodeData(config);
  };

  const renderSelectedComponent = () => {
    // Get saved config for the current card type
    const savedData = localStorage.getItem(`dataAccessCard-${id}`);
    let initialValues = {};

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.selectedCard === selectedCard && parsedData.config) {
        initialValues = parsedData.config;
      }
    }

    switch (selectedCard) {
      case "database-query":
        return (
          <DatabaseQueryCard
            onSave={handleSaveDatabaseConfig}
            initialValues={initialValues}
          />
        );
      case "api-integration":
        return <LiveDataConnection />;
      case "database-write":
        return <DatabaseWriteCard />;
      default:
        return null;
    }
  };
  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId);
    // Load specific saved config for this card type if it exists
    const savedData = localStorage.getItem(`dataAccessCard-${id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.selectedCard === cardId && parsedData.config) {
        updateNodeData(parsedData.config);
      }
    }
  };

  return (
    <div className="w-[28vw]">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 absolute inset-0 rounded border-[0.65px] border-transparent bg-gradient-to-t from-white to-yellow-300 relative mx-auto"
        style={{
          borderRadius: "12px",
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={DatabaseCardsIcon}
              alt="Database Card"
              className="w-16 h-16 bg-white p-1 inline-block mr-8 shadow-md rounded"
            />
            <div className="flex flex-col items-start">
              {isEditing ? (
                <Input
                  type="text"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className="text-base text-[#8C6707] text-left cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className="text-3xl text-[#796006] font-semibold mr-3 cursor-pointer">
                  Database Card
                </h4>
                <InfoButton text="This is a Database Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left text-[#8C6707] mt-4">
            This Card help you select the relevant Data essential for your Use
            Case!
          </h3>
        </div>
      </div>
      <div className="py-6">
        {selectedCard ? (
          <div>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedCard(null)}
              className="mb-4"
            >
              Back to Selection
            </Button>
            {renderSelectedComponent()}
          </div>
        ) : (
          <div>
            <h1 className="text-center pb-3">Please Select a Feature:</h1>
            <div className="grid grid-cols-1 gap-3">
              {cardOptions.map((card) => (
                <Card
                  key={card.id}
                  className="p-4 cursor-pointer border border-gray-200 hover:shadow-md transition-all"
                  // onClick={() => setSelectedCard(card.id)}
                  onClick={() => handleCardSelect(card.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p className="text-gray-500">{card.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multiple Handles Section */}
      <div className="flex justify-center gap-3 mt-4">
        <Button icon={<PlusOutlined />} onClick={addHandle} />
        <Button
          icon={<MinusOutlined />}
          onClick={removeHandle}
          disabled={handles.length <= 1}
        />
      </div>

      <div className="flex justify-center gap-4 mt-2">
        {handles.map((id) => (
          <CustomHandle
            key={id}
            type="source"
            position={Position.Bottom}
            tooltipText="Drag to connect as a source!"
          />
        ))}
      </div>
    </div>
  );
};

export default MainDataAccessCard;
