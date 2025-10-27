import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./PublicReleaseNode.css";

const handleStyle = { left: 10 };

function PublicRelease({ data, isConnectable }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [publicRelease, setPublicRelease] = useState("");
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        console.log("Selected item: ", item);
        localStorage.setItem('selectedOption', item);  // Storing selected option
        setPublicRelease(item)
        setAnchorEl(null);  // Close the menu

        if (data.onPublicRelease) {
            console.log("Passing item and node details to parent...");
            data.onPublicRelease(item); // Pass both item and node details to parent
        }
    };

    return (
        <div className='public-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <p className='public-node-title'>Is this brand name update publicly released?</p>

            <button className='public-node-drop-down-btn' onClick={handleClick}><p className='attribute-node-val'>{publicRelease || "Select Attribute"}</p></button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('Yes')}>Yes</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('No')}>No</MenuItem>
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

export default PublicRelease;