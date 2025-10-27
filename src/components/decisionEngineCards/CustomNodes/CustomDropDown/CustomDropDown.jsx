import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./InputNode.css";
import MedicalIcon from '../../../assets/medical_services.svg'
import DropDownIcon from '../../../assets/arrow_drop_down.svg'
import { PRODUCT_TYPE_DATA } from "../../../constant.js"


function CustomDropDown({ data, isConnectable }, Question, ) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [val, setVal] = useState("")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        setAnchorEl(null); // Close the menu
        setVal(item);
        console.log("val", val);
        // Include the node data along with the selected item
        const nodeDetails = {
            ...data,  // include existing node details
            selectedItem: item,  // add selected item to node details
        };

        if (data.onMenuItemSelect) {
            console.log("Passing item and node details to parent...");
            data.onMenuItemSelect(item, nodeDetails); // Pass both item and node details to parent
        }
    };

    return (
        <div className='input-node-container'>
            <p className='input-node-title'>{PRODUCT_TYPE_DATA.QUESTION}</p>
            <button className='input-node-drop-down-btn' onClick={handleClick}><img
                src={MedicalIcon}
                alt="Medical Icon"
                style={{ width: '16px', height: '16px', marginRight: '5px', }}
            /><p className='input-node-val'>{val || "Select"}</p><img
                    src={DropDownIcon}
                    alt="Medical Icon"
                    style={{ width: '8px', height: '16px', marginLeft: '70%', }}
                /></button>
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

export default CustomDropDown;