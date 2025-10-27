import React from 'react';
import { Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Handle, Position } from '@xyflow/react';

const CustomHandle = ({ type = "source", position = Position.Bottom, tooltipText = "Connect here!" }) => (
    <div className="relative group p-2">
        {/* Tooltip */}
        <Tooltip title={tooltipText} placement="top">
            {/* Icon Above Handle */}
            <div
                className={`absolute ${type === "target" ? "-top-9" : "top-6"
                    } left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
                {/* <PlusOutlined className="text-blue-500 text-2xl" /> */}
            </div>

            {/* Beautified Handle */}
            <Handle
                type={type}
                position={position}
                style={{
                    background: type === "source" ? '#4CAF50' : '#FF5722', // Different color for source and target
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                }}
                // onClick={() => alert(`${type.charAt(0).toUpperCase() + type.slice(1)} handle clicked!`)}
                className="cursor-pointer  transition-transform duration-200"
            />
        </Tooltip>
    </div>
);

export default CustomHandle;
