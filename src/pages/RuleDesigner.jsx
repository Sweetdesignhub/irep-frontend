
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addEdge, Position, ReactFlowProvider } from '@xyflow/react';
import { Button, Select, message } from "antd";
// import { v4 } from 'uuid';
// import { toast } from 'sonner';
// import axios from '../api/axios';
// import Cards, { getColors } from '../components/ruleDesigner/cards';
import RuleDesignerReactFlow from "../components/rule-designer/RuleDesignerReactFlow/RuleDesignerReactFlow"
// import AuthContext from '../contexts/AuthProvider';
import DesignerContext from '../contexts/DesignerProvider';
// import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { saveRule, getRuleByIndex, createNewVersionByRuleId, getAllVersionByRuleId, updateVersionByRuleId } from "../services/rulemanagement.services";

const findNodeById = (nodes, nodeId) => {
  return nodes.find((val) => val.id === nodeId);
};

function RuleDesigner() {
  const { rid } = useParams();
  const [nodesState, setNodesState] = useState([]);
  const [edgesState, setEdgesState] = useState([]);
  // {id:"1",name:"v1"}
  const [versions, setVersions] = useState([]);
  // const { auth, currOrg, curVer, setCurVer } = useContext(AuthContext);
  const [saveLoad, setSaveLoad] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    visible: false,
    nodeId: null,
    deleteType: null,
  });
  const [isRuleUpdated, setIsRuleUpdated] = useState(false);
  const [rule, setRule] = useState({
    title: "Rule Title",
    description: "",
    category: "",
    activation_date: null,
    executions: 0,
    status: "Active",
    flowData: {
      nodes: [],
      edges: [],
      viewport: {
        x: -1,
        y: 0,
        zoom: 1,
      },
    },
  });

  // const serializeFlow = (nodes, edges) => {
  //    //  console.log('🚀 -----------------🚀');
  //    //  console.log('🚀 ~ nodes:', nodes);
  //    //  console.log('🚀 -----------------🚀');

  //     var serializedNodes = nodes.map((val) => {
  //         const nodeData = {
  //             id: val.id,
  //             type: val.type,
  //             position: val.position,
  //             cardData: val.data.cardData,
  //             targets: [],
  //         };

  //         if (val.type === 'decisionCard') {
  //             nodeData.branches = val.data.cardData.branches;
  //             nodeData.colors = val.data.colors;
  //         }

  //         return nodeData;
  //     });

  //     edges.forEach((val) => {
  //         var node = serializedNodes.find((n) => n.id === val.source);
  //         if (node) {
  //             node.targets.push(val.target);
  //         }
  //     });
  //     setSaveLoad(true);
  //     // axios
  //     //     .put(
  //     //         `/rule/edit/${currOrg.id}/${rid}`,
  //     //         {
  //     //             data: JSON.stringify(serializedNodes),
  //     //         },
  //     //         {
  //     //             headers: {
  //     //                 Authorization: 'Bearer ' + auth.token,
  //     //             },
  //     //         }
  //     //     )
  //     //     .then((res) => {
  //     //         setSaveLoad(false);
  //     //         toast.success('Flow saved successfully');
  //     //     })
  //     //     .catch((err) => {
  //     //         setSaveLoad(false);
  //     //         toast.error('Error saving flow');
  //     //     });
  // };

  const updateRuleVersion = async (versionId) => {
    console.log('CALLING updateRuleVersion');

    // Retrieve the saved flow data from localStorage
    const savedFlowData = localStorage.getItem("reactFlowState");
    const savedFlowInputField = localStorage.getItem("FlowInputFields");

    //  console.log("savedFlowData -> ", savedFlowData);
    //  console.log("savedFlowInputField -> ", savedFlowInputField);

    if (savedFlowData && savedFlowInputField) {
      const parsedFlowData = JSON.parse(savedFlowData);
      const parsedFlowInputField = JSON.parse(savedFlowInputField);

      // Assuming `rule` is your state variable containing the previous data
      const prevRule = rule;  // If `rule` is available in your component

      // Merge the previous rule data with the new flow data and input fields
      const updatedRuleObj = {
        ...prevRule, // Spread the previous rule data
        flowData: parsedFlowData,
        flowInputField: parsedFlowInputField,
      };

      // Pass the updated object to saveRuleVersion
      await updateVersionByRuleId(versionId, updatedRuleObj);

      // Optionally, clear the localStorage data if needed
      localStorage.removeItem("reactFlowState");
      localStorage.removeItem("FlowInputFields");

      handleCallVersion();
      console.log("make the ruleupdate state");

    } else {
      message.error("Changes not made after Rule Save");
      return null; // No data found
    }

  };


  const saveRuleVersion = async () => {

    //  console.log("click2");

    // Retrieve the saved flow data from localStorage
    const savedFlowData = localStorage.getItem("reactFlowState");
    const savedFlowInputField = localStorage.getItem("FlowInputFields");

    //  console.log("click2 :", savedFlowData && savedFlowInputField);
    if (savedFlowData && savedFlowInputField) {
      //  console.log("click3 :");
      const parsedFlowData = JSON.parse(savedFlowData);
      const parsedFlowInputField = JSON.parse(savedFlowInputField);

      const prevRule = rule;

      const updatedRuleObj = {
        ...prevRule,
        flowData: parsedFlowData,
        flowInputField: parsedFlowInputField,
      };
      if (rid) {
        try {
          // Pass the updated object to saveRuleVersion
          let nextVersion = versions.length + 1;
          //  console.log("---saveRuleVersion----",updatedRuleObj);
          await createNewVersionByRuleId(rid, updatedRuleObj, "V" + nextVersion.toString());

          // Optionally, clear the localStorage data if needed
          localStorage.removeItem("reactFlowState");
          localStorage.removeItem("FlowInputFields");

          handleCallVersion();
        } catch (error) {

        }
      } else {
        throw new Error("Rule id not found");
      }
    } else {
      message.error("Changes not made after Rule Save");
      return null; // No data found
    }
  };

  // const onConnect = useCallback(
  //     (connection) =>
  //         setEdgesState((eds) => {
  //             return addEdge(
  //                 {
  //                     id: v4(),
  //                     source: connection.source,
  //                     target: connection.target,
  //                     style: {
  //                         stroke: 'blue',
  //                         strokeWidth: 4,
  //                     },
  //                     data: {},
  //                     type: 'buttonEdge',
  //                     className: 'bg-white text-white',
  //                     sourceHandle: connection.sourceHandle,
  //                     targetHandle: connection.targetHandle,
  //                     animated: true,
  //                 },
  //                 eds
  //             );
  //         }),
  //     [setEdgesState]
  // );
  // const callVersions = () => {
  //     axios
  //         .get(`/rule/getVersions/${rid}`, {
  //             headers: {
  //                 Authorization: `Bearer ${auth.token}`,
  //             },
  //         })
  //         .then((resp) => {
  //             const ver = resp.data.data;
  //             if (ver.length > 0) {
  //                 const latestVersionId = ver[ver.length - 1].id;
  //                 setCurVer(latestVersionId);
  //                 setVersions(ver);
  //             }
  //         })
  //         .catch((err) => {
  //             console.error(err);
  //             toast.error('Failed fetching rule versions');
  //         });
  // };

  useEffect(() => {
    const fetchRule = async () => {
      if (rid) {
        try {
          const response = await getRuleByIndex(rid);
          //  console.log("response:", response);
          setRule(response); // Set the actual rule data after API call
        } catch (error) {
          console.error("Error fetching rule:", error);
        }
      }
    };

    fetchRule();
  }, [rid]);

  // useEffect(() => {
  //     callVersions();
  // }, []);
  // useEffect(() => {
  //     axios
  //         .get(`/rule/view/${currOrg.id}/${rid}`, {
  //             headers: {
  //                 Authorization: `Bearer ${auth.token}`,
  //             },
  //         })
  //         .then((resp) => {
  //             let finalNodes = [];
  //             let finalEdges = [];
  //            //  console.log(resp.data);
  //             let rawData = resp.data.data;
  //             let rawNodeData = JSON.parse(rawData.data);

  //             if (Object.keys(rawNodeData).length === 0) {
  //                 const tempId = v4();

  //                 rawNodeData = [
  //                     {
  //                         id: v4(),
  //                         type: 'requestCard',
  //                         position: { x: 0, y: 0 },
  //                         cardData: {},
  //                         targets: [tempId],
  //                     },
  //                     {
  //                         id: tempId,
  //                         type: 'responseCard',
  //                         position: { x: 0, y: 500 },
  //                         targetPosition: Position.Top,
  //                         data: {},
  //                         targets: [],
  //                     },
  //                 ];
  //             }

  //             rawNodeData.forEach((val) => {
  //                 const node = {
  //                     id: val.id,
  //                     type: val.type,
  //                     position: val.position,
  //                     data: {
  //                         cardData: {
  //                             ...val.cardData,
  //                         },
  //                     },
  //                 };

  //                 if (node.type === 'decisionCard') {
  //                     node.data.cardData.branches = val.branches || [];
  //                     node.data.colors = val.colors || {};
  //                     node.data.choices = getColors();
  //                 }

  //                 finalNodes.push(node);

  //                 val.targets.forEach((target) => {
  //                     const edgeData = {
  //                         id: v4(),
  //                         animated: true,
  //                         type: 'buttonEdge',
  //                         style: { stroke: 'blue', strokeWidth: 4 },
  //                         source: val.id,
  //                         target: target,
  //                     };

  //                     if (val.type === 'decisionCard') {
  //                         edgeData.style.stroke = node.data.colors[target] || 'blue';
  //                     }

  //                     finalEdges.push(edgeData);
  //                 });
  //             });

  //             setNodesState(finalNodes);
  //             setEdgesState(finalEdges);
  //         })
  //         .catch((err) => {
  //             console.error(err);
  //             toast.error('Failed fetching rules');
  //         });
  // }, []);

  // useEffect(() => {
  //     if (curVer) {
  //         if (versions.length > 0) {
  //             axios
  //                 .get(`/rule/getVersionData/${rid}/${curVer}`, {
  //                     headers: {
  //                         Authorization: `Bearer ${auth.token}`,
  //                     },
  //                 })
  //                 .then((resp) => {
  //                     let finalNodes = [];
  //                     let finalEdges = [];
  //                    //  console.log(resp.data.data);
  //                     let rawData = resp.data.data;
  //                     let rawNodeData = JSON.parse(rawData);
  //                     rawNodeData.forEach((val) => {
  //                         const node = {
  //                             id: val.id,
  //                             type: val.type,
  //                             position: val.position,
  //                             data: {
  //                                 cardData: {
  //                                     ...val.cardData,
  //                                 },
  //                             },
  //                         };

  //                         if (node.type === 'decisionCard') {
  //                             node.data.cardData.branches = val.branches || [];
  //                             node.data.colors = val.colors || {};
  //                             node.data.choices = getColors();
  //                         }

  //                         finalNodes.push(node);

  //                         val.targets.forEach((target) => {
  //                             const edgeData = {
  //                                 id: v4(),
  //                                 animated: true,
  //                                 type: 'buttonEdge',
  //                                 style: { stroke: 'blue', strokeWidth: 4 },
  //                                 source: val.id,
  //                                 target: target,
  //                             };

  //                             if (val.type === 'decisionCard') {
  //                                 edgeData.style.stroke = node.data.colors[target] || 'blue';
  //                             }

  //                             finalEdges.push(edgeData);
  //                         });
  //                     });

  //                     setNodesState(finalNodes);
  //                     setEdgesState(finalEdges);
  //                 })
  //                 .catch((err) => {
  //                     console.error(err);
  //                     toast.error('Failed fetching rule by version');
  //                 });
  //         }
  //     }
  // }, [curVer]);

  const setNodes = (newNodes) => {
    setNodesState(newNodes);
  };

  const setEdges = (newEdges) => {
    setEdgesState(newEdges);
  };

  const createNewNode = (cardType, position) => {
    const id = v4();
    const cardConfig = Cards.find((card) => card.cardType === cardType);

    if (!cardConfig) {
      console.error(`Unknown card type: ${cardType}`);
      return;
    }

    const newNode = {
      id: id,
      type: cardType,
      position: position,
      data: {
        cardData: { ...cardConfig.initialData },
      },
    };

    if (cardType === 'decisionCard') {
      const bid = v4();
      newNode.data.cardData.branches = [
        {
          branchId: bid,
          branchConditions: [],
        },
      ];
      newNode.data.choices = getColors();
      newNode.data.colors = {};
    }

    setNodesState((prevNodes) => [...prevNodes, newNode]);
  };

  const createBranchNode = (reqNode) => {
    const reqNodeData = findNodeById(nodesState, reqNode);

    const id = v4();
    const pos = {
      x: reqNodeData?.position.x,
      y: reqNodeData?.position.y + 500,
    };

    const newNode = {
      id: id,
      type: 'branchCard',
      position: pos,
      targetPosition: Position.Top,
      data: {},
    };

    setNodesState((prevNodes) => [...prevNodes, newNode]);

    const newEdgeData = {
      id: v4(),
      animated: true,
      type: 'buttonEdge',
      style: { stroke: 'blue', strokeWidth: 4 },
      source: reqNode,
      target: id,
      className: 'bg-white text-white',
    };

    if (reqNodeData?.type === 'decisionCard') {
      reqNodeData.data.colors[id] = reqNodeData.data.choices[0];
      reqNodeData.data.choices = reqNodeData.data.choices.slice(1);
      newEdgeData.style.stroke = reqNodeData.data.colors[id];

      // Update the decision card's branches
      const updatedBranches = [...reqNodeData.data.cardData.branches, { branchId: id, branchConditions: [] }];
      updateCardData(reqNode, {
        ...reqNodeData.data.cardData,
        branches: updatedBranches,
      });
    }

    setEdgesState((prevEdges) => [...prevEdges, newEdgeData]);

    return id;
  };

  const deleteNode = (nodeId) => {
    const nodeToDelete = nodesState.find((node) => node.id === nodeId);
    if (nodeToDelete && nodeToDelete.type === 'decisionCard') {
      setDeleteConfirmModal({ visible: true, nodeId, deleteType: null });
    } else {
      // For other card types, just remove the node and its connected edges
      setNodesState((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

      setEdgesState((prevEdges) => {
        let edges = prevEdges;

        // find edge with source as nodeId
        let edge = edges.find((edge) => edge.source === nodeId);
        // find edge with target as nodeId
        let edge2 = edges.find((edge) => edge.target === nodeId);
        if (edge2 && edge) {
          let newEdge = {
            id: `e${edge2.source}-${edge.target}`,
            source: edge2.source,
            target: edge.target,
            type: 'buttonEdge',
            animated: true,
            style: { stroke: 'blue', strokeWidth: 4 },
          };
          //  console.log('newEdge:', newEdge);

          edges.push(newEdge);
        }

        edges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        return edges;
      });
    }
  };

  const deleteEdge = (edgeId) => {
    setEdgesState((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  const deleteBranchNode = (id) => {
    setNodesState((prevNodes) => {
      const updatedNodes = prevNodes.filter((node) => node.id !== id);
      const parentDecisionCard = updatedNodes.find((node) => node.type === 'decisionCard' && node.data.cardData.branches.some((branch) => branch.branchId === id));
      if (parentDecisionCard) {
        parentDecisionCard.data.cardData.branches = parentDecisionCard.data.cardData.branches.filter((branch) => branch.branchId !== id);
      }
      return updatedNodes;
    });

    setEdgesState((prevEdges) => prevEdges.filter((edge) => edge.source !== id && edge.target !== id));

    //  console.log('Delete Card:', id);
  };

  const updateCardData = (id, data) => {
    //  console.log('🚀 ---------------🚀');
    //  console.log('🚀 ~ data:', data);
    //  console.log('🚀 ---------------🚀');

    setNodesState((prevNodes) => prevNodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, cardData: data } } : node)));
  };

  const handleDeleteConfirm = (deleteType) => {
    const { nodeId } = deleteConfirmModal;

    if (deleteType === 'immediate') {
      // Delete decision card and its immediate branches
      const connectedEdges = edgesState.filter((edge) => edge.source === nodeId);
      const immediateBranchIds = connectedEdges.map((edge) => edge.target);
      setNodesState((prevNodes) => prevNodes.filter((node) => node.id !== nodeId && !immediateBranchIds.includes(node.id)));
      setEdgesState((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && !immediateBranchIds.includes(edge.source)));
    } else if (deleteType === 'tree') {
      // Delete the entire tree for all branches
      const nodesToDelete = new Set([nodeId]);
      let edgesToCheck = edgesState.filter((edge) => edge.source === nodeId);

      while (edgesToCheck.length > 0) {
        const newNodesToCheck = [];
        edgesToCheck.forEach((edge) => {
          nodesToDelete.add(edge.target);
          newNodesToCheck.push(edge.target);
        });

        edgesToCheck = edgesState.filter((edge) => newNodesToCheck.includes(edge.source));
      }

      setNodesState((prevNodes) => prevNodes.filter((node) => !nodesToDelete.has(node.id)));
      setEdgesState((prevEdges) => prevEdges.filter((edge) => !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)));
    }
    setDeleteConfirmModal({ visible: false, nodeId: null, deleteType: null });
  };

  const getCurrentNodes = () => {
    return [nodesState, edgesState];
  };

  const ctxData = {
    updateCardData,
    deleteNode,
    createNewNode,
    createBranchNode,
    deleteEdge,
    deleteBranchNode,
    getCurrentNodes,
  };

  const handleRuleSaveClick = () => {
    onSaveFlowData();
    // handleModalSave();
    setIsModalVisible(true);
  };

  function onSaveFlowData() {
    // Retrieve the saved flow data from localStorage
    const savedFlowData = localStorage.getItem("reactFlowState");
    const savedFlowInputField = localStorage.getItem("FlowInputFields");

    //  console.log("savedFlowData -> ",savedFlowData);
    //  console.log("savedFlowInputField -> ",savedFlowInputField);


    if (savedFlowData && savedFlowInputField) {
      const parsedFlowData = JSON.parse(savedFlowData);
      const parsedFlowInputField = JSON.parse(savedFlowInputField);

      setRule((prev) => ({
        ...prev,
        flowData: parsedFlowData,
        flowInputField: parsedFlowInputField,
      }));
      localStorage.removeItem("reactFlowState");
      localStorage.removeItem("FlowInputFields");
      handleCallVersion();
      setIsRuleUpdated(true);
    } else {
      ////  console.log("No saved flow data found in localStorage.");
      return null; // No data found
    }
  }
  useEffect(() => {
    console.log("-----------rule or isRuleUpdate something change----------");
    if (isRuleUpdated && rule && rule?.flowData) {
      console.log("render for save flow data");
      handleModalSave();
    } else if (isRuleUpdated && rule && !rule?.flowData) {
      console.log("render for get all version");

      handleCallVersion();
    }
  }, [rule, isRuleUpdated]);

  useEffect(() => {
    //  console.log("Call for get all version");
    handleCallVersion();
  }, []);

  const handleModalSave = async () => {
    try {
      if (!rid) {
        throw new Error("Rule id not found");
      } else {
        await saveRule(rid, rule);
      }

      message.success("Rule saved successfully!");

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save the rule.");
      console.error(error);
    }
  };

  const handleCallVersion = async () => {
    //  console.log("get all updated version");
    try {
      if (!rid) {
        throw new Error("Rule id not found");
      } else {
        const versionData = await getAllVersionByRuleId(rid, rule)
        //  console.log("versionData : ",versionData)
        setVersions(versionData);
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error(error);
      console.error(error);
    }
  }

  return (
    <div>
      <div className="rule-management-titlebar">

        {/* <div className="workflow-management-controlbar"> */}
        {/* <Select
                  className="selector"
                  placeholder="Select a version"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { value: "1", label: "v1" },
                    { value: "2", label: "v2" },
                    { value: "3", label: "v3" },
                  ]}
                /> */}
        {/* <Button type="primary" onClick={handleRuleSaveClick}>
                  Save
                </Button> */}
        {/* <Button color="danger" disabled variant="solid">
                  Run
                </Button> */}
        {/* </div> */}
      </div>

      <ReactFlowProvider>
        <DesignerContext.Provider value={ctxData}>
          <RuleDesignerReactFlow
            // saveRule={() => {
            //     serializeFlow(nodesState, edgesState);
            // }}
            saveRuleVersion={saveRuleVersion}
            initialFlowData={rule.data}
            handleRuleSaveClick={handleRuleSaveClick}//when just save 
            versions={versions}
            updateRuleVersion={updateRuleVersion}
          />
          {/* 
                <DeleteConfirmationModal
                    visible={deleteConfirmModal.visible}
                    onCancel={() =>
                        setDeleteConfirmModal({
                            visible: false,
                            nodeId: null,
                            deleteType: null,
                        })
                    }
                    onDeleteImmediate={() => handleDeleteConfirm('immediate')}
                    onDeleteTree={() => handleDeleteConfirm('tree')}
                /> */}
        </DesignerContext.Provider>
      </ReactFlowProvider>
    </div>
  );
}

export default RuleDesigner;
