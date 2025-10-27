import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, Input, Button } from "antd";
import { ApiOutlined, SendOutlined } from "@ant-design/icons";
import CustomHandle from "../../../ui/customHandle/CustomHandle";

export default function APIExecutable({ id, data }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeApiCall = async () => {
    if (!data.endpoint) return alert("API Endpoint is required");

    setLoading(true);
    try {
      const url = new URL(data.endpoint);
      if (data.queryParams) {
        url.search = new URLSearchParams(
          JSON.parse(data.queryParams)
        ).toString();
      }

      const options = {
        method: data.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(data.token ? { Authorization: `Bearer ${data.token}` } : {}),
        },
        body: ["POST", "PUT"].includes(data.method)
          ? JSON.stringify(JSON.parse(data.requestBody || "{}"))
          : null,
      };

      const res = await fetch(url, options);
      const result = await res.json();
      setResponse(result);
    } catch (error) {
      setResponse({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <Card className="bg-white border border-gray-300 rounded-xl shadow-md p-4 w-80 font-montserrat">
        {/* Node Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ApiOutlined className="text-blue-500 text-xl" />
            <span className="font-semibold text-lg text-gray-900">
              API Node
            </span>
          </div>
        </div>

        {/* API Endpoint */}
        <div className="mb-2">
          <label className="text-gray-700 text-sm">Endpoint</label>
          <Input className="mt-1" value={data.endpoint} disabled />
        </div>

        {/* API Method */}
        <div className="mb-2">
          <label className="text-gray-700 text-sm">Method</label>
          <Input className="mt-1" value={data.method} disabled />
        </div>

        {/* API Token */}
        {data.token && (
          <div className="mb-2">
            <label className="text-gray-700 text-sm">Token</label>
            <Input.Password className="mt-1" value={data.token} disabled />
          </div>
        )}

        {/* API Request Body (if applicable) */}
        {["POST", "PUT"].includes(data.method) && (
          <div className="mb-2">
            <label className="text-gray-700 text-sm">Request Body</label>
            <Input.TextArea
              className="mt-1"
              value={data.requestBody}
              disabled
            />
          </div>
        )}

        {/* Send API Request Button */}
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600 mt-3 flex items-center gap-2"
          onClick={makeApiCall}
          loading={loading}
        >
          <SendOutlined /> Send Request
        </Button>

        {/* API Response Output */}
        {response && (
          <div className="mt-4 bg-gray-100 p-2 rounded-md text-xs">
            <label className="text-gray-700 text-sm">Response</label>
            <pre className="text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </Card>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a target!"
      />
    </div>
  );
}
