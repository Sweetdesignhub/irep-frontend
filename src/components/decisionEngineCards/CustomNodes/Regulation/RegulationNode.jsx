import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import "./RegulationNode.css";
import PlusIcon from "../../../../assets/data_saver_on.svg";

const handleStyle = { left: 10 };

function RegulationNode({ data, isConnectable, onSubmitRegulations }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRegulations, setSelectedRegulations] = useState([]);

    const handleClick = (event) => {
        console.log("Good", event);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        if (!selectedRegulations.includes(item)) {
            setSelectedRegulations((prevRegulations) => [...prevRegulations, item]);
            localStorage.setItem('selectedRegulations', JSON.stringify([...selectedRegulations, item]));
        }

        setAnchorEl(null); // Close the menu

        if (data.onRegulationSelect) {
            data.onRegulationSelect(item); // Notify parent about the selection
        }
    };

    const handleSubmit = () => {
        console.log(selectedRegulations);
        console.log(data);
        // Call the callback passed from DecisionEngine to send selected regulations
        if (data.onSubmitRegulations) {
            data.onSubmitRegulations(selectedRegulations); // Passing selected regulations to parent
        }
    };

    return (
        <div className='regulation-node-container'>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <p className='regulation-node-title'>Select regulations:</p>
            <button className='regulation-node-drop-down-btn' onClick={handleClick}><img
                src={PlusIcon}
                alt="Medical Icon"
                style={{ width: '12px', height: '16px', marginRight: '5px', }}
            />Add Regulation</button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('EU MDR')}>EU MDR</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('FDA UDI')}>FDA UDI</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('GS1 Standards')}>GS1 Standards</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Other (Custom)')}>Other (Custom)</MenuItem>
            </Menu>

            {/* Render selected regulations */}
            <div style={{ marginTop: '10px' }}>
                {selectedRegulations.length > 0 ? (
                    <ul className='regulation-node-selected-regulations'>
                        {selectedRegulations.map((regulation, index) => (
                            <li className='regulation-node-each-selected-regulation' key={index}>{regulation}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No regulations selected.</p>
                )}
            </div>

            <button className='regulation-node-drop-down-btn' onClick={handleSubmit}>Submit</button>

            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
            />
        </div>
    );
}

export default RegulationNode;
