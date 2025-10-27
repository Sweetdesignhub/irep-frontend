import React, { useState } from "react";
import { Card, Button, Input, message } from "antd";
import {
  ArrowLeftOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import ModelTrainingCardsIcon from "../../../../assets/ModelTrainingCardsIcon.svg";
import HeaderDesignCard from "../HeaderDesignCard/HeaderDesignCard";

const NLPCard = ({ id, data }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const { setNodes } = useReactFlow();

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

  const algorithmOptions = [
    {
      id: "semantic-analysis",
      title: "Semantic Analysis",
      description:
        "Analyze text sentiment and return a score (0-100). Example: Product reviews analysis.",
      icon: <ExperimentOutlined className="text-blue-500 text-2xl" />,
    },
  ];

  const handleAlgorithmSelect = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    updateNodeData({
      selectedAlgorithm: algorithmId,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveSemanticConfig = (config) => {
    updateNodeData({
      algorithm: "semantic-analysis",
      ...config,
      lastUpdated: new Date().toISOString(),
    });
  };

  const renderSelectedComponent = () => {
    switch (selectedAlgorithm) {
      case "semantic-analysis":
        return (
          <SemanticAnalysis
            onSave={handleSaveSemanticConfig}
            initialValues={data}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[28vw]">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <HeaderDesignCard
        gradientColors={["#61F6ED00", "#29CCFF", "#29CCFF"]}
        iconSrc={ModelTrainingCardsIcon}
        initialHeader="AI Model Training Card"
        titleText="NLP Card"
        helperText="NLP algorithms help understand and respond to human language "
        infoButtonText="Learn more about NLP Card"
        primaryTextColor="#064279"
        titleTextColor="#073C8C"
      />

      <Card className="p-4 border border-gray-200 rounded-lg shadow-sm">
        {selectedAlgorithm ? (
          <div>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedAlgorithm(null)}
              className="mb-4"
            >
              Back to Selection
            </Button>
            {renderSelectedComponent()}
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-semibold mb-4">
              Select NLP Algorithm:
            </h1>
            <div className="grid grid-cols-1 gap-3">
              {algorithmOptions.map((algo) => (
                <Card
                  key={algo.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleAlgorithmSelect(algo.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {algo.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{algo.title}</h3>
                      <p className="text-gray-500">{algo.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
};

// Semantic Analysis Component
const SemanticAnalysis = ({ onSave, initialValues }) => {
  const [text, setText] = useState("");
  const [variableName, setVariableName] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) {
      message.error("Please enter some text to analyze");
      return;
    }
    if (!variableName.trim()) {
      message.error("Please enter a variable name");
      return;
    }

    setLoading(true);
    const pythonHost =
      import.meta.env.VITE_PYTHON_INFERENCING_API_URL ||
      "http://127.0.0.1:8000"; // Adjust your API URL

    try {
      const response = await fetch(`${pythonHost}/analyze-sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: text }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      console.log("Result is: ", result);
      setScore(result.sentiment_score);

      // Save the configuration with variable name
      onSave({
        type: "semantic-analysis",
        variableName: variableName.trim(),
        lastInput: text,
        lastScore: result.sentiment_score,
        lastAnalysis: new Date().toISOString(),
      });

      message.success("Analysis completed!");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Semantic Analysis</h3>
        <p className="text-gray-600 mb-4">
          Enter text to analyze its sentiment (score 0-100)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Variable Name
        </label>
        <Input
          placeholder="Enter variable name (e.g., 'customer_review')"
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
          className="mb-4"
        />
      </div>

      <Input.TextArea
        rows={4}
        placeholder="Enter text to analyze..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        type="primary"
        loading={loading}
        onClick={analyzeText}
        icon={<CheckCircleOutlined />}
      >
        Analyze Text
      </Button>

      {score !== null && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium">Analysis Result:</h4>
          <p>
            Sentiment Score: <span className="font-bold">{score}</span>/100
          </p>
          {score >= 70 && <p className="text-green-600">Positive Sentiment</p>}
          {score < 70 && score >= 30 && (
            <p className="text-yellow-600">Neutral Sentiment</p>
          )}
          {score < 30 && <p className="text-red-600">Negative Sentiment</p>}
        </div>
      )}
    </div>
  );
};
// // Semantic Analysis Component
// const SemanticAnalysis = ({ onSave, initialValues }) => {
//   const [text, setText] = useState("");
//   const [score, setScore] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const analyzeText = async () => {
//     if (!text.trim()) {
//       message.error("Please enter some text to analyze");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/analyze-sentiment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sentence: text }),
//       });

//       if (!response.ok) {
//         throw new Error("Analysis failed");
//       }

//       const result = await response.json();
//       console.log("Resule is: ", result);
//       setScore(result.sentiment_score);

//       // Save the configuration
//       onSave({
//         type: "semantic-analysis",
//         lastInput: text,
//         lastScore: result.sentiment_score,
//         lastAnalysis: new Date().toISOString(),
//       });

//       message.success("Analysis completed!");
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <h3 className="font-medium mb-2">Semantic Analysis</h3>
//         <p className="text-gray-600 mb-4">
//           Enter text to analyze its sentiment (score 0-100)
//         </p>
//       </div>

//       <Input.TextArea
//         rows={4}
//         placeholder="Enter text to analyze..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <Button
//         type="primary"
//         loading={loading}
//         onClick={analyzeText}
//         icon={<CheckCircleOutlined />}
//       >
//         Analyze Text
//       </Button>

//       {score !== null && (
//         <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//           <h4 className="font-medium">Analysis Result:</h4>
//           <p>
//             Sentiment Score: <span className="font-bold">{score}</span>/100
//           </p>
//           {score >= 70 && <p className="text-green-600">Positive Sentiment</p>}
//           {score < 70 && score >= 30 && (
//             <p className="text-yellow-600">Neutral Sentiment</p>
//           )}
//           {score < 30 && <p className="text-red-600">Negative Sentiment</p>}
//         </div>
//       )}
//     </div>
//   );
// };

export default NLPCard;
