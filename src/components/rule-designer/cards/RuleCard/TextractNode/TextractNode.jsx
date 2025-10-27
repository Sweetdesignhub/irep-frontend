import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const TextractNode = ({ data }) => {
    const [formData, setFormData] = useState({
        endpoint: "",
        accessKey: "",
        secretKey: "",
        bucketName: "",
        region: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.onSubmit) {
            data.onSubmit(formData);
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Textract Node</h3>
                <p className="text-sm text-gray-500">
                    Connect to AWS Textract for data processing
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Endpoint
                    </label>
                    <input
                        type="text"
                        name="endpoint"
                        value={formData.endpoint}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter AWS Endpoint"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Access Key
                    </label>
                    <input
                        type="text"
                        name="accessKey"
                        value={formData.accessKey}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter AWS Access Key"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Secret Key
                    </label>
                    <input
                        type="password"
                        name="secretKey"
                        value={formData.secretKey}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter AWS Secret Key"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Bucket Name
                    </label>
                    <input
                        type="text"
                        name="bucketName"
                        value={formData.bucketName}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter AWS Bucket Name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Region
                    </label>
                    <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter AWS Region"
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit
                    </button>
                </div>
            </form>
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 bg-blue-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 bg-blue-500"
            />
        </div>
    );
};

export default TextractNode;
