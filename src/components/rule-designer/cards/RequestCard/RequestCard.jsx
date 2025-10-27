
import { Input } from "antd";
import { Handle } from "@xyflow/react";
import "../node.css";
import TextArea from "antd/es/input/TextArea";

export default function ResponseCard({ data }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Request Card</div>
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
          <label className="label">
            Context Name :
          </label>
          <Input
            className="input-field"
          />
        </div>
      </div>
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: "#555" }}
      />
    </div>
  );
}
