import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import axios from 'axios';
import CustomHandle from '../../../ui/customHandle/CustomHandle';
import { Button } from 'antd';


const GenerateFlowExecutable = ({ id, data }) => {
    const { onAnswer } = data;
    const GROK_API = import.meta.env.VITE_GROQ_API_KEY; // Load API key from environment
    const [aiResponse, setAiResponse] = useState("Fetching response...");
    const [trigger, setTrigger] = useState([]);
    const [validation, setValidation] = useState([]);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log("============Id is: ", id);
    // console.log("generate Flow Details: ", data.generateDetails);
    const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

    // Static data for Trigger, Validation, and Actions
    // const trigger = [{ label: "Brand name update submission", type: "trigger" }];
    // const validation = [
    //     { label: "Regulatory Compliance - EU MDR and GS1 Standards", type: "validation" },
    //     { label: "GTIN Action - New GTIN required", type: "validation" },
    // ];
    // const actions = [
    //     { label: "Update UDI databases (EU MDR EUDAMED, FDA GUDID)", type: "action" },
    //     { label: "Notify labeling and regulatory teams", type: "action" },
    //     { label: "Generate and assign a new GTIN", type: "action" },
    //     { label: "Ensure public release reflects the updated brand name", type: "action" },
    // ];
    const fetchGroqResponse = async () => {
        try {
            console.log("Generate Details: ", data.generateDetails);
            const response = await axios.post(
                `${host}/rules/generate-response`,
                { generateDetails: data.generateDetails },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("Response: ", response);
            const extractedData = response.data;

            // Extract triggers (keep only label)
            const triggers = extractedData.triggers.map(trigger => ({
                label: trigger.label
            }));

            // Extract validations (keep label and checks)
            const validations = extractedData.validations.map(validation => ({
                label: validation.label,
                checks: validation.checks || [] // Ensure checks exist
            }));

            // Extract actions (keep label and steps)
            const actions = extractedData.actions.map(action => ({
                label: action.label,
                steps: action.steps || [] // Ensure steps exist
            }));

            // Update state
            setTrigger(triggers);
            setValidation(validations);
            setActions(actions);

            setLoading(false);

            console.log("Generated data is ", extractedData);
            return extractedData;
        } catch (error) {
            console.error("Error fetching response from backend:", error);
            return "Error generating response.";
        }
    };
   
    useEffect(() => {
        fetchGroqResponse();
    }, []);

    // Render a list of items
    const renderItems = (items, bgClass) =>
        items.map((item, index) => (
            <div
                key={index}
                className={`text-white text-sm font-medium px-3 py-2 mb-2 rounded ${bgClass}`}
            >
                {item.label}
            </div>
        ));

    const handleChange = (e) => {
        onAnswer(id); // Call the onAnswer function passed via props
    };

    return (
        <div>
            <div className="font-montserrat text-l font-bold mb-3 ml-1">
                Generate Flow
            </div>
            <div className="bg-transparent  rounded-lg p-6 text-center">
                <CustomHandle type="target" position={Position.Top} tooltipText="Drag to connect as a target!" />
                <h1 className="bg-white text-[#343434BF] rounded-xl text-lg  mb-4 bg-[#FDFAFD] p-4">Here is the workflow we have created based on your inputs:</h1>

                <div className="flex flex-row gap-6">
                    {/* Trigger Section */}
                    <div>
                        <h2 className="mb-2 p-3 font-montserrat text-sm  border border-[#66708514] border-[1.5px] rounded-lg bg-[#FDFAFD]">Trigger</h2>
                        {renderItems(trigger, "bg-[#EB1700]")}
                    </div>

                    {/* Validation Section */}
                    <div>
                        <h2 className="mb-2 p-3 font-montserrat text-sm  border border-[#66708514] border-[1.5px] rounded-lg bg-[#FDFAFD]">Validation</h2>
                        {renderItems(validation, "bg-[#EB7118]")}
                    </div>

                    {/* Actions Section */}
                    <div>
                        <h2 className="mb-2 p-3 font-montserrat text-sm  border border-[#66708514] border-[1.5px] rounded-lg bg-[#FDFAFD]">Actions</h2>
                        {renderItems(actions, "bg-[#00EB42]")}
                    </div>
                </div>
                {/* <button onClick={handleChange}>Go To Test Flow</button> */}
                <Button className='ml-6 mb-4 mt-2' onClick={handleChange} color="primary" variant="filled">
                    Go To Test Flow
                </Button>

                {/* Handles for connecting nodes */}
                {/* <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />
                <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" /> */}
                <CustomHandle type="source" position={Position.Bottom} tooltipText="Drag to connect as a target!" />

            </div>
        </div>
    );
};

export default GenerateFlowExecutable;
