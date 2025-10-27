
import { Input, Select } from "antd";
import { Handle } from "@xyflow/react";
import "../node.css";
import TextArea from "antd/es/input/TextArea";

export default function AdvanceAiCard({ data }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Advance AI Card</div>
        <div
          className="card-flag-color"
          style={{
            backgroundColor: "black",
          }}
        ></div>
      </div>

      <div
        className="tick-line"
        // style={{ backgroundColor: data.flagColor }}
      ></div>

      <div className="card-content">
        <div>
          <label className="label">AI Card</label>
          <Select
            showSearch={true} // Enable searching
            placeholder="Select the Model"
            options={[
              {
                label: "OCR Tesseract",
                value: "ocrtesseract",
              },
              {
                label: "Mistral 7B",
                value: "mistral7b",
              },
            ]}
          />
        </div>
        <div>
          <label className="label">OCR File Data (base64)</label>
          <Input className="input-field" />
        </div>
        <div>
          <label className="label">Context Name</label>
          <Input className="input-field" />
        </div>
      </div>
      <Handle
        type="target"
        position="left"
        id="in"
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: "#555" }}
      />
    </div>
  );
}
