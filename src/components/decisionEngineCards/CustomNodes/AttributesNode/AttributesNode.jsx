import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Button, Menu, MenuItem } from '@mui/material';
import DropDownIcon from '../../../../assets/arrow_drop_down.svg'
import "./AttributeNode.css";

function AttributesNode({ data, isConnectable, onSubmitAttributes }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAttribute, setSelectedAttribute] = useState('');

    // Open menu on button click
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle selecting an attribute from the menu
    const handleMenuItemClick = (attribute) => {
        setSelectedAttribute(attribute);

        handleSubmit(attribute);
        setAnchorEl(null); // Close the menu
    };

    // Handle submit button
    const handleSubmit = (attribute) => {
        console.log("Inside Handle Submit: ", selectedAttribute);


        // Call the callback passed from DecisionEngine to send the selected attribute
        if (data.onSubmitAttributes) {
            data.onSubmitAttributes(attribute); // Passing selected attribute to parent
        }
    };

    return (
        <div className='attribute-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <p className='attribute-node-title'>What attributes are being modified?</p>
            <button className='attribute-node-drop-down-btn' onClick={handleClick}>
                <p className='attribute-node-val'>{selectedAttribute || "Select Attribute"}</p>
                <img
                    src={DropDownIcon}
                    alt="Medical Icon"
                    className='attribute-node-drop-down-img'

                />
            </button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('Trade Name')}>Trade Name</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Packaging Dimensions')}>Packaging Dimensions</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Critical Warnings')}>Critical Warnings</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Other (Custom)')}>Other (Custom)</MenuItem>
            </Menu>


            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
            />
        </div>
    );
}

export default AttributesNode;
