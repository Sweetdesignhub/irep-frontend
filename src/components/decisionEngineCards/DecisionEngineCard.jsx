import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    Panel,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InputNode from './CustomNodes/InputNode/InputNode';
import RegulationNode from './CustomNodes/Regulation/RegulationNode'; // Import RegulationNode
import AttributesNode from './CustomNodes/AttributesNode/AttributesNode';
import ChangeTypeNode from './CustomNodes/ChangeTypeNode/ChangeTypeNode';
import FileUploadNode from './CustomNodes/FileUploadNode/FileUploadNode';
import GtinEval from './CustomNodes/GtinEval/GtinEval';
import PublicRelease from './CustomNodes/PublicRelease/PublicReleaseNode';
import NotificationNode from './CustomNodes/NotificationNode/NotificationNode';

const nodeTypes = {
    inputNode: InputNode,
    regulationNode: RegulationNode, // Add RegulationNode to nodeTypes
    attributesNode: AttributesNode,
    changeTypeNode: ChangeTypeNode,
    fileUploadNode: FileUploadNode,
    gtinEval: GtinEval,
    publicRelease: PublicRelease,
    notifyNode: NotificationNode,
};

const rfStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0)', // 50% transparent
    borderRadius: '10px'
};

const initialNodes = [
    {
        id: `d5e14b92-bba8-4969-a9a8-0917748ff2a8`,
        data: {
            label: `Node 1`,
            nodeId: 'd5e14b92-bba8-4969-a9a8-0917748ff2a8',
            selectedValue: "",
        },
        position: { x: 700, y: 0 },
        type: 'inputNode',
    },
];

const initialEdges = [];

function DecisionEngine() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.8 });
    const indexMap = {
        "menuItem": 0, "regulations": 1, "attributes": 2, "changeType": 3, "file": 4, "gtinEval": 5, "publicRelease": 6, "Notify": 7
    }

    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [],
    );

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
        },
        [],
    );

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => addEdge(params, eds));
        },
        [],
    );


    const addNewNode = (item, position, type, key) => {
        const index = indexMap[key];
        console.log("Nodes:", nodes);
        const ides = uuidv4();
        const currentNode = nodes[index];
        currentNode.selectedValue = item;
        const newNode = {
            id: ides,
            data: { label: `Node After ${item}`, nodeId: ides, selectedValue: "" },
            position: position,
            type: type,
        };
        console.log("Workflow", nodes);
        const parentNode = nodes.slice(0, index + 1);
        parentNode.push(newNode);
        setNodes(parentNode);

        const newEdge = {
            id: uuidv4(),
            source: currentNode.id,
            target: newNode.id,
            type: 'default',
        };
        const parentEdge = edges.slice(0, index + 1);
        parentEdge.push(newEdge);
        setEdges(parentEdge)
    }

    const handleMenuItemSelect = useCallback((item) => {
        addNewNode(item, { x: 300, y: 300 }, "regulationNode", "menuItem")
    }, [nodes]);

    const handleRegulationSubmit = useCallback((selectedRegulations) => {
        addNewNode(selectedRegulations, { x: 200, y: 600 }, "attributesNode", "regulations")
    }, [nodes]);

    const handleAttributesSubmit = useCallback((selectedAttribute) => {

        addNewNode(selectedAttribute, { x: 1000, y: 200 }, "changeTypeNode", "attributes")
    }, [nodes]);

    const handleChangeTypeSubmit = useCallback((selectedOption) => {
        addNewNode(selectedOption, { x: 1000, y: 500 }, "fileUploadNode", "changeType")
    }, [nodes]);

    const handleFileUploadSubmit = useCallback((file) => {
        addNewNode(file, { x: 1500, y: 100 }, "gtinEval", "file")

    }, [nodes]);

    const handleGtinEval = useCallback((item) => {
        addNewNode(item, { x: 1500, y: 300 }, "publicRelease", "gtinEval")
    }, [nodes]);

    const handlePublicRelease = useCallback((item) => {
        addNewNode(item, { x: 1500, y: 500 }, "notifyNode", "publicRelease")

    }, [nodes]);

    const handleNotification = useCallback((item) => {
        const index = indexMap["Notify"];
        const currentNode = nodes[index];
        currentNode.selectedValue = item;
        console.log("Final Data is: ", nodes);
    }, [nodes]);

    return (
        <div style={{ height: '90vh', width: '95vw', marginLeft: "2.5vw" }}>
            <ReactFlow
                nodes={nodes.map((node) => ({
                    ...node,
                    data: {
                        ...node.data, onMenuItemSelect: handleMenuItemSelect,
                        onSubmitRegulations: handleRegulationSubmit,
                        onSubmitAttributes: handleAttributesSubmit,
                        onSubmitChangeType: handleChangeTypeSubmit,
                        onSubmitFile: handleFileUploadSubmit,
                        onGtinEval: handleGtinEval,
                        onPublicRelease: handlePublicRelease,
                        onNotifyNode: handleNotification,

                    },
                }))}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={rfStyle}
                viewport={viewport}
            >
                <Panel position="top-left">Your Custom Decision Engine</Panel>
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default DecisionEngine;