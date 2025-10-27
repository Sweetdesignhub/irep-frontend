// src/components/DropDownNode.js
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Select } from 'antd';
import { MedicineBoxOutlined } from "@ant-design/icons"
import CustomHandle from '../../../ui/customHandle/CustomHandle';
import { RiDropdownList } from "react-icons/ri";

const DropDownNode = ({ data }) => {
    const { question, options, onAnswer } = data;
    console.log("Data in drop Down is: ", data);
    const handleChange = (e) => {
        console.log(e);
        onAnswer(e); // Call the onAnswer function passed via props
    };

    return (
        <div>
            <div className="font-montserrat text-l font-bold mb-3 ml-1">
                Drop Down Node
            </div>
            <div className="h-auto min-h-[32] min-w-[320px] max-w-[400px] w-auto  break-words bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-lg rounded-xl shadow-lg shadow-[#166DBE1A] px-8 py-2 flex flex-col justify-between">
                <CustomHandle type="target" position={Position.Top} tooltipText="Drag to connect as a target!" />


                <div className="space-y-2 m-2">
                    {/* <h3>Please Choose an Answer</h3> */}
                    <h4 className="text-sm text-[#343434BF] mb-2">{question}</h4>

                    <Select
                        style={{ width: "100%" }} // Full width
                        className=" nodrag nowheel text-black "
                        placeholder="Select an option"
                        onChange={handleChange}
                        prefixIcon={<RiDropdownList />} // Add custom icon here
                        options={options.map((option) => ({
                            value: option.value || option.label, // Ensure proper value assignment
                            label: option.label,
                            disabled: option.disabled || false, // Handle disabled state
                        }))}
                    />
                </div>

                {/* <select
                    onChange={handleChange}
                    className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option className="text-black" value="" disabled selected>Select an option</option>
                    {options.map((option, idx) => (
                        <option className="text-black" key={idx} value={option.label}>
                            {option.label}
                        </option>
                    ))}
                </select> */}
                <CustomHandle type="source" position={Position.Bottom} tooltipText="Drag to connect as a target!" />


            </div>
        </div>
    );
};

export default DropDownNode;
