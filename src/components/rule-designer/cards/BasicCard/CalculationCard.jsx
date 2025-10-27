import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Select,
  Table,
  InputNumber,
  Form,
  Space,
  Typography,
  Tooltip,
  Switch,
  Modal,
} from "antd";
import { Handle, Position } from "@xyflow/react";
import "../node.css";
import BasicCardsIcon from "../../../../assets/BasicCardsIcon.svg";
import {
  CalculatorOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import { useReactFlow } from "@xyflow/react";

import HeaderDesignCard from "../HeaderDesignCard/HeaderDesignCard";

const { Option } = Select;
const { Title, Text } = Typography;

export default function CalculationCard({ id, data: nodeData, setNodeData }) {
  const { getEdges } = useReactFlow();
  const { setNodes, nodes } = useReactFlow();
  const [form] = Form.useForm();
  const [inputVariables, setInputVariables] = useState([]);
  const [customVariables, setCustomVariables] = useState(
    nodeData?.customVariables || []
  );
  const [formula, setFormula] = useState(nodeData?.formula || "");
  const [results, setResults] = useState(nodeData?.results || []);
  const [previewData, setPreviewData] = useState(nodeData?.previewData || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [sampleSize, setSampleSize] = useState(nodeData?.sampleSize || 3);
  const [editingSampleIndex, setEditingSampleIndex] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditSample, setCurrentEditSample] = useState({});

  // Load data from nodeData on initial render
  useEffect(() => {
    if (nodeData) {
      if (nodeData.formula) setFormula(nodeData.formula);
      if (nodeData.customVariables)
        setCustomVariables(nodeData.customVariables);
      if (nodeData.results) setResults(nodeData.results);
      if (nodeData.previewData) setPreviewData(nodeData.previewData);
      if (nodeData.sampleSize) setSampleSize(nodeData.sampleSize);
    }
  }, []);
  useEffect(() => {
    console.log("Updated Nodes: ", nodes);
  }, [nodes]);

  const updateNodeData = (newData) => {
    console.log("New Data is: ", newData);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      );
      console.log("Updated Nodes State: ", updatedNodes);
      return updatedNodes;
    });
    console.log("Data Stored is: ", nodeData);
  };

  // Save data to nodeData whenever it changes
  useEffect(() => {
    console.log("Change detected!", formula);
    updateNodeData({ formula: formula });
    updateNodeData({
      formula: formula,
      customVariables: customVariables,
      inputVariables: inputVariables,
      results: results,
      previewData: previewData,
      sampleSize: sampleSize,
    });
  }, [
    formula,
    customVariables,
    results,
    previewData,
    sampleSize,
    inputVariables,
  ]);

  // Load connected edges and prepare variables
  useEffect(() => {
    const edges = getEdges();
    const connectedEdges = edges.filter((edge) => edge.target === id);

    // Transform edge data into input variables
    const edgeVariables = connectedEdges.map((edge, index) => {
      const variableName = generateVariableName(
        edge.label || `Input${index + 1}`,
        edge.data?.dataType
      );

      return {
        id: edge.id,
        name: variableName,
        label: edge.label || `Input ${index + 1}`,
        type: edge.data?.dataType === "Array" ? "Array" : "Number",
        value: edge.data?.dataType === "Array" ? [] : 0,
        isEdgeInput: true,
        edgeId: edge.id,
        sourceId: edge.source,
      };
    });

    setInputVariables(edgeVariables);
  }, [id, getEdges]);

  // Generate variable names based on label and type
  const generateVariableName = (label, type) => {
    // Convert the label to camelCase format for variable naming
    const cleanLabel = label
      .replace(/[^\w\s]/gi, "")
      .trim()
      .split(/\s+/)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");

    // Add type suffix for clarity
    const typeSuffix = type === "Array" ? "List" : "";
    return cleanLabel + typeSuffix;
  };

  // Add custom variable
  const addCustomVariable = () => {
    const newVar = {
      id: `custom-${Date.now()}`,
      name: `customVar${customVariables.length + 1}`,
      label: `Custom Variable ${customVariables.length + 1}`,
      type: "Number",
      value: 0,
      isEdgeInput: false,
    };

    setCustomVariables([...customVariables, newVar]);
  };

  // Remove custom variable
  const removeCustomVariable = (id) => {
    setCustomVariables(customVariables.filter((v) => v.id !== id));
  };

  // Update variable properties
  const updateVariable = (id, field, value, isCustom) => {
    if (isCustom) {
      setCustomVariables(
        customVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
    } else {
      setInputVariables(
        inputVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
    }
  };

  // Initialize sample data with default values
  const initializeSampleData = () => {
    const allVariables = [...inputVariables, ...customVariables];
    const newSampleData = [];

    for (let i = 0; i < sampleSize; i++) {
      const row = { key: i, reference: `Sample ${i + 1}` };

      // Add default values for each variable
      allVariables.forEach((variable) => {
        row[variable.name] = variable.type === "Array" ? [] : 0;
      });

      newSampleData.push(row);
    }

    setPreviewData(newSampleData);
  };

  // Update sample data when variables change
  useEffect(() => {
    if (previewData.length === 0 || previewData.length !== sampleSize) {
      initializeSampleData();
    } else {
      // Update existing data with any new variables
      const allVariables = [...inputVariables, ...customVariables];
      const updatedData = previewData.map((row) => {
        const newRow = { ...row };

        allVariables.forEach((variable) => {
          // If the variable doesn't exist in the row data yet
          if (!(variable.name in newRow)) {
            newRow[variable.name] = variable.type === "Array" ? [] : 0;
          }
        });

        return newRow;
      });

      setPreviewData(updatedData);
    }
  }, [inputVariables, customVariables, sampleSize]);

  // Run calculation based on formula
  const runCalculation = () => {
    try {
      setErrorMessage("");
      const allVariables = [...inputVariables, ...customVariables];
      console.log("Formula is:", formula);
      // Validate the formula for safety
      validateFormula(formula, allVariables);
      console.log("Formula validated");
      // Calculate results for each sample data row
      const calculatedResults = previewData.map((row) => {
        // Create a context with variable values from this row
        const context = {};
        allVariables.forEach((variable) => {
          context[variable.name] = row[variable.name];
        });
        console.log("Formula to be calculated", context);

        // Evaluate the formula with this context
        const result = evaluateFormula(formula, context);
        console.log("result:", result);

        return {
          reference: row.reference,
          calculatedValue: result,
        };
      });

      setResults(calculatedResults);
    } catch (error) {
      console.log("Found error: ", error);
      setErrorMessage(error.message);
    }
  };

  // Validate formula for safety (prevent code injection)
  const validateFormula = (formula, variables) => {
    // Check if formula is empty
    if (!formula.trim()) {
      throw new Error("Formula cannot be empty");
    }

    // Check for potentially dangerous functions
    const dangerousTerms = [
      "eval",
      "Function",
      "setTimeout",
      "setInterval",
      "fetch",
      "import",
      "require",
    ];
    if (dangerousTerms.some((term) => formula.includes(term))) {
      throw new Error("Formula contains prohibited functions");
    }

    // Check if formula only uses defined variables
    const variableNames = variables.map((v) => v.name);
    const usedVariables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

    // Filter out common math functions and constants
    const mathFunctions = [
      "Math",
      "abs",
      "max",
      "min",
      "round",
      "ceil",
      "floor",
      "sqrt",
      "pow",
      "exp",
      "log",
      "sin",
      "cos",
      "tan",
    ];
    const undefinedVariables = usedVariables.filter(
      (v) =>
        !variableNames.includes(v) && !mathFunctions.includes(v) && v !== "Math"
    );

    if (undefinedVariables.length > 0) {
      throw new Error(
        `Formula uses undefined variables: ${undefinedVariables.join(", ")}`
      );
    }
  };

  // Safely evaluate formula
  // const evaluateFormula = (formula, context) => {
  //   // Create a function with the formula
  //   try {
  //     const variables = Object.keys(context);
  //     const values = Object.values(context);

  //     // Create a function with the variables as parameters
  //     const func = new Function(...variables, `return ${formula}`);

  //     // Call the function with the variable values
  //     return func(...values);
  //   } catch (error) {
  //     throw new Error(`Error in formula: ${error.message}`);
  //   }
  // };

  // // Helper to get all available variables for formula building
  const getAllVariables = () => {
    return [...inputVariables, ...customVariables];
  };
  const evaluateFormula = (formula, context) => {
    try {
      const variables = Object.keys(context);
      const values = variables.map((key) => {
        const val = context[key];
        return typeof val === "string" && !isNaN(val) ? +val : val;
      });

      // Create safe variable names and prepare the formula
      const processedFormula = formula.replace(
        /\b([a-zA-Z_]\w*)\b(?!\()/g,
        (match) =>
          variables.includes(match) ? `(+context['${match}'])` : match
      );

      // Create and execute the function
      const func = new Function("context", `return ${processedFormula}`);
      return func(context);
    } catch (error) {
      throw new Error(`Formula evaluation failed: ${error.message}`);
    }
  };
  // const evaluateFormula = (formula, context) => {
  //   // Create a function with the formula
  //   try {
  //     const variables = Object.keys(context);

  //     // Convert all numeric values to proper numbers
  //     const values = Object.values(context).map((val) =>
  //       typeof val === "string" && !isNaN(Number(val)) ? Number(val) : val
  //     );

  //     // Create a function with the variables as parameters
  //     // Force numeric context by adding + before variables that should be numbers
  //     let processedFormula = formula;
  //     variables.forEach((varName) => {
  //       // Only add the + operator to variable names, not within function calls or other contexts
  //       const regex = new RegExp(`\\b${varName}\\b(?!\\()`, "g");
  //       if (
  //         typeof context[varName] === "number" ||
  //         !isNaN(Number(context[varName]))
  //       ) {
  //         processedFormula = processedFormula.replace(regex, `(+${varName})`);
  //       }
  //     });
  //     console.log("Reached", variables);
  //     console.log("formula", processedFormula);

  //     const func = new Function(...variables, `return ${processedFormula}`);
  //     console.log("Not Reached");

  //     // Call the function with the variable values
  //     return func(...values);
  //   } catch (error) {
  //     throw new Error(`Error in formula: ${error.message}`);
  //   }
  // };

  // Open the edit modal for a specific sample
  const openEditModal = (index) => {
    setEditingSampleIndex(index);
    setCurrentEditSample(previewData[index]);
    setIsEditModalVisible(true);
  };

  // Save edited sample data
  const saveEditedSample = () => {
    const updatedData = [...previewData];
    updatedData[editingSampleIndex] = currentEditSample;
    setPreviewData(updatedData);
    setIsEditModalVisible(false);
  };

  // Handle changes to sample values in the edit modal
  const handleSampleChange = (name, value) => {
    setCurrentEditSample({
      ...currentEditSample,
      [name]: value,
    });
  };

  // Update the number of samples
  const handleSampleSizeChange = (value) => {
    setSampleSize(value);
    // Re-initialize sample data with the new size
    setPreviewData([]);
  };

  return (
    <div className="w-[46vw]">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <HeaderDesignCard
        gradientColors={["#00000000", "#EA61F6", "#FF29EA"]}
        iconSrc={BasicCardsIcon}
        initialHeader="Basic Card"
        titleText="Calculation Card"
        helperText="Calculate values using formula-based calculations"
        infoButtonText="Learn more about calculations"
        primaryTextColor="#8C077F"
        titleTextColor="#770679"
      />
      <Card className="bg-pink-100 border border-pink-300 rounded-xl shadow-md p-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-pink-900 mb-4">
          <CalculatorOutlined className="text-xl" />
          <span>Calculation Engine</span>
        </div>

        <div className="space-y-6">
          {/* Connected Inputs Section - Simplified */}
          <div>
            <Title level={5} className="mb-2 text-pink-800">
              Connected Inputs
            </Title>
            {inputVariables.length > 0 ? (
              <div className="space-y-3">
                {inputVariables.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={variable.name}
                      onChange={(e) =>
                        updateVariable(
                          variable.id,
                          "name",
                          e.target.value,
                          false
                        )
                      }
                      className="flex-1"
                      placeholder="Variable Name"
                      addonBefore={variable.label}
                    />
                    <Select
                      value={variable.type}
                      className="nodrag"
                      onChange={(value) =>
                        updateVariable(variable.id, "type", value, false)
                      }
                      style={{ width: 100 }}
                    >
                      <Option value="Number">Number</Option>
                      <Option value="Array">Array</Option>
                    </Select>
                    <InputNumber
                      value={variable.type === "Number" ? variable.value : 0}
                      onChange={(value) =>
                        updateVariable(variable.id, "value", value, false)
                      }
                      className="w-24"
                      disabled={variable.type === "Array"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500">
                No inputs connected. Connect edges to this node to get input
                variables.
              </Text>
            )}
          </div>

          {/* Custom Variables Section - Simplified */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Title level={5} className="m-0 text-pink-800">
                Custom Variables
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addCustomVariable}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Add Variable
              </Button>
            </div>

            {customVariables.length > 0 ? (
              <div className="space-y-3">
                {customVariables.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={variable.name}
                      onChange={(e) =>
                        updateVariable(
                          variable.id,
                          "name",
                          e.target.value,
                          true
                        )
                      }
                      className="flex-1"
                      placeholder="Variable Name"
                    />
                    <Select
                      value={variable.type}
                      onChange={(value) =>
                        updateVariable(variable.id, "type", value, true)
                      }
                      className="nodrag"
                      style={{ width: 100 }}
                    >
                      <Option value="Number">Number</Option>
                      <Option value="Array">Array</Option>
                    </Select>
                    <InputNumber
                      value={variable.type === "Number" ? variable.value : 0}
                      onChange={(value) =>
                        updateVariable(variable.id, "value", value, true)
                      }
                      className="w-24"
                      disabled={variable.type === "Array"}
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeCustomVariable(variable.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500">
                No custom variables added yet.
              </Text>
            )}
          </div>

          {/* Formula Builder Section - Kept as is */}
          <div>
            <Title level={5} className="mb-2 text-pink-800">
              Formula Builder
            </Title>
            <div className="mb-3">
              <Text className="text-gray-700 block mb-1">
                Available Variables:
              </Text>
              <div className="flex flex-wrap gap-2">
                {getAllVariables().map((variable) => (
                  <Tooltip
                    key={variable.id}
                    title={`${variable.label || variable.name} (${
                      variable.type
                    })`}
                  >
                    <Button
                      size="small"
                      onClick={() =>
                        setFormula((prev) => `${prev.trim()} ${variable.name}`)
                      }
                      className="bg-pink-50 text-pink-800 border-pink-300"
                    >
                      {variable.name}
                    </Button>
                  </Tooltip>
                ))}
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev.trim()} +`)}
                >
                  +
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev.trim()} -`)}
                >
                  -
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev.trim()} *`)}
                >
                  *
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev.trim()} /`)}
                >
                  /
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev} Math.max(,)`)}
                >
                  max()
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev} Math.min(,)`)}
                >
                  min()
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev} Math.round(`)}
                >
                  round()
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev} (`)}
                >
                  (
                </Button>
                <Button
                  size="small"
                  onClick={() => setFormula((prev) => `${prev} )`)}
                >
                  )
                </Button>
              </div>
            </div>
            <div>
              <Text className="text-gray-700 block mb-1">Formula:</Text>
              <div className="flex mb-2">
                <Input
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="e.g. baseValue * multiplier + offset"
                  className="flex-1"
                  addonBefore={<CalculatorOutlined />}
                />
              </div>
              {errorMessage && (
                <Text type="danger" className="block mb-2">
                  {errorMessage}
                </Text>
              )}
              <Button
                type="primary"
                onClick={runCalculation}
                className="bg-pink-600 hover:bg-pink-700 mb-4"
              >
                Calculate
              </Button>
            </div>
          </div>

          {/* Sample Data Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Title level={5} className="m-0 text-pink-800">
                Sample Data
              </Title>
              <Space>
                <Text>Number of samples:</Text>
                <InputNumber
                  min={1}
                  max={20}
                  value={sampleSize}
                  onChange={handleSampleSizeChange}
                />
              </Space>
            </div>
            <div className="overflow-x-auto">
              <Table
                dataSource={previewData}
                size="small"
                scroll={{ x: "auto" }}
                columns={[
                  {
                    title: "Reference",
                    dataIndex: "reference",
                    key: "reference",
                    width: 120,
                  },
                  {
                    title: "Action",
                    key: "action",
                    width: 80,
                    render: (_, record, index) => (
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEditModal(index)}
                      />
                    ),
                  },
                  ...getAllVariables().map((variable) => ({
                    title: variable.name,
                    dataIndex: variable.name,
                    key: variable.name,
                    width: 100,
                  })),
                ]}
                className="mb-4 nodrag"
              />
            </div>
          </div>
          {/* Results Section */}
          {results.length > 0 && (
            <div>
              <Title level={5} className="mb-2 text-pink-800">
                Calculation Results
              </Title>
              <Table
                dataSource={results.map((result, index) => ({
                  key: index,
                  ...result,
                }))}
                columns={[
                  {
                    title: "Sample",
                    dataIndex: "reference",
                    key: "reference",
                  },
                  {
                    title: "Result",
                    dataIndex: "calculatedValue",
                    key: "calculatedValue",
                    render: (value) =>
                      typeof value === "number" ? value.toFixed(2) : value,
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Sample Edit Modal */}
      <Modal
        title="Edit Sample Data"
        open={isEditModalVisible}
        onOk={saveEditedSample}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
      >
        {currentEditSample && (
          <Form layout="vertical">
            <Form.Item label="Reference" name="reference">
              <Input
                value={currentEditSample.reference}
                onChange={(e) =>
                  handleSampleChange("reference", e.target.value)
                }
              />
            </Form.Item>
            {getAllVariables().map((variable) => (
              <Form.Item
                key={variable.id}
                label={variable.name}
                name={variable.name}
              >
                {variable.type === "Number" ? (
                  <InputNumber
                    value={currentEditSample[variable.name]}
                    onChange={(value) =>
                      handleSampleChange(variable.name, value)
                    }
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Input
                    value={currentEditSample[variable.name]}
                    onChange={(e) =>
                      handleSampleChange(variable.name, e.target.value)
                    }
                    placeholder="Array values (comma separated)"
                  />
                )}
              </Form.Item>
            ))}
          </Form>
        )}
      </Modal>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
}
// import { useState, useEffect } from "react";
// import {
//   Button,
//   Input,
//   Card,
//   Select,
//   Table,
//   InputNumber,
//   Form,
//   Space,
//   Typography,
//   Tooltip,
// } from "antd";
// import { Handle, Position } from "@xyflow/react";
// import "../node.css";
// import BasicCardsIcon from "../../../../assets/BasicCardsIcon.svg";
// import {
//   CalculatorOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   // FormulaOutlined,
// } from "@ant-design/icons";
// import CustomHandle from "../../../../ui/customHandle/CustomHandle";
// import { useReactFlow } from "@xyflow/react";
// import HeaderDesignCard from "../HeaderDesignCard/HeaderDesignCard";

// const { Option } = Select;
// const { Title, Text } = Typography;

// export default function CalculationCard({ id, data }) {
//   const { getEdges } = useReactFlow();
//   const [form] = Form.useForm();
//   const [inputVariables, setInputVariables] = useState([]);
//   const [customVariables, setCustomVariables] = useState([]);
//   const [formula, setFormula] = useState("");
//   const [results, setResults] = useState([]);
//   const [previewData, setPreviewData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   // const [edges, setEdges] = useState([]);

//   useEffect(() => {
//     const edges = getEdges();
//     const connectedEdges = edges.filter((edge) => edge.target === id);

//     // Transform edge data into input variables with professional names
//     const edgeVariables = connectedEdges.map((edge, index) => {
//       const variableName = generateVariableName(
//         edge.label || `Input${index + 1}`,
//         edge.data?.dataType
//       );

//       return {
//         id: edge.id,
//         name: variableName,
//         label: edge.label || `Input ${index + 1}`,
//         type: edge.data?.dataType || "Number",
//         value: edge.data?.dataType === "Array" ? [0, 0, 0] : 0,
//         isEdgeInput: true,
//         edgeId: edge.id,
//         sourceId: edge.source,
//       };
//     });

//     setInputVariables(edgeVariables);
//   }, [id, getEdges]);

//   // Generate professional variable names based on label and type
//   const generateVariableName = (label, type) => {
//     // Convert the label to camelCase format for variable naming
//     const cleanLabel = label
//       .replace(/[^\w\s]/gi, "")
//       .trim()
//       .split(/\s+/)
//       .map((word, index) =>
//         index === 0
//           ? word.toLowerCase()
//           : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//       )
//       .join("");

//     // Add type suffix for clarity in professional environment
//     const typeSuffix = type === "Array" ? "List" : "";
//     return cleanLabel + typeSuffix;
//   };

//   // Add custom variable
//   const addCustomVariable = () => {
//     const newVar = {
//       id: `custom-${Date.now()}`,
//       name: `customVar${customVariables.length + 1}`,
//       label: `Custom Variable ${customVariables.length + 1}`,
//       type: "Number",
//       value: 0,
//       isEdgeInput: false,
//     };

//     setCustomVariables([...customVariables, newVar]);
//   };

//   // Remove custom variable
//   const removeCustomVariable = (id) => {
//     setCustomVariables(customVariables.filter((v) => v.id !== id));
//   };

//   // Update variable properties
//   const updateVariable = (id, field, value, isCustom) => {
//     if (isCustom) {
//       setCustomVariables(
//         customVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
//       );
//     } else {
//       setInputVariables(
//         inputVariables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
//       );
//     }
//   };

//   // Generate sample data for testing
//   useEffect(() => {
//     const allVariables = [...inputVariables, ...customVariables];

//     // For demonstration, create some dummy data
//     const sampleSize = 3;
//     const sampleData = [];

//     // Find email/ID variable for reference
//     const emailVar = allVariables.find(
//       (v) =>
//         v.name.toLowerCase().includes("email") ||
//         v.name.toLowerCase().includes("id") ||
//         v.label.toLowerCase().includes("email") ||
//         v.label.toLowerCase().includes("id")
//     );

//     for (let i = 0; i < sampleSize; i++) {
//       const row = {
//         key: i,
//       };
//       console.log("All varaibles are: ", allVariables);
//       // Add values for each variable
//       allVariables.forEach((variable) => {
//         if (variable.type === "Array") {
//           row[variable.name] = Math.floor(Math.random() * 100);
//         } else if (variable.type === "Number") {
//           row[variable.name] = 10;
//         } else if (variable.name.toLowerCase().includes("email")) {
//           row[variable.name] = `employee${i + 1}@company.com`;
//         } else if (variable.name.toLowerCase().includes("salary")) {
//           row[variable.name] = Math.floor(Math.random() * 50000) + 50000;
//         } else if (
//           variable.name.toLowerCase().includes("rating") ||
//           variable.name.toLowerCase().includes("performance")
//         ) {
//           row[variable.name] = (Math.random() * 4 + 1).toFixed(1);
//         } else if (variable.name.toLowerCase().includes("experience")) {
//           row[variable.name] = Math.floor(Math.random() * 10) + 1;
//         } else {
//           row[variable.name] = Math.floor(Math.random() * 100);
//         }
//       });

//       // Add reference
//       if (emailVar) {
//         row.reference = row[emailVar.name] || `employee${i + 1}@company.com`;
//       } else {
//         row.reference = `employee${i + 1}@company.com`;
//       }

//       sampleData.push(row);
//     }

//     setPreviewData(sampleData);
//   }, [inputVariables, customVariables]);

//   // Run calculation based on formula
//   const runCalculation = () => {
//     try {
//       setErrorMessage("");
//       const allVariables = [...inputVariables, ...customVariables];

//       // Validate the formula for safety
//       validateFormula(formula, allVariables);

//       // Calculate results for each sample data row
//       const calculatedResults = previewData.map((row) => {
//         // Create a context with variable values from this row
//         const context = {};
//         allVariables.forEach((variable) => {
//           context[variable.name] = row[variable.name];
//         });

//         // Evaluate the formula with this context
//         const result = evaluateFormula(formula, context);

//         return {
//           reference: row.reference,
//           calculatedValue: result,
//         };
//       });

//       setResults(calculatedResults);
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   };

//   // Validate formula for safety (prevent code injection)
//   const validateFormula = (formula, variables) => {
//     // Check if formula is empty
//     if (!formula.trim()) {
//       throw new Error("Formula cannot be empty");
//     }

//     // Check for potentially dangerous functions
//     const dangerousTerms = [
//       "eval",
//       "Function",
//       "setTimeout",
//       "setInterval",
//       "fetch",
//       "import",
//       "require",
//     ];
//     if (dangerousTerms.some((term) => formula.includes(term))) {
//       throw new Error("Formula contains prohibited functions");
//     }

//     // Check if formula only uses defined variables
//     const variableNames = variables.map((v) => v.name);
//     const usedVariables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

//     // Filter out common math functions and constants
//     const mathFunctions = [
//       "Math",
//       "abs",
//       "max",
//       "min",
//       "round",
//       "ceil",
//       "floor",
//       "sqrt",
//       "pow",
//       "exp",
//       "log",
//       "sin",
//       "cos",
//       "tan",
//     ];
//     const undefinedVariables = usedVariables.filter(
//       (v) =>
//         !variableNames.includes(v) && !mathFunctions.includes(v) && v !== "Math"
//     );

//     if (undefinedVariables.length > 0) {
//       throw new Error(
//         `Formula uses undefined variables: ${undefinedVariables.join(", ")}`
//       );
//     }
//   };

//   // Safely evaluate formula
//   const evaluateFormula = (formula, context) => {
//     // Create a function with the formula
//     try {
//       const variables = Object.keys(context);
//       const values = Object.values(context);

//       // Create a function with the variables as parameters
//       const func = new Function(...variables, `return ${formula}`);

//       // Call the function with the variable values
//       return func(...values);
//     } catch (error) {
//       throw new Error(`Error in formula: ${error.message}`);
//     }
//   };

//   // Helper to get all available variables for formula building
//   const getAllVariables = () => {
//     return [...inputVariables, ...customVariables];
//   };

//   return (
//     <div className="w-[42vw]">
//       <CustomHandle
//         type="target"
//         position={Position.Top}
//         tooltipText="Drag to connect as a target!"
//       />
//       <HeaderDesignCard
//         gradientColors={["#00000000", "#EA61F6", "#FF29EA"]}
//         iconSrc={BasicCardsIcon}
//         initialHeader="Basic Card"
//         titleText="Calculator Card"
//         helperText="Calculate new employee salaries based on performance, experience and other factors."
//         infoButtonText="Learn more about calculations"
//         primaryTextColor="#8C077F"
//         titleTextColor="#770679"
//       />
//       <Card className="bg-pink-100 border border-pink-300 rounded-xl shadow-md p-4">
//         <div className="flex items-center gap-2 text-lg font-semibold text-pink-900 mb-4">
//           <CalculatorOutlined className="text-xl" />
//           <span>Salary Calculator</span>
//         </div>

//         <div className="space-y-6">
//           {/* Connected Inputs Section */}
//           <div>
//             <Title level={5} className="mb-2 text-pink-800">
//               Connected Inputs
//             </Title>
//             {inputVariables.length > 0 ? (
//               <div className="space-y-3">
//                 {inputVariables.map((variable) => (
//                   <div
//                     key={variable.id}
//                     className="flex items-center space-x-2"
//                   >
//                     <Input
//                       addonBefore={variable.label}
//                       placeholder="Variable Name"
//                       value={variable.name}
//                       onChange={(e) =>
//                         updateVariable(
//                           variable.id,
//                           "name",
//                           e.target.value,
//                           false
//                         )
//                       }
//                       className="flex-1"
//                     />
//                     <Select
//                       value={variable.type}
//                       onChange={(value) =>
//                         updateVariable(variable.id, "type", value, false)
//                       }
//                       className="nodrag"
//                       style={{ width: 100 }}
//                     >
//                       <Option value="Number">Number</Option>
//                       <Option value="Array">Array</Option>
//                       <Option value="String">String</Option>
//                     </Select>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Text className="text-gray-500">
//                 No inputs connected. Connect edges to this node to get input
//                 variables.
//               </Text>
//             )}
//           </div>

//           {/* Custom Variables Section */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <Title level={5} className="m-0 text-pink-800">
//                 Custom Variables
//               </Title>
//               <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={addCustomVariable}
//                 className="bg-pink-600 hover:bg-pink-700"
//               >
//                 Add Variable
//               </Button>
//             </div>

//             {customVariables.length > 0 ? (
//               <div className="space-y-3">
//                 {customVariables.map((variable) => (
//                   <div
//                     key={variable.id}
//                     className="flex items-center space-x-2"
//                   >
//                     <Input
//                       placeholder="Label"
//                       value={variable.label}
//                       onChange={(e) =>
//                         updateVariable(
//                           variable.id,
//                           "label",
//                           e.target.value,
//                           true
//                         )
//                       }
//                       style={{ width: 100 }}
//                     />
//                     <Input
//                       placeholder="Variable Name"
//                       value={variable.name}
//                       onChange={(e) =>
//                         updateVariable(
//                           variable.id,
//                           "name",
//                           e.target.value,
//                           true
//                         )
//                       }
//                       style={{ width: 100 }}
//                       className="flex-1"
//                     />
//                     <Select
//                       value={variable.type}
//                       onChange={(value) =>
//                         updateVariable(variable.id, "type", value, true)
//                       }
//                       className="nodrag"
//                       style={{ width: 100 }}
//                     >
//                       <Option value="Number">Number</Option>
//                       <Option value="Array">Array</Option>
//                       <Option value="String">String</Option>
//                     </Select>
//                     <InputNumber
//                       value={variable.value}
//                       onChange={(value) =>
//                         updateVariable(variable.id, "value", value, true)
//                       }
//                       style={{ width: 100 }}
//                     />
//                     <Button
//                       danger
//                       icon={<DeleteOutlined />}
//                       onClick={() => removeCustomVariable(variable.id)}
//                     />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Text className="text-gray-500">
//                 No custom variables added yet.
//               </Text>
//             )}
//           </div>

//           {/* Formula Builder Section */}
//           <div>
//             <Title level={5} className="mb-2 text-pink-800">
//               Formula Builder
//             </Title>
//             <div className="mb-3">
//               <Text className="text-gray-700 block mb-1">
//                 Available Variables:
//               </Text>
//               <div className="flex flex-wrap gap-2">
//                 {getAllVariables().map((variable) => (
//                   <Tooltip
//                     key={variable.id}
//                     title={`${variable.label} (${variable.type})`}
//                   >
//                     <Button
//                       size="small"
//                       onClick={() =>
//                         setFormula((prev) => `${prev} ${variable.name}`)
//                       }
//                       className="bg-pink-50 text-pink-800 border-pink-300"
//                     >
//                       {variable.name}
//                     </Button>
//                   </Tooltip>
//                 ))}
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} +`)}
//                 >
//                   +
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} -`)}
//                 >
//                   -
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} *`)}
//                 >
//                   *
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} /`)}
//                 >
//                   /
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} Math.max(,)`)}
//                 >
//                   max()
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} Math.min(,)`)}
//                 >
//                   min()
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} (`)}
//                 >
//                   ({" "}
//                 </Button>
//                 <Button
//                   size="small"
//                   onClick={() => setFormula((prev) => `${prev} )`)}
//                 >
//                   )
//                 </Button>
//               </div>
//             </div>
//             <div>
//               <Text className="text-gray-700 block mb-1">Formula:</Text>
//               <div className="flex mb-2">
//                 <Input
//                   value={formula}
//                   onChange={(e) => setFormula(e.target.value)}
//                   placeholder="e.g. currentSalary * (1 + (performanceRating * maxHike / 5) / 100)"
//                   className="flex-1"
//                   addonBefore={<CalculatorOutlined />}
//                 />
//               </div>
//               {errorMessage && (
//                 <Text type="danger" className="block mb-2">
//                   {errorMessage}
//                 </Text>
//               )}
//               <Button
//                 type="primary"
//                 onClick={runCalculation}
//                 className="bg-pink-600 hover:bg-pink-700 mb-4"
//               >
//                 Calculate
//               </Button>
//             </div>
//           </div>

//           {/* Preview Section */}
//           <div>
//             <Title level={5} className="mb-2 text-pink-800">
//               Random Data to check the Calucation
//             </Title>
//             <div className="overflow-x-auto">
//               <Table
//                 dataSource={previewData}
//                 size="small"
//                 pagination={true}
//                 scroll={{ x: "max-content" }}
//                 columns={[
//                   {
//                     title: "Reference",
//                     dataIndex: "reference",
//                     key: "reference",
//                   },
//                   ...getAllVariables().map((variable) => ({
//                     title: variable.name,
//                     dataIndex: variable.name,
//                     key: variable.name,
//                   })),
//                 ]}
//                 className="mb-4"
//               />
//             </div>
//           </div>

//           {/* Results Section */}
//           {results.length > 0 && (
//             <div>
//               <Title level={5} className="mb-2 text-pink-800">
//                 Calculation Results
//               </Title>
//               <Table
//                 dataSource={results.map((result, index) => ({
//                   key: index,
//                   ...result,
//                 }))}
//                 columns={[
//                   {
//                     title: "Employee",
//                     dataIndex: "reference",
//                     key: "reference",
//                   },
//                   {
//                     title: "New Salary",
//                     dataIndex: "calculatedValue",
//                     key: "calculatedValue",
//                     render: (value) =>
//                       typeof value === "number" ? value.toFixed(2) : value,
//                   },
//                 ]}
//                 pagination={false}
//                 size="small"
//               />
//             </div>
//           )}
//         </div>
//       </Card>
//       <CustomHandle
//         type="source"
//         position={Position.Bottom}
//         tooltipText="Drag to connect as a source!"
//       />
//     </div>
//   );
// }
