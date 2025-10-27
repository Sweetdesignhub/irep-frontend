
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  version,
} from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MiniMap,
} from "@xyflow/react";
import { useParams } from "react-router-dom";
import "@xyflow/react/dist/style.css";
import {
  Button,
  Select,
  Dropdown,
  Menu,
  Spin,
  Modal,
  message,
  Input,
  Card,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { DbConfigProvider } from "../../../contexts/DbConfigContext";
import { useDispatch } from "react-redux";
import { setNodes, setEdges } from "../../../redux/nodesEdges/storeNodesEdges";
import {
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useDnD } from "../../../contexts/DnDContext";
import Sidebar from "../Sidebar/Sidebar";
import { nodeTypes } from "./nodeTypes"; // <-- Import nodeTypes
import SaveRuleVersion from "../../modals/SaveRuleVersion";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs"; // To write the .js file
import CustomEdge from "../../../ui/CustomEdge/CustomEdge";
import SidebarNew from "../Sidebar/Sidebar-New";
import { getRuleByOrgId } from "../../../services/rule.services";

const { Text } = Typography;

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes = [];
let id = 0;
const getId = () => `dndnode_${uuidv4()}`;

function RuleDesignerReactFlow({
  saveRuleVersion,
  initialFlowData,
  handleRuleSaveClick,
  versions,
  updateRuleVersion,
}) {
  const reactFlowWrapper = useRef(null);
  // const { isSourceConfigured } = useContext(DbConfigContext);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isEdgeModalVisible, setEdgeIsModalVisible] = useState(false);
  const [edgeParams, setEdgeParams] = useState(null);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("black");
  const [dataType, setDataType] = useState("");

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await getRuleByOrgId("1");
      const rulesFound = response?.data?.rules || [];
      const formattedRules = rulesFound.map((rule) => ({
        ...rule,
        createdAt: new Date(rule.createdAt).toLocaleDateString(),
      }));
      setRules(formattedRules);
      console.log("Rules found are: ", rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      message.error("Failed to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);
  const handleImportRule = async (key) => {
    console.log("Rules are: ", rules);
    console.log("My key: ", key);
    const selectedRule = rules.find((rule) => rule.id === parseInt(key));
    if (!selectedRule) {
      console.error("Selected rule not found.");
      return;
    }
    console.log("Selected Rule is: ", selectedRule.data);

    // Extract new nodes and edges
    const { nodes: newNodes, edges: newEdges } = selectedRule.data;

    if (!newNodes || !newEdges) {
      console.error("Invalid rule data: missing nodes or edges.");
      return;
    }
    // Shift each new node's position by +1000 on x and y
    const shiftedNodes = newNodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x + 4000,
        y: node.position.y + 2000,
      },
    }));
    // Show confirmation modal
    Modal.confirm({
      title: "Confirm Addition",
      content: "Are you sure you want to add these nodes and edges?",
      onOk: () => {
        setNodes((prevNodes) => [...prevNodes, ...shiftedNodes]);
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
        console.log("Nodes and edges added.");
      },
      onCancel: () => {
        console.log("Addition canceled.");
      },
      okText: "Yes",
      cancelText: "No",
    });
  };

  // Sync nodes with localStorage
  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    // console.log("Nodes saved to localStorage:", nodes);
  }, [nodes]);

  // Sync edges with localStorage
  useEffect(() => {
    localStorage.setItem("edges", JSON.stringify(edges));
    console.log("Edges saved to localStorage:", edges);
  }, [edges]);

  const { setViewport, viewport } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  // const { isDarkMode } = useContext(ThemeContext);
  // const [isSourceConfigured, setIsSourceConfigured] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleButton = () => {
    setIsOpen(!isOpen);
  };
  const handleOpenModal = () => {
    console.log("click 1");
    setIsModalVisible(!isModalVisible);
  };

  const saveNodeDataToLocalStorage = (nodes) => {
    // Create a map to hold the flow types and their corresponding nodes
    const flowData = {};

    // Iterate over each node to classify them by flowType
    nodes.forEach((node) => {
      // Use the 'type' of the node as the flowType
      const flowType = node.flowType;

      // If flowType is not already a key in flowData, create it
      if (!flowData[flowType]) {
        flowData[flowType] = []; // Initialize an empty array for this flowType
      }

      // Create the nodeData object as you did before
      const nodeData = {
        type: node.type,
        inputField: node.data.inputField, // The actual fields in the node
      };

      // Push the nodeData into the corresponding flowType array
      flowData[flowType].push(nodeData);
    });

    // Convert the flowData object into a JSON string
    const flowDataJSON = JSON.stringify(flowData);

    // Save the JSON string into localStorage under the key 'FlowInputFields'

    localStorage.setItem("FlowInputFields", flowDataJSON);
  };

  useEffect(() => {
    const flowData = {
      nodes,
      edges,
      viewport: { x: viewport?.x, y: viewport?.y, zoom: viewport?.zoom },
    };
    // console.log("nodes -->", nodes);
    saveNodeDataToLocalStorage(nodes);
    localStorage.setItem("reactFlowState", JSON.stringify(flowData));
  }, [nodes, edges, viewport, initialFlowData]);

  useEffect(() => {
    console.log("initialFlowData : ", initialFlowData);
    if (initialFlowData) {
      console.log("-->", initialFlowData.nodes);
      console.log("-->", initialFlowData.edges);
      setNodes(initialFlowData.nodes || []);
      setEdges(initialFlowData.edges || []);
      if (initialFlowData.viewport) {
        setViewport(initialFlowData.viewport);
      }
    }
  }, [initialFlowData]);

  useEffect(() => {
    // console.log("-----------render---------------");
    // console.log("versions -> ", versions);
    if (versions.length > 0) {
      // Sort versions to get the latest one
      const latestVersion = versions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      setSelectedVersion(latestVersion.id);
      // changeFlowByVersion(latestVersion.id); // Load the flow for the latest version
    }
  }, [versions]);

  const changeFlowByVersion = (selectedVersionId) => {
    // console.log("-----------changeFlowByVersion---------------");
    setSelectedVersion(selectedVersionId);
    // console.log("versions -> ", versions);
    const version = versions.find(
      (version) => version.id === selectedVersionId
    );

    // console.log("version : ", version);
    const flowDataByVersion = version.data;
    // console.log("flowDataByVersion", flowDataByVersion);
    // console.log("flowDataByVersion data", flowDataByVersion?.data);

    if (flowDataByVersion) {
      console.log("-->", flowDataByVersion?.data?.nodes);
      console.log("-->", flowDataByVersion?.data?.edges);
      setNodes(flowDataByVersion.nodes || []);
      setEdges(flowDataByVersion.edges || []);
      if (flowDataByVersion?.data?.viewport) {
        setViewport(flowDataByVersion?.data?.viewport);
      }
    }
  };

  const handleUpdateVersion = () => {
    if (selectedVersion) {
      updateRuleVersion(selectedVersion); // Pass the selected version ID when updating
    } else {
      // Handle case when no version is selected
      message.error("No version selected");
      console.log("No version selected");
    }
  };
  const { rid } = useParams();
  // console.log("Fetched Rule ID:", rid);

  const handleSaveRuleWhenVersion = async () => {
    // console.log("hie");

    function generateNestedFlow(savedNodes, savedEdges) {
      if (!savedNodes || !savedEdges) {
        console.error("Invalid savedNodes or savedEdges.");
        return null;
      }

      // Find all root nodes (nodes with no incoming edges)
      const findRootNodes = () => {
        const targetNodeIds = new Set(savedEdges.map((edge) => edge.target));
        return savedNodes.filter((node) => !targetNodeIds.has(node.id));
      };

      // Create a map of nodes for efficient lookup
      const nodeMap = new Map(savedNodes.map((node) => [node.id, node]));

      // Recursive function to build flow for a single node
      const buildNodeFlow = (currentNodeId, visitedNodes = new Set()) => {
        // Prevent infinite recursion
        if (visitedNodes.has(currentNodeId)) {
          console.warn(`Circular reference detected for node ${currentNodeId}`);
          return null;
        }

        const currentNode = nodeMap.get(currentNodeId);
        if (!currentNode) return null;

        // Add current node to visited nodes
        const newVisitedNodes = new Set(visitedNodes);
        newVisitedNodes.add(currentNodeId);

        // Find edges from current node
        const edgesFromNode = savedEdges.filter(
          (edge) => edge.source === currentNodeId
        );

        // Construct node flow object
        const nodeFlow = {
          id: currentNode.id,
          data: currentNode.data,
          type:
            currentNode.data.dropDownValue ||
            currentNode.data.type ||
            "OUTPUT_NODE",
          question: currentNode.data.inputValue || "",
          options: [],
        };
        // Build options with recursive next nodes
        nodeFlow.options = edgesFromNode.map((edge) => ({
          label: edge.label || "Next",
          next: buildNodeFlow(edge.target, newVisitedNodes),
        }));

        return nodeFlow;
      };

      // Handle multiple root nodes
      const rootNodes = findRootNodes();

      if (rootNodes.length === 0) {
        console.error("No root nodes found.");
        return null;
      }

      // If multiple root nodes, create a wrapper flow
      const nestedFlow =
        rootNodes.length === 1
          ? buildNodeFlow(rootNodes[0].id)
          : {
              id: "root",
              type: "ROOT",
              options: rootNodes.map((rootNode) => ({
                label: `Start from ${rootNode.id}`,
                next: buildNodeFlow(rootNode.id),
              })),
            };

      // Convert nested flow into a downloadable file
      const jsContent = `
        // Auto-generated nested flow based on React Flow nodes and edges
        export const flow = ${JSON.stringify(nestedFlow, null, 2)};
      `;

      // File download logic
//      const blob = new Blob([jsContent], { type: "application/javascript" });
//      const url = URL.createObjectURL(blob);
//      const a = document.createElement("a");
//      a.href = url;
//      a.download = `nested_flow_${new Date().toISOString()}.js`;
//      document.body.appendChild(a);
//      a.click();
//      document.body.removeChild(a);

      console.log("Nested flow file downloaded!");
      console.log(jsContent);

      // Backend save logic (assuming axios is imported)
      try {
        const host =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
        const response = axios.post(`${host}/rules/engine-rule/${rid}`, {
          name: `nested_flow_${new Date().toISOString()}.js`,
          content: jsContent,
        });

        console.log("File saved to backend:", response);
      } catch (error) {
        console.error("Error saving file to backend:", error);
      }

      return nestedFlow;
    }

    // Old Implementaton works for GTIN EVAL
    // function generateNestedFlow(savedNodes, savedEdges) {
    //   if (!savedNodes || !savedEdges) {
    //     console.error("Invalid savedNodes or savedEdges.");
    //     return;
    //   }

    //   const findRootNode = () => {
    //     const targetNodeIds = new Set(savedEdges.map((edge) => edge.target));
    //     return savedNodes.find((node) => !targetNodeIds.has(node.id));
    //   };

    //   const rootNode = findRootNode();
    //   if (!rootNode) {
    //     console.error("No root node found.");
    //     return;
    //   }

    //   const buildFlow = (currentNodeId) => {
    //     const currentNode = savedNodes.find(
    //       (node) => node.id === currentNodeId
    //     );
    //     if (!currentNode) return null;

    //     // console.log("Current Node: ", currentNode);

    //     const edgesFromNode = savedEdges.filter(
    //       (edge) => edge.source === currentNodeId
    //     );
    //     // console.log("Current Node is: ", currentNode.data);
    //     const nodeFlow = {
    //       id: currentNode.id,
    //       data: currentNode.data,
    //       type:
    //         currentNode.data.dropDownValue ||
    //         currentNode.data.type ||
    //         "OUTPUT_NODE",
    //       question: currentNode.data.inputValue || "",
    //       options: [],
    //     };

    //     edgesFromNode.forEach((edge) => {
    //       const nextNodeId = edge.target;
    //       const edgeLabel = edge.label || "Next";

    //       nodeFlow.options.push({
    //         label: edgeLabel,
    //         next: buildFlow(nextNodeId),
    //       });
    //     });

    //     return nodeFlow;
    //   };

    //   const nestedFlow = buildFlow(rootNode.id);

    //   // Convert nested flow into a downloadable file
    //   const jsContent = `
    //     // Auto-generated nested flow based on React Flow nodes and edges
    //     export const flow = ${JSON.stringify(nestedFlow, null, 2)};
    //   `;

    //   const blob = new Blob([jsContent], { type: "application/javascript" });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `nested_flow_${new Date().toISOString()}.js`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);

    //   console.log("Nested flow file downloaded!");
    //   console.log(jsContent);
    //   try {
    //     const host =
    //       import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
    //     const response = axios.post(`${host}/rules/engine-rule/${rid}`, {
    //       name: `nested_flow_${new Date().toISOString()}.js`,
    //       content: jsContent,
    //     });

    //     console.log("File saved to backend:", response);
    //   } catch (error) {
    //     console.error("Error saving file to backend:", error);
    //   }
    // }

    // Example usage
    const savedNodes = JSON.parse(localStorage.getItem("nodes"));
    const savedEdges = JSON.parse(localStorage.getItem("edges"));
    generateNestedFlow(savedNodes, savedEdges);

    // console.log("Saved Nodes:", savedNodes);
    // console.log("Saved Edges:", savedEdges);

    if (versions.length > 0) {
      message.info("You need to update the version");
    } else {
      const payload = {
        ruleId: parseInt(rid), // Get ruleId from URL
        nodes: savedNodes, // Pass the saved nodes
        edges: savedEdges, // Pass the saved edges
      };
      console.log("Payload is: ", payload);

      try {
        const host =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
        const response = await axios.post(
          `${host}/rules/createNodesAndEdges`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          console.log("Nodes and Edges Created/Updated:", response.data);
        } else {
          console.error("Error creating nodes and edges:", response.statusText);
        }
      } catch (error) {
        console.error("Error in request:", error);
      }

      handleRuleSaveClick();
    }
  };
  // const newEdge = {
  //   id: `edge+${id}+${newNodeId}`,
  //   source: id,
  //   target: newNodeId,
  //   type: "custom",
  //   animated: true,
  //   label: input, // Label the edge with the input
  // };

  const handleOk = () => {
    if (!edgeParams) return;

    const uniqueEdgeName = `edge-${uuidv4()}`;

    setEdges((eds) =>
      addEdge(
        {
          ...edgeParams,
          label: label || "Default Label",
          animated: true,
          type: "custom",
          style: { stroke: color },
          data: {
            uniqueName: uniqueEdgeName,
            color,
            dataType,
          },
        },
        eds
      )
    );

    setEdgeIsModalVisible(false);
    setLabel("");
    setColor("black");
    setDataType("");
  };

  const handleCancel = () => {
    setEdgeIsModalVisible(false);
  };

  const onConnect = useCallback(
    (params) => {
      setEdgeParams(params);
      setEdgeIsModalVisible(true);
    },
    [setEdges]
  );
  // const onConnect = useCallback(
  //   (params) => {
  //     const label = prompt("Enter label for the edge:");
  //     setEdges((eds) =>
  //       addEdge(
  //         {
  //           ...params,
  //           label: label || "Default Label",
  //           animated: true,
  //           type: "custom",
  //         }, // Add the label to the edge
  //         eds
  //       )
  //     );
  //   },
  //   [setEdges]
  // );

  // Handle label editing on double-click
  const onEdgeDoubleClick = (event, edge) => {
    event.stopPropagation(); // Prevent default double-click zoom behavior
    const newLabel = prompt("Edit label for the edge:", edge.label);
    if (newLabel !== null) {
      setEdges((eds) =>
        eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e))
      );
    }
  };

  // const onConnect = useCallback(
  //   (params) => {
  //     setEdges((eds) => addEdge(params, eds));
  //   },
  //   [setEdges]
  // );

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleSaveRuleClick = () => {
    setIsSaveModalVisible(true);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");

      if (!data) {
        return;
      }

      const parsedData = JSON.parse(data);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      console.log("parseData : ", parsedData);

      if (parsedData.contentName === "Source Card") {
        console.log("Source card");
        setNodes((nds) =>
          nds.concat({
            id: `${parsedData.contentName.replace(" ", "")}_${getId()}`,
            type: parsedData.contentName,
            flowType: parsedData.type,
            position: position,
            data: {
              id: `${parsedData.contentName.replace(" ", "")}_${getId()}`,
              ...parsedData,
              // onDatabaseConfigured: onDatabaseConfigured,
              position,
            },
          })
        );
      } else {
        setNodes((nds) =>
          nds.concat({
            id: `${parsedData.contentName.replace(" ", "")}_${getId()}`,
            type: parsedData.contentName,
            flowType: parsedData.type,
            position: position,
            data: {
              id: `${parsedData.contentName.replace(" ", "")}_${getId()}`,
              ...parsedData,
              position,
            },
          })
        );
      }
    },
    [screenToFlowPosition, type]
  );
  const onLoad = useCallback(() => {
    // Set the initial viewport (x, y, zoom) when ReactFlow instance loads
    if (initialFlowData.viewport) {
      const { x, y, zoom } = initialFlowData.viewport;
      setViewport({ x, y, zoom });
    }
  }, [initialFlowData, setViewport]);

  return (
    <DbConfigProvider>
      <div className="h-full px-4 py-2">
        <div ref={reactFlowWrapper} style={{ width: "100%", height: "87vh" }}>
          <ReactFlow
            // colorMode={isDarkMode ? "dark" : "light"}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onLoad={onLoad}
            onEdgeDoubleClick={onEdgeDoubleClick}
            fitView
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
          >
            <Controls
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md p-2 rounded-lg border border-gray-200"
              style={{ color: "black" }}
              orientation="horizontal"
              position="bottom-center"
            />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />

            <div className=" flex justify-between p-3">
              <div>
                {/* <h1>Hidvkds</h1> */}
                {isModalVisible}
                <Button
                  className={`rounded-full  nodrag ${isOpen ? "open" : ""}`}
                  icon={
                    isModalVisible ? (
                      <CloseOutlined style={{ color: "#FFFFFF" }} />
                    ) : (
                      <PlusOutlined style={{ color: "#FFFFFF" }} />
                    )
                  }
                  type="dashed"
                  shape="circle"
                  // onClick={toggleButton}
                  onClick={handleOpenModal}
                  style={{
                    background: "#FB29FF",
                    border: "1px solid #FFFFFF",
                    width: "50px", // Increase size
                    height: "50px", // Increase size
                    boxShadow: "0px 8px 17px 0px #F513FA73",
                    zIndex: 999,
                  }}
                />
              </div>
              <div>
                {versions.length > 0 && (
                  <Select
                    placeholder="Select Version"
                    style={{ width: 200, marginRight: 8, zIndex: 999 }}
                    defaultValue={
                      versions.length > 0
                        ? versions.sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )[0].id
                        : "Latest"
                    }
                    onChange={(value) => changeFlowByVersion(value)} // Handle change and pass the version id
                  >
                    {versions.map((version) => (
                      <Select.Option key={version.id} value={version.id}>
                        {version.versionName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {rules.length > 0 && (
                  <Select
                    placeholder="Select Rule To Import"
                    style={{ width: 200, marginRight: 8, zIndex: 999 }}
                    onChange={(value) => {
                      handleImportRule(value);
                    }}
                  >
                    {rules.map((rule) => (
                      <Select.Option key={rule.id} value={rule.id}>
                        {rule.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}

                <Button
                  className="mx-2"
                  icon={<SaveOutlined />}
                  shape="round"
                  type="primary"
                  onClick={handleSaveRuleClick}
                  style={{ zIndex: 999 }}
                  size="large"
                >
                  Save Rule
                </Button>

                {versions.length > 0 && (
                  <Button
                    className="mx-2"
                    icon={<SaveOutlined />}
                    shape="round"
                    type="primary"
                    onClick={handleUpdateVersion}
                    style={{ zIndex: 999 }}
                    size="large"
                  >
                    Update Version
                  </Button>
                )}
                <Link to="/rule-management">
                  <Button
                    className="mx-2 bg-[#EB1700] hover:opacity-95"
                    danger
                    icon={<CloseOutlined />}
                    shape="round"
                    type="primary"
                    size="large"
                    style={{ zIndex: 999 }}
                  >
                    Close
                  </Button>
                </Link>
              </div>
            </div>

            <Modal
              title="Customize Edge"
              open={isEdgeModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div>
                <label className="block text-gray-700">Label:</label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter edge label"
                />
              </div>

              <div className="mt-3">
                <label className="block text-gray-700">Select Color:</label>
                <Select
                  value={color}
                  onChange={setColor}
                  style={{ width: "100%" }}
                >
                  <Option value="black">Black</Option>
                  <Option value="red">Red</Option>
                  <Option value="blue">Blue</Option>
                  <Option value="green">Green</Option>
                </Select>
              </div>

              <div className="mt-3">
                <label className="block text-gray-700">Data Type:</label>
                <Input
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  placeholder="Enter data type"
                />
              </div>
            </Modal>

            {isModalVisible && (
              <Sidebar visible={isModalVisible} onClose={handleCloseModal} />
            )}
          </ReactFlow>
        </div>
        {/* <SidebarNew /> */}
        <SaveRuleVersion
          isSaveModalVisible={isSaveModalVisible}
          setIsSaveModalVisible={setIsSaveModalVisible}
          saveRule={handleSaveRuleWhenVersion}
          saveRuleVersion={saveRuleVersion}
        />
        {/* <DragDropCards visible={isModalVisible} onClose={handleCloseModal} /> */}
      </div>
    </DbConfigProvider>
  );
}

export default RuleDesignerReactFlow;
