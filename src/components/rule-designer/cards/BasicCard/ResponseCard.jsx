
import { Input } from "antd";
import { Handle } from "@xyflow/react";
import "../node.css";
import TextArea from "antd/es/input/TextArea";

export default function ResponseCard({ data }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Response Card</div>
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
              Status:
            </label>
            <Input
              value={data?.status ? "True" : "False"}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">
              Data:
            </label>
            <TextArea rows={4} value={data?.data} className="input-field" />
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
