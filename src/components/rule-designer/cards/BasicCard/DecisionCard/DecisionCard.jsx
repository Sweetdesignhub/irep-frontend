import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Button, Input, Select, Form, Card, Divider } from "antd";
import HeaderDesignCard from "../../HeaderDesignCard/HeaderDesignCard";
import BasicCardsIcon from "../../../../../assets/BasicCardsIcon.svg";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";

const { Option } = Select;

const DecisionCard = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const [variables, setVariables] = useState(data?.variables || []);
  const [conditions, setConditions] = useState(data?.conditions || []);
  const [testInput, setTestInput] = useState({});
  const [testResult, setTestResult] = useState(null);

  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }]);
  };

  const updateVariable = (index, key, value) => {
    const newVars = [...variables];
    newVars[index][key] = value;
    setVariables(newVars);
  };

  const addCondition = () => {
    setConditions([...conditions, { variable: "", operator: "==", compareTo: "" }]);
  };

  const updateCondition = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  const deleteCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const saveConfig = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, variables, conditions } } : node
      )
    );
  };

  const testLogic = () => {
    let result = true;
    conditions.forEach(({ variable, operator, compareTo }) => {
      const value = parseFloat(testInput[variable]) || testInput[variable];
      const valueToBeComparedWith = parseFloat(testInput[compareTo]) || testInput[compareTo];
      switch (operator) {
        case "==":
          result = result && value == valueToBeComparedWith;
          break;
        case "!=":
          result = result && value != valueToBeComparedWith;
          break;
        case ">":
          result = result && value > valueToBeComparedWith;
          break;
        case "<":
          result = result && value < valueToBeComparedWith;
          break;
        case ">=":
          result = result && value >= valueToBeComparedWith;
          break;
        case "<=":
          result = result && value <= valueToBeComparedWith;
          break;
        default:
          result = false;
      }
    });
    setTestResult(result ? "Condition Met ✅" : "Condition Not Met ❌");
  };

  return (
      <div>
          <CustomHandle
              type="target"
              position={Position.Top}
              tooltipText="Drag to connect as a target!"
            />
          <HeaderDesignCard
        gradientColors={["#00000000", "#EA61F6", "#FF29EA"]}
        iconSrc={BasicCardsIcon}
        initialHeader="Basic Card"
        titleText="Decision Card"
        helperText="Generate a Decision for your use case"
        infoButtonText="Learn more about Decision"
        primaryTextColor="#8C077F"
        titleTextColor="#770679"
      />
    <Card title="Decision Node" size="small" className=" p-4 shadow-lg border rounded-2xl">
      <Divider>Variables</Divider>
      {variables.map((variable, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input placeholder="Name" value={variable.name} onChange={(e) => updateVariable(index, "name", e.target.value)} className="flex-1" />
          <Input placeholder="Value" value={variable.value} onChange={(e) => updateVariable(index, "value", e.target.value)} className="flex-1" />
        </div>
      ))}
      <Button size="small" onClick={addVariable} className="mb-4">Add Variable</Button>
      
      <Divider>Conditions</Divider>
      {conditions.map((condition, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <Select value={condition.variable} onChange={(value) => updateCondition(index, "variable", value)} className="w-1/3 nodrag">
            {variables.map((v, i) => (
              <Option key={i} value={v.name}>{v.name}</Option>
            ))}
          </Select>
          <Select value={condition.operator} onChange={(value) => updateCondition(index, "operator", value)} className="w-1/4 nodrag">
            <Option value="==">==</Option>
            <Option value="!=">!=</Option>
            <Option value=">">&gt;</Option>
            <Option value="<">&lt;</Option>
            <Option value=">=">&gt;=</Option>
            <Option value="<=">&lt;=</Option>
          </Select>
          <Input placeholder="Compare To" value={condition.compareTo} onChange={(e) => updateCondition(index, "compareTo", e.target.value)} className="w-1/3" />
          <Button size="small" type="text" danger onClick={() => deleteCondition(index)}>✕</Button>
        </div>
      ))}
      <Button size="small" onClick={addCondition} className="mb-4">Add Condition</Button>
      
      <Divider>Test Logic</Divider>
      {variables.map((v, i) => (
        <Input key={i} placeholder={`Test Value for ${v.name}`} onChange={(e) => setTestInput({ ...testInput, [v.name]: e.target.value })} className="mb-2" />
      ))}
      <Button size="small" onClick={testLogic} className="mb-4">Run Test</Button>
      {testResult && <p className="font-semibold text-center">{testResult}</p>}
      
      <Button type="primary" size="small" onClick={saveConfig}>Save Config</Button>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </Card>
      </div>
  );
};

export default DecisionCard;
