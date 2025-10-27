import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, Radio, Button, notification } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
// import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";
import RuleCardsIcon from "../../../../../assets/RuleCardsIcon.svg";
import InfoButton from "../../../../../ui/InfoButton/InfoButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
// import { Table, Button, Modal, Form, Input, notification, Space, Tooltip, Spin } from "antd"

const languageMap = {
  javascript: javascript(),
  python: python(),
  // Add more languages here if needed
};

const sampleSnippet = `
function greet(name) {
  return \`Hello, \${name}! Welcome to the Code Executor.\`;
}

console.log(greet(userInput));

`;
const CodeExpressionCard = ({ data }) => {
  const [code, setCode] = useState(sampleSnippet || "");
  const [language, setLanguage] = useState(data.language || "javascript");
  const [isEditing, setIsEditing] = useState(false);
  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Rule Card");

  // console.log("Data inside Code Executable is: ", data);

  // Handle changes to code and update the data object
  const handleCodeChange = (value) => {
    setCode(value);
    data.code = value; // Save the code changes directly to data.code
    data.language = language;
    console.log("Code Expresion data: ", data);
    if (data.onChange) {
      data.onChange(value);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Save the code explicitly when the save button is clicked
  const saveCode = () => {
    data.language = language;
    data.code = code; // Explicitly save the code into data
    console.log("Saved code: ", data.code);
    console.log("Saved data: ", data);

    if (data.onChange) {
      data.onChange(code); // Trigger onChange if provided
    }
    notification.success({ message: "Code Saved Successfully" });
  };

  return (
    <div className="w-[28vw] ">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      {/* <Handle type="target" position={Position.Top} className="w-2 h-2" /> */}
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 bg-gradient-to-t relative from-white/50 via-orange-200 to-orange-500  mx-auto"
        style={{
          //   borderWidth: "2px",
          //   borderStyle: "solid",
          borderRadius: "12px", // Matches rounded-xl
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={RuleCardsIcon}
              alt="Rule Card"
              className="w-16 h-16 bg-white p-1 inline-block mr-8 shadow-md rounded"
            />
            {/* Editable Title */}
            <div className="flex flex-col items-start">
              {isEditing ? (
                <Input
                  type="text"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  onBlur={handleBlur}
                  autoFocus
                  className="color-red bg-[#FDE6C3] text-[#8C3107]" // Apply the .titles class here
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className=" text-base text-[#8C3107] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#792A06] font-semibold mr-3 font-xl cursor-pointer">
                  <FontAwesomeIcon icon={faCode} />
                  {"  "}
                  {language === "javascript"
                    ? "Javascript Code Execution "
                    : "Python Code Execution"}
                </h4>
                <InfoButton text="This is a Rule Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C3107] mt-4">
            The Rule Card Help You Implement Logic using Javascript or Python{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <Card
        className="border-2 shadow-lg "
        title={
          <Radio.Group
            value={language}
            onChange={handleLanguageChange}
            buttonStyle="solid"
            className="flex text-[#7A2B07]"
          >
            <Radio.Button
              value="javascript"
              //   className="!text-[#7A2B07] !border-[#7A2B07] hover:!bg-[#7A2B07] hover:!text-white
              //    data-[checked=true]:!bg-[#7A2B07] data-[checked=true]:!text-white"
            >
              JavaScript
            </Radio.Button>
            <Radio.Button
              value="python"
              //   className="!text-[#7A2B07] !border-[#7A2B07] hover:!bg-[#7A2B07] hover:!text-white
              //    data-[checked=true]:!bg-[#7A2B07] data-[checked=true]:!text-white"
            >
              Python
            </Radio.Button>
          </Radio.Group>
        }
        bodyStyle={{ padding: "8px" }}
      >
        <CodeMirror
          value={code}
          height="200px"
          extensions={[languageMap[language]]}
          onChange={handleCodeChange}
          theme={noctisLilac}
          className="border rounded"
        />
        <Button
          className="mt-2 w-full text-[#7A2B07] border-[#7A2B07] flex justify-center items-center"
          onClick={saveCode}
          color="primary"
          variant="dashed"
        >
          Save Code
        </Button>
      </Card>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />{" "}
    </div>
  );
};

export default CodeExpressionCard;
