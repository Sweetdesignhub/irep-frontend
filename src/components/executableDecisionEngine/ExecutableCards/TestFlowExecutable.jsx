import React, { useState } from 'react';
import { Handle } from '@xyflow/react';

const TestFlowExecutable = ({ data }) => {
    const [triggerData, setTriggerData] = useState('');
    const [validationData, setValidationData] = useState('');
    const [decisionData, setDecisionData] = useState('');

    // Handlers for file uploads
    const handleTriggerUpload = (e) => setTriggerData(e.target.files[0]?.name || 'No file selected');
    const handleValidationUpload = (e) => setValidationData(e.target.files[0]?.name || 'No file selected');
    const handleDecisionUpload = (e) => setDecisionData(e.target.files[0]?.name || 'No file selected');

    // Handlers for test buttons
    const handleTestTrigger = () => console.log('Testing Trigger with data:', triggerData);
    const handleTestValidation = () => console.log('Testing Validation with data:', validationData);
    const handleTestDecision = () => console.log('Testing Decision with data:', decisionData);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col items-start">
            <h4 className="text-xl text-black font-semibold mb-4 text-center">TEST THE WORKFLOW</h4>

            {/* Trigger Section */}
            <div className="mb-4 w-full">
                <label className="text-black font-medium mb-2 block">Trigger:</label>
                <input
                    type="file"
                    accept=".txt,.csv,.json,.pdf"
                    onChange={handleTriggerUpload}
                    className="mb-2"
                />
                <input
                    type="text"
                    placeholder="Enter Trigger data manually"
                    onChange={(e) => setTriggerData(e.target.value)}
                    className="border rounded-md p-2 w-full"
                />
                <button
                    onClick={handleTestTrigger}
                    className="bg-blue-500 text-white mt-2 px-4 py-2 rounded-md"
                >
                    Test Trigger
                </button>
            </div>

            {/* Validation Section */}
            <div className="mb-4 w-full">
                <label className="text-black font-medium mb-2 block">Validation:</label>
                <input
                    type="file"
                    accept=".txt,.csv,.json,.pdf"
                    onChange={handleValidationUpload}
                    className="mb-2"
                />
                <input
                    type="text"
                    placeholder="Enter Validation data manually"
                    onChange={(e) => setValidationData(e.target.value)}
                    className="border rounded-md p-2 w-full"
                />
                <button
                    onClick={handleTestValidation}
                    className="bg-green-500 text-white mt-2 px-4 py-2 rounded-md"
                >
                    Test Validation
                </button>
            </div>

            {/* Decision Section */}
            <div className="mb-4 w-full">
                <label className="text-black font-medium mb-2 block">Decision:</label>
                <input
                    type="file"
                    accept=".txt,.csv,.json,.pdf"
                    onChange={handleDecisionUpload}
                    className="mb-2"
                />
                <input
                    type="text"
                    placeholder="Enter Decision data manually"
                    onChange={(e) => setDecisionData(e.target.value)}
                    className="border rounded-md p-2 w-full"
                />
                <button
                    onClick={handleTestDecision}
                    className="bg-purple-500 text-white mt-2 px-4 py-2 rounded-md"
                >
                    Test Decision
                </button>
            </div>

            <Handle type="source" position="bottom" />
            <Handle type="target" position="top" />
        </div>
    );
};

export default TestFlowExecutable;
