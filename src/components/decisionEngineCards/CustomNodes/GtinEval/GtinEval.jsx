import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./GtinEval.css";
import DropDownIcon from '../../../../assets/arrow_drop_down.svg'
import NewFolder from "../../../../assets/create_new_folder.svg"

const handleStyle = { left: 10 };

function GtinEval({ data, isConnectable }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGtin, setSelectedGtin] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        setSelectedGtin(item);

        setAnchorEl(null);  // Close the menu

        if (data.onMenuItemSelect) {
            console.log("Passing item and node details to parent...");
            data.onGtinEval(item); // Pass both item and node details to parent
        }
    };

    return (
        <div className='gtin-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />

            <p className='gtin-node-title'>What type of GTIN evaluation do you need?</p>
            <button className='gtin-node-drop-down-btn' onClick={handleClick}>
                <img
                    src={NewFolder}
                    alt="Medical Icon"
                    className='gtin-node-drop-down-img'

                />
                <p className='gtin-node-val'>{selectedGtin || "Select Updating or Modifying!"}</p>
                <img
                    src={DropDownIcon}
                    alt="Medical Icon"
                    className='gtin-node-drop-down-img'

                />
            </button>


            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('Updating the brand name (New GTIN required)')}>Updating the brand name (New GTIN required)</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Modifying name spelling insignificantly (Same GTIN retained)')}>Modifying name spelling insignificantly (Same GTIN retained)</MenuItem>
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

export default GtinEval;
