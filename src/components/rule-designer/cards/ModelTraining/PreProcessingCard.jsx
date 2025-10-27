
import React, { useState } from "react";
import Papa from "papaparse";
import { Input, Button, Upload, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import "../node.css";

const { Option } = Select;

function PreProcessingCard({ id, data }) {
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [targetColumn, setTargetColumn] = useState("");

  const preprocessingSteps = [
    "Remove Null Values",
    "Standardize",
    "Normalize",
    "One-Hot Encoding",
    "Drop Duplicates",
    "Scale",
  ];

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Data Preprocessing</div>
      </div>

      <div className="card-content">
        <Form layout="vertical">
          <Form.Item label="Select Preprocessing Steps">
            <Select
              mode="multiple"
              placeholder="Choose steps"
              onChange={(value) => setSelectedSteps(value)}
              className="nodrag selector"
            >
              {preprocessingSteps.map((step) => (
                <Option key={step} value={step}>
                  {step}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Specify Target Column">
            <Input
              placeholder="Enter column name"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
            />
          </Form.Item>

          <Button type="primary" className="btn">
            Apply Preprocessing
          </Button>
        </Form>
      </div>
      <Handle type="source" position="right" id="out" />
      <Handle type="target" position="left" id="in" />

    </div>
  );
}

export default PreProcessingCard;
