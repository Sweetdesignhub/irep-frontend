import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Select, Card, notification } from "antd";

const { Option } = Select;

const LiveDataConnection = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [pollingInterval, setPollingInterval] = useState(5000);
  const [liveData, setLiveData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const intervalRef = useRef(null); // Stores interval ID

  // Function to Fetch API Data
  const fetchData = async () => {
    if (!apiUrl) {
      notification.error({ message: "API URL is required!" });
      return;
    }

    try {
      const options = {
        method,
        headers: headers ? JSON.parse(headers) : {},
      };
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      setLiveData(data);
    } catch (error) {
      console.error("Error fetching API:", error);
      notification.error({ message: "Error fetching data!" });
    }
  };

  // Effect for polling logic
  useEffect(() => {
    if (isFetching) {
      fetchData(); // Fetch immediately
      intervalRef.current = setInterval(fetchData, pollingInterval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isFetching, apiUrl, method, headers, pollingInterval]);

  // Start Live Fetching
  const startFetching = () => {
    if (!apiUrl) {
      notification.error({ message: "Please enter a valid API URL!" });
      return;
    }
    setIsFetching(true);
  };

  // Stop Fetching
  const stopFetching = () => {
    setIsFetching(false);
  };

  // Save API Configurations
  const saveApiConfig = () => {
    const config = { apiUrl, method, headers, pollingInterval };
    // localStorage.setItem("apiConfig", JSON.stringify(config));
    notification.success({ message: "API Configuration Saved!" });
  };
  return (
    <Card className="w-[28vw] p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Live Data Connection
      </h2>

      <div className="flex flex-col gap-4">
        {/* API URL */}
        <Input
          placeholder="Enter API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />

        {/* HTTP Method */}
        <Select value={method} onChange={setMethod} className="w-full">
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
        </Select>

        {/* Headers */}
        <Input.TextArea
          placeholder='Enter headers as JSON (e.g., {"Authorization": "Bearer token"})'
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />

        {/* Polling Interval */}
        <Input
          type="number"
          placeholder="Polling Interval (ms)"
          value={pollingInterval}
          onChange={(e) => setPollingInterval(Number(e.target.value))}
        />

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          {isFetching ? (
            <Button type="primary" danger onClick={stopFetching}>
              Stop Live Fetch
            </Button>
          ) : (
            <Button type="primary" onClick={startFetching}>
              Start Live Fetch
            </Button>
          )}
          <Button onClick={saveApiConfig}>Save Configuration</Button>
        </div>

        {/* Live Data Output */}
        {liveData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Live Data:</h3>
            <pre className="text-sm text-gray-700">
              {JSON.stringify(liveData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveDataConnection;
