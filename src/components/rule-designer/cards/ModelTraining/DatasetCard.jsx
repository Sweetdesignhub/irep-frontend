

import React, { useState } from "react";
import Papa from "papaparse";
import { Input, Button, Upload, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import "../node.css";

const { Option } = Select;

export default function DatasetCard({ data }) {
  const [dataType, setDataType] = useState(null);
  const [file, setFile] = useState(null);
  const [s3Link, setS3Link] = useState("");

  const handleFileUpload = (info) => {
    const uploadedFile = info.file.originFileObj;
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      complete: (result) => {
        console.log("Parsed CSV: ", result.data);
      },
    });
  };

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Dataset Input</div>
      </div>

      <div className="card-content">
        <Form layout="vertical">
          <Form.Item label="Select Data Type">
            <Select
              placeholder="Choose data type"
              onChange={(value) => setDataType(value)}
              className="nodrag selector"
            >
              <Option value="csv">CSV File</Option>
              <Option value="s3">S3 Link</Option>
            </Select>
          </Form.Item>

          {dataType === "csv" && (
            <Form.Item label="Upload CSV File">
              <Upload
                beforeUpload={() => false}
                onChange={handleFileUpload}
                className="nodrag uploader"
              >
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </Form.Item>
          )}

          {dataType === "s3" && (
            <Form.Item label="S3 Link">
              <Input
                placeholder="Enter S3 Link"
                value={s3Link}
                onChange={(e) => setS3Link(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>

        <Handle type="target" position="left" id="out" />
      </div>
    </div>
  );
}