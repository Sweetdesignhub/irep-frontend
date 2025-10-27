import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./InputNode.css";
import MedicalIcon from '../../../../assets/medical_services.svg'
import DropDownIcon from '../../../../assets/arrow_drop_down.svg'
import { PRODUCT_TYPE_DATA } from "./constant.js"

const handleStyle = { left: 10 };

function InputNode({ data, isConnectable }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [val, setVal] = useState("")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        console.log("Selected item: ", item);
        setAnchorEl(null); // Close the menu
        setVal(item);
        console.log("val", val);
        // Include the node data along with the selected item


        if (data.onMenuItemSelect) {
            console.log("Passing item and node details to parent...");
            data.onMenuItemSelect(item); // Pass both item and node details to parent
        }
    };

    return (
        <div className='input-node-container'>
            <p className='input-node-title'>{PRODUCT_TYPE_DATA.QUESTION}</p>
            <button className='input-node-drop-down-btn' onClick={handleClick}>
                <img
                    src={MedicalIcon}
                    alt="Medical Icon"
                    className='input-node-img'
                />
                <p className='input-node-val'>{val || "Select"}</p>
                <img
                    src={DropDownIcon}
                    alt="Medical Icon"
                    className='input-node-img'
                />
            </button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {PRODUCT_TYPE_DATA.OPTIONS.map((element) => (
                    <MenuItem key={element} onClick={() => handleMenuItemClick(element)}>
                        {element}
                    </MenuItem>
                ))}

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

export default InputNode;
