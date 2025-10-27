import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Button, Menu, MenuItem } from '@mui/material';
import "./ChangeTypeNode.css";
import DropDownIcon from '../../../../assets/arrow_drop_down.svg'

const handleStyle = { left: 10 };

function ChangeTypeNode({ data, isConnectable, onSubmitChangeType }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectsOption, setSelectedOption] = useState("");

    // Open menu on button click
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle selecting an option from the menu
    const handleMenuItemClick = (option) => {
        setSelectedOption(option);

        handleSubmit(option);
        setAnchorEl(null); // Close the menu
    };

    // Handle submit button
    const handleSubmit = (option) => {
        if (data.onSubmitChangeType) {
            data.onSubmitChangeType(option); // Passing selected option to parent
        }
    };

    return (
        <div className='change-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />

            <p className='change-node-title'>What type of change are you making to the Brand name?</p>


            <button className='change-node-drop-down-btn' onClick={handleClick}>
                <p className='change-node-val'>{selectsOption || "Select Change Type"}</p>
                <img
                    src={DropDownIcon}
                    alt="Medical Icon"
                    className='change-node-drop-down-img'

                />
            </button>


            {/* Menu with predefined values */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('Updating the existing name')}>Updating the existing name</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Adding a new brand name')}>Adding a new brand name</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Removing an existing name')}>Removing an existing name</MenuItem>
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

export default ChangeTypeNode;
