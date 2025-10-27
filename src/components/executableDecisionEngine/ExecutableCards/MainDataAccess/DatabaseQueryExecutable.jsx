import React, { useState, useEffect } from "react";
import axios from "axios";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import { Button, Input, Table, Spin, Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const DatabaseQueryExecutable = ({ data }) => {
  const {
    question,
    options,
    databaseUrl,
    onAnswer,
    host,
    password,
    username,
    port = 5432,
    database = "postgres",
    selectedTable,
    selectedColumns = [],
  } = data;
  console.log("Database Query: ", data.databaseUrl);
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewCount] = useState(5); // Show first 5 rows in preview

  const extractDbConfig = (url) => {
    try {
      const urlObj = new URL(url);
      // Here we assume the username is provided without a colon,
      // and we simply use urlObj.username and urlObj.password.
      return {
        host: urlObj.hostname,
        port: urlObj.port,
        database: urlObj.pathname.slice(1).split("?")[0],
        username: urlObj.username,
        password: urlObj.password,
      };
    } catch (error) {
      message.error("Invalid database URL");
      return null;
    }
  };

  useEffect(() => {
    console.log(
      "+++++++++++++++++++++++++++++++++++++++++vdbsjhvbdajkhbvadjh",
      host
    );
    if (selectedTable && selectedColumns.length > 0) {
      fetchData();
    }
  }, [host, password, selectedTable, selectedColumns]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create the API request payload
      const { host, port, username, password, database } = extractDbConfig(
        data.databaseUrl
      );
      console.log("table name is:", data);
      const payload = {
        host: host,
        port: port,
        username: username,
        password: password,
        database: database,
        tableName: selectedTable,
        columns: selectedColumns,
      };
      console.log("Pyload: ", payload);
      // Make API call to backend service
      const hosts =
        import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
      const response = await axios.post(
        `${hosts}/rules/databaseCard/fetch-column-values`,
        payload
      );

      console.log("response is: ", response.data.data);
      if (response.data.data && response.data.data.rows) {
        setFetchedData(response.data.data.rows);

        // Send data to parent component via onAnswer callback
        if (onAnswer) {
          onAnswer({
            status: "success",
            data: response.data.data.rows,
            columns: selectedColumns,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        throw new Error("No data received from server");
      }
    } catch (err) {
      setError(err.message);
      if (onAnswer) {
        onAnswer({
          status: "error",
          message: err.message,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Prepare table columns for Ant Design Table
  const tableColumns = selectedColumns.map((col) => ({
    title: col.replace(/_/g, " ").toUpperCase(),
    dataIndex: col,
    key: col,
    render: (value) => {
      // Check if the value is a number
      console.log(typeof value);
      const numericValue = parseFloat(value);

      // Check if conversion was successful and it's a finite number
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        // Round to 2 decimal places
        return numericValue.toFixed(2);
      }

      // Return original value if not a number
      return value;
    },
  }));

  return (
    <div>
      <div className="font-montserrat text-l font-bold mb-3 ml-1">
        Database Query Card
      </div>
      <div className="h-auto min-h-[32] min-w-[320px]  w-auto break-words p-4 bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-lg rounded-xl shadow-lg shadow-[#166DBE1A]">
        <CustomHandle
          type="target"
          position={Position.Top}
          tooltipText="Drag to connect as a target!"
        />

        <h2 className="ml-4 text-xl text-black font-semibold mb-4">
          Database Query
        </h2>

        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        ) : error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        ) : fetchedData.length > 0 ? (
          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">
              Showing {Math.min(previewCount, fetchedData.length)} of{" "}
              {fetchedData.length} records
            </div>
            <Table
              columns={tableColumns}
              dataSource={fetchedData.slice(0, previewCount)}
              rowKey={(record) => record.id || JSON.stringify(record)}
              size="small"
              pagination={false}
              scroll={{ x: true }}
            />
          </div>
        ) : (
          <div className="text-gray-500 mb-4">No data fetched yet</div>
        )}

        <Button
          type="primary"
          onClick={fetchData}
          loading={loading}
          className="mt-2"
        >
          {loading ? "Fetching Data..." : "Refresh Data"}
        </Button>

        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a source!"
        />
      </div>
    </div>
  );
};

export default DatabaseQueryExecutable;
