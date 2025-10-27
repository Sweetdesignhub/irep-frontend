// nodeUtils.js
import { v4 as uuidv4 } from "uuid";

export const createNodesAndEdges = (type, id, reactFlowInstance, data) => {
    const { possibleInputs, fileOptions, featureTypes, featureReasons, selectTypes, typeCombinations } = data;

    const currentNode = reactFlowInstance.getNode(id);
    const newNodes = [];
    const newEdges = [];

    if (type === "DROP_DOWN") {
        const inputs = possibleInputs.map((input) => input.trim());
        inputs.forEach((input, index) => {
            const newNodeId = uuidv4();
            newNodes.push({
                id: newNodeId,
                position: { x: currentNode.position.x + 200 + index * 50, y: currentNode.position.y + 150 },
                data: { label: input },
                type: "Rule Card",
            });
            newEdges.push({ id: `edge+${id}+${newNodeId}`, source: id, target: newNodeId, label: input, animated: true });
        });
    } else if (type === "UPLOAD_FILE") {
        // Similar logic for UPLOAD_FILE
    } else if (type === "SELECT_TYPES") {
        // Similar logic for SELECT_TYPES
    }

    reactFlowInstance.setNodes((prev) => [...prev, ...newNodes]);
    reactFlowInstance.setEdges((prev) => [...prev, ...newEdges]);
};
