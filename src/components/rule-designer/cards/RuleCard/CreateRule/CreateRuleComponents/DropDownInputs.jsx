// DropDownInputs.jsx
import React from "react";
import InputField from "./InputField";
import Button from "./Button";

const DropDownInputs = ({ possibleInputs, setPossibleInputs, dropDownInputValue, setDropDownInputValue }) => (
    <div className="custom-rule-node-drop-down-container">
        <div style={{ display: "flex", alignItems: "center" }}>
            <InputField
                value={dropDownInputValue}
                onChange={(e) => setDropDownInputValue(e.target.value)}
                placeholder="Enter a value"
            />
            <Button
                label="+"
                onClick={() => {
                    if (dropDownInputValue.trim()) {
                        setPossibleInputs([...possibleInputs, dropDownInputValue.trim()]);
                        setDropDownInputValue("");
                    }
                }}
                className="custom-rule-node-plus"
            />
        </div>
        <div style={{ marginTop: "1rem" }}>
            {possibleInputs.map((value, index) => (
                <div key={index} className="custom-rule-node">
                    <span>{value}</span>
                    <Button
                        label="x"
                        onClick={() => setPossibleInputs(possibleInputs.filter((_, i) => i !== index))}
                        className="custom-rule-node-cross"
                    />
                </div>
            ))}
        </div>
    </div>
);

export default DropDownInputs;
