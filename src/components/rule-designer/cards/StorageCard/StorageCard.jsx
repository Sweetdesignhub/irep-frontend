
import { Input, Select } from "antd";
import { Handle } from "@xyflow/react";
import "../node.css";
import TextArea from "antd/es/input/TextArea";

export default function AwsS3Card({ data }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">AWS S3 Card</div>
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
            Region
          </label>
          <Input
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            AWS Access Key Id
          </label>
          <Input
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            AWS Secret Access Key
          </label>
          <Input
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            Access Level
          </label>
          <Select
            showSearch={true} // Enable searching
            placeholder="Select the option"
            options={
              [
                {
                  label:"Read",
                  value:"read"
                },
                {
                  label:"Write",
                  value:"write"
                }
              ]
            }
          />

        </div>

        <div>
          <label className="label">
            Bucket
          </label>
          <Input
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            Key
          </label>
          <Input
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            Context Name
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
