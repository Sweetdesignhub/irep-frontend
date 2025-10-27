import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./NotificationNode.css";


function NotificationNode({ data, isConnectable }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notification, setNotification] = useState("");

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        console.log("Selected item: ", item);
        localStorage.setItem('selectedOption', item);  // Storing selected option
        setNotification(item);
        setAnchorEl(null);  // Close the menu

        if (data.onNotifyNode) {
            data.selectedValue = item;
            console.log("Passing item and node details to parent...", data.selectedValue);
            data.onNotifyNode(item); // Pass both item and node details to parent
        }
    };

    return (
        <div className='notification-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <p className='notification-node-title'>Do you want to Notify Others?</p>
            <button className='notification-node-drop-down-btn' onClick={handleClick}><p className='notification-node-val'>{notification || "Select Attribute"}</p></button>

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

export default NotificationNode;