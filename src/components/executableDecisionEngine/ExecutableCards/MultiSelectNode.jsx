// src/components/MultiSelectNode.js
import React from 'react';
import { Handle } from '@xyflow/react';

const MultiSelectNode = ({ data }) => {
    const { question, options, onAnswer } = data;

    const handleChange = (e) => {
        onAnswer(e.target.value, e.target.checked); // Call the onAnswer function with both value and checked status
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-72">
            <h4 className="text-lg font-semibold mb-2 text-black">{question}</h4>
            <div className="space-y-2">
                {options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2 text-black">
                        <input
                            type="checkbox"
                            value={option.label}
                            onChange={handleChange}
                            className="text-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-black">{option.label}</span>
                    </label>
                ))}
            </div>
            <Handle type="source" position="bottom" />
            <Handle type="target" position="top" />

        </div>

    );
};

export default MultiSelectNode;
