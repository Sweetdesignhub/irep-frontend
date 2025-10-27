
import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/rules`;

export const createRuleApi = async (orgId, ruledata) => {
  try {
    console.log("createRuleApi : ", ruledata);
    const response = await axios.post(`${API_URL}/rule/create/${orgId}`, ruledata);
    return response.data;
  } catch (error) {
    console.error("Error when Create Rule:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getRuleByOrgId = async (orgId) => {
  try {
    console.log("getRuleByOrgId : ", orgId);
    const response = await axios.get(`${API_URL}/rule/get/${orgId}`);


    return response.data;
  } catch (error) {
    console.error("Error when Create Rule:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const editRule = async (rule, orgId) => {
  try {
    console.log("Rule : ", rule);

    const response = await axios.put(
      `${API_URL}/rule/edit/${orgId}/${rule.id}`, // Assuming this is the correct URL for editing a rule
      {
        name: rule.name,
        description: rule.description,
        category: rule.category,
        status: rule.status,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error when update rule:", error);

    throw error;
  }
};

// Handle delete operation
export const deleteRule = async (id, orgId) => {
  try {
    const response = await axios.delete(`${API_URL}/rule/delete/${orgId}/${id}`);
    return response.data; // Return response after successful deletion
  } catch (error) {
    console.error("Error when deleting rule:", error);
    throw error;
  }
};

export const importRule = async (orgId, parsedData) => {
  try {
    console.log("createRuleApi : ", parsedData);
    await axios.post(`${API_URL}/rule/create/${orgId}`, parsedData);
  } catch (error) {
    console.error("Error when Create Rule:", error);
    throw error; // Re-throw the error for further handling
  }
};



export const fetchNodesAndEdges = async (ruleId) => {
  try {
    console.log("inside fetching", ruleId);
    if (ruleId === "") return { nodes: [], edges: [] };
    const response = await axios.get(`${API_URL}/getNodesAndEdges/${ruleId}`);
    const { nodes, edges } = response.data;

    // Format nodes and edges for React Flow (if necessary)
    const reactFlowNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: { x: node.positionX, y: node.positionY },
      width: node.width,
      height: node.height,
    }));

    const reactFlowEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      label: edge.label, // Optional: Add labels if available
    }));

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  } catch (error) {
    console.error("Error fetching nodes and edges:", error);
    throw new Error("Failed to fetch nodes and edges");
  }
};
