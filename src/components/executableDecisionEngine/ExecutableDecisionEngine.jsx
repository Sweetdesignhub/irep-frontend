import React, { useState, useEffect, useRef } from "react";
import {
  ReactFlowProvider,
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from "@xyflow/react";
import DropDownNode from "./ExecutableCards/DropDownNode";
import MultiSelectNode from "./ExecutableCards/MultiSelectNode";
import OutputNode from "./ExecutableCards/OutputNode";
import "@xyflow/react/dist/style.css";
import UploadFileNode from "./ExecutableCards/UploadFileNode";
import CodeExpressionExecutable from "./ExecutableCards/CodeExpressionExecutable";
import GenerateFlowExecutable from "./ExecutableCards/GenerateFlowExecutable";
import EventNodeExecutable from "./ExecutableCards/EventNodeExecutable";
import TestFlowExecutable from "./ExecutableCards/TestFlowExecutable";
import AiExecutable from "./ExecutableCards/AiExecutable";
import { DecisionSummaryNode } from "./ExecutableCards/DecisionSummaryNode";
import { NextStepsNode } from "./ExecutableCards/NextStepsNode";
import CustomEdge from "../../ui/CustomEdge/CustomEdge";
import { WorkflowEngine } from "./workflowEngine"; // Make sure to import WorkflowEngine
import APIExecutable from "./ExecutableCards/ApiCardExecutable";
import DatabaseQueryExecutable from "./ExecutableCards/MainDataAccess/DatabaseQueryExecutable";
import NLPExecutable from "./ExecutableCards/NLP/NLPExecutable";
import CalculationExecutable from "./ExecutableCards/CalculationExecutable/CalculationExecutable";
import ReportExecutable from "./ExecutableCards/ReportExecutable/ReportExecutable";
import NotificationExecutable from "./ExecutableCards/NotificationExecutable/NotificationExecutable";
import TemplateExecutable from "./ExecutableCards/TemplateExecutable/TemplateExecutable";

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  ROOT: DropDownNode,
  DROP_DOWN: DropDownNode,
  SELECT_TYPES: MultiSelectNode,
  OUTPUT_NODE: OutputNode,
  UPLOAD_FILE: UploadFileNode,
  "Code Expression Card": CodeExpressionExecutable,
  EVENT_NODE: EventNodeExecutable,
  "Prediction Card": AiExecutable,
  "Api Card": APIExecutable,
  GENERATE_FLOW: GenerateFlowExecutable,
  TEST_FLOW: TestFlowExecutable,
  DECISION_SUMMARY: DecisionSummaryNode,
  NEXT_STEPS: NextStepsNode,
  "database-query": DatabaseQueryExecutable,
  "semantic-analysis": NLPExecutable,
  "Basic Calculation Card": CalculationExecutable,
  "Basic Report Card": ReportExecutable,
  "Notification Card": NotificationExecutable,
  "Basic Template Card": TemplateExecutable,
};

const ExecutableDecisionEngine = ({ flowData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const workflowEngineRef = useRef(null);

  useEffect(() => {
    // Initialize workflow engine with flowData
    workflowEngineRef.current = new WorkflowEngine(flowData);
    const initialNode = workflowEngineRef.current.initialize();
    setNodes([initialNode]);
  }, [flowData]);

  const handleAnswer = (selectedValue, isChecked = null) => {
    console.log("inside handle answer", { selectedValue, isChecked });
    const currentNode = nodes[nodes.length - 1];
    const { nodes: nextNodes, edges: newEdges } =
      workflowEngineRef.current.processResponse(
        currentNode.id,
        selectedValue,
        isChecked
      );

    if (nextNodes.length > 0) {
      setNodes((prevNodes) => [...prevNodes, ...nextNodes]);
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    }
  };

  const handleTest = (sourceNodeId) => {
    const { nodes: summaryNodes, edges: summaryEdges } =
      workflowEngineRef.current.generateSummaryNodes(sourceNodeId);

    setNodes((prevNodes) => [...prevNodes, ...summaryNodes]);
    setEdges((prevEdges) => [...prevEdges, ...summaryEdges]);
  };

  const handleFileProcessed = (outcome, nodeId) => {
    console.log(`File processed for node ${nodeId}, outcome: ${outcome}`);
    handleAnswer(outcome);
  };

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onAnswer: handleAnswer,
              onFileProcessed: handleFileProcessed,
              onTest: handleTest,
            },
          }))}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          style={{ border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <Controls style={{ color: "black" }} />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default ExecutableDecisionEngine;

// const ExecutableDecisionEngine = ({ flowData }) => {
//     const [nodes, setNodes, onNodesChange] = useNodesState([]);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//     const [responses, setResponses] = useState({}); // To track user responses

//     // const handleTest = () => {
//     //     const currentNode = nodes[nodes.length - 1]; // Get the last node in the flow
//     //     console.log("------------------------handle the Test: ", currentNode);

//     //     let nextNode = null;

//     //     if (currentNode.type === "GENERATE_FLOW") {
//     //         console.log("------------------------Position the Test: ", currentNode.position);

//     //         nextNode = {
//     //             id: `${uuidv4()}-test-flow`,
//     //             type: "TEST_FLOW", // Set the type to TEST_FLOW
//     //             position: { x: (currentNode.position.x + 1500), y: currentNode.position.y + 750 }, // Position the new node
//     //             data: {
//     //                 question: "Test Flow Node", // Add any relevant question or data
//     //                 onAnswer: () => console.log("Answered Test Flow Node"),
//     //                 data: {}, // Additional data for the TEST_FLOW node
//     //             },
//     //         };
//     //         console.log("------------------------Position the Test: ", nextNode.position);

//     //         // Add the new node to the nodes array
//     //         setNodes((prevNodes) => [...prevNodes, nextNode]);
//     //         console.log("-------next", nextNode);
//     //         // Create and add a new edge connecting current node to next node
//     //         setEdges((prevEdges) => [
//     //             ...prevEdges,
//     //             {
//     //                 id: `e${currentNode.id}-${nextNode.id}`,
//     //                 source: currentNode.id,
//     //                 target: nextNode.id,
//     //                 type: "custom", // Use custom edge type
//     //             },
//     //         ]);
//     //     } else {
//     //         console.log("Current node is not of type GENERATE_FLOW.");
//     //     }
//     // };
//     // const handleTest = (id) => {
//     //     const currentNode = nodes[nodes.length - 1];

//     //     console.log("Node is: ", nodes);
//     //     console.log("-----------======Node ID: ", id);
//     //     const nextNode = {
//     //         id: `${uuidv4()}-test-flow`,
//     //         type: "TEST_FLOW",
//     //         position: {
//     //             x: 1000, // Position it dynamically
//     //             y: 800,
//     //         },
//     //         data: {
//     //             question: "Test the flow with data or files:",
//     //             onAnswer: (answer) => console.log("Answered Test Flow:", answer),
//     //             data: {}, // Additional context for the TestFlowExecutable
//     //         },
//     //     };

//     //     setNodes((prevNodes) => [...prevNodes, nextNode]);
//     //     setEdges((prevEdges) => [
//     //         ...prevEdges,
//     //         {
//     //             id: `e${id}-${nextNode.id}`,
//     //             source: id,
//     //             target: nextNode.id,
//     //             type: "custom",
//     //         },
//     //     ]);
//     //     // if (currentNode.type === "GENERATE_FLOW") {
//     //     // } else {
//     //     //     console.log("Current node is not of type GENERATE_FLOWS.");
//     //     // }
//     // };

//     const handleTest = (id) => {
//         const currentNode = nodes[nodes.length - 1];

//         // Create Decision Summary Node
//         const decisionSummaryNode = {
//             id: `${uuidv4()}-decision-summary`,
//             type: "DECISION_SUMMARY",
//             position: {
//                 x: 1000,
//                 y: 800,
//             },
//             data: {
//                 // You can pass the collected responses here
//                 decisions: Object.entries(responses).map(([question, answer]) => ({
//                     question,
//                     answer
//                 }))
//             },
//         };

//         // Create Next Steps Node
//         const nextStepsNode = {
//             id: `${uuidv4()}-next-steps`,
//             type: "NEXT_STEPS",
//             position: {
//                 x: 1000,
//                 y: 600,
//             },
//             data: {
//                 // You can customize these steps based on your flow
//                 steps: [
//                     'Download a Compliance Report.',
//                     'Notify stakeholders directly.',
//                     'Align inventory and production schedules.'
//                 ]
//             },
//         };

//         // Create Test Flow Node
//         const testFlowNode = {
//             id: `${uuidv4()}-test-flow`,
//             type: "TEST_FLOW",
//             position: {
//                 x: 1000,
//                 y: 400,
//             },
//             data: {
//                 question: "Test the flow with data or files:",
//                 onAnswer: (answer) => console.log("Answered Test Flow:", answer),
//                 data: {},
//             },
//         };

//         // Add all new nodes
//         setNodes((prevNodes) => [
//             ...prevNodes,
//             decisionSummaryNode,
//             nextStepsNode,
//             testFlowNode
//         ]);

//         // Add edges connecting the nodes
//         setEdges((prevEdges) => [
//             ...prevEdges,
//             {
//                 id: `e${id}-${testFlowNode.id}`,
//                 source: id,
//                 target: testFlowNode.id,
//                 type: "custom",
//             },
//             {
//                 id: `e${testFlowNode.id}-${nextStepsNode.id}`,
//                 source: testFlowNode.id,
//                 target: nextStepsNode.id,
//                 type: "custom",
//             },
//             {
//                 id: `e${nextStepsNode.id}-${decisionSummaryNode.id}`,
//                 source: nextStepsNode.id,
//                 target: decisionSummaryNode.id,
//                 type: "custom",
//             },
//         ]);
//     };
//     // const handleAnswer = (selectedValue, isChecked = null) => {
//     //     let nextNode = null;
//     //     const currentNode = nodes[nodes.length - 1]; // Get the last node in the flow

//     //     console.log("Selected Value is: ", selectedValue);
//     //     if (isChecked !== null) {
//     //         // Handle multi-select responses
//     //         const selectedOptions = isChecked
//     //             ? [...(responses[currentNode.id] || []), selectedValue]
//     //             : (responses[currentNode.id] || []).filter(option => option !== selectedValue);
//     //         setResponses((prev) => ({
//     //             ...prev,
//     //             [currentNode.question]: selectedOptions
//     //         }));
//     //         nextNode = currentNode.options.find(option => option.label === selectedValue)?.next;
//     //     } else {
//     //         // Handle single selection or file upload outcomes
//     //         setResponses((prev) => ({
//     //             ...prev,
//     //             [currentNode.question]: selectedValue
//     //         }));
//     //         // console.log("Responses are: ", responses);
//     //         nextNode = currentNode.options?.find(option => option.label === selectedValue)?.next;
//     //     }

//     //     if (nextNode && nextNode.id) {
//     //         setNodes((prevNodes) => [...prevNodes, nextNode]); // Add the new node to the list
//     //         console.log("Current Node: ", currentNode);
//     //         console.log("Next Node: ", nextNode.data);

//     //         setEdges((prevEdges) => [
//     //             ...prevEdges,
//     //             {
//     //                 id: `e${currentNode.id}-${nextNode.id}`,
//     //                 source: currentNode.id,
//     //                 target: nextNode.id,
//     //                 type: 'custom',
//     //             }
//     //         ]);
//     //     } else {
//     //         console.warn("Next node is missing or doesn't have an ID.");
//     //     }
//     // };

//     const handleAnswer = (selectedValue, isChecked = null) => {
//         let nextNode = null;
//         const currentNode = nodes[nodes.length - 1]; // Get the last node in the flow

//         console.log("Selected Value is: ", selectedValue);

//         // Handle multi-select or single selection
//         if (isChecked !== null) {
//             const selectedOptions = isChecked
//                 ? [...(responses[currentNode.id] || []), selectedValue]
//                 : (responses[currentNode.id] || []).filter(option => option !== selectedValue);
//             setResponses((prev) => ({
//                 ...prev,
//                 [currentNode.question]: selectedOptions,
//             }));
//             nextNode = currentNode.options.find(option => option.label === selectedValue)?.next;
//         } else {
//             setResponses((prev) => ({
//                 ...prev,
//                 [currentNode.question]: selectedValue,
//             }));
//             nextNode = currentNode.options?.find(option => option.label === selectedValue)?.next;

//             // Dynamically add "Generate Flow" node if conditions are met
//             if (currentNode.type === "EVENT_NODE" && currentNode.data.eventDropDownValue.includes("Generate Flow")) {
//                 nextNode = {
//                     id: `${currentNode.id}-generate-flow`,
//                     type: "GENERATE_FLOW",
//                     data: { question: "Generate Flow", data: {} },
//                     position: { x: 0, y: 250 * nodes.length },
//                 };
//                 // Add the new node along with the previous node if applicable
//                 setNodes((prevNodes) => [
//                     ...prevNodes,
//                     nextNode, // Add the "Generate Flow" node
//                 ]);
//             }
//         }

//         if (nextNode && nextNode.id) {
//             setNodes((prevNodes) => [...prevNodes, nextNode]); // Add the new node to the list
//             setEdges((prevEdges) => [
//                 ...prevEdges,
//                 {
//                     id: `e${currentNode.id}-${nextNode.id}`,
//                     source: currentNode.id,
//                     target: nextNode.id,
//                     type: "custom",
//                 },
//             ]);
//         } else {
//             console.warn("Next node is missing or doesn't have an ID.");
//         }
//     };

//     useEffect(() => {
//         console.log("Responses are: ", responses);
//     }, [responses])

//     const handleFileProcessed = (outcome, currentNodeId) => {
//         console.log(`File processed for node ${currentNodeId}, outcome: ${outcome}`);
//         handleAnswer(outcome); // Pass the outcome to handleAnswer to determine the next node
//     };

//     useEffect(() => {
//         setNodes([flowData]); // Start with the initial node
//     }, [flowData]);

//     return (
//         <div style={{ height: '70vh', width: '100%' }}>
//             <ReactFlowProvider>
//                 <ReactFlow
//                     nodes={nodes
//                         .flatMap((node, idx) => {
//                             // Base node structure
//                             const baseNode = {
//                                 id: node.id,
//                                 type: node.type,
//                                 position: { x: 0, y: 250 * idx }, // Stack nodes vertically
//                                 data: {
//                                     question: node.question,
//                                     data: node.data,
//                                     options: node.options,
//                                     onAnswer: handleAnswer,
//                                     onFileProcessed: (outcome) => handleFileProcessed(outcome, node.id), // Callback for file uploads
//                                 },
//                             };

//                             // Conditionally add the "Generate Flow" node if the type is EVENT_NODE
//                             if (node.type === "EVENT_NODE" && node.data.eventDropDownValue?.includes("Generate Flow")) {
//                                 const generateFlowNode = {
//                                     id: `${node.id}-generate-flow`,
//                                     type: "GENERATE_FLOW", // Custom node type
//                                     position: { x: 500, y: 150 * (idx + 1) }, // Adjust position dynamically
//                                     data: {
//                                         question: "Generate Flow",
//                                         onAnswer: handleTest,
//                                         data: {}, // Add any additional data for this node
//                                     },
//                                 };

//                                 // Return both the base node and the new "Generate Flow" node
//                                 return [baseNode, generateFlowNode];
//                             }

//                             // Return the base node if no conditions are met
//                             return baseNode;
//                         })}
//                     edges={edges}
//                     edgeTypes={edgeTypes}
//                     nodeTypes={nodeTypes}
//                     fitView
//                     style={{ border: '1px solid #ddd', borderRadius: '8px' }}
//                 >
//                     <Controls style={{ color: "black" }} />
//                     <MiniMap />
//                     <Background variant="dots" gap={12} size={1} />
//                 </ReactFlow>
//             </ReactFlowProvider>
//         </div>
//     );
// };

// export default ExecutableDecisionEngine;
