import React, { useState, useEffect } from "react";
import { Input, Button, Select, message, Card, Table, Spin } from "antd";
import {
  DatabaseOutlined,
  SaveOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  fetchDbData,
  fetchTableSchema,
} from "../../../../../services/database.services";
import axios from "axios";
import { useSelector } from "react-redux";

const DatabaseQueryCard = ({ onSave }) => {
  const [dbType, setDbType] = useState("postgres");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"; // Adjust your API URL
  const [secrets, setSecrets] = useState([]);
  const [isLoadingDatabaseURLs, setIsLoadingDatabaseURLs] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  useEffect(() => {
    const fetchDatabaseSecrets = async () => {
      setIsLoadingDatabaseURLs(true);
      try {
        const response = await axios.get(`${host}/rules/secret-key/${userId}`, {
          params: {
            type: "DATABASE", // Filter by DATABASE type
          },
        });
        console.log("Database Secrets Fetch: ", response.data.secretKeys);
        setSecrets(response.data.secretKeys);
      } catch (err) {
        console.error("Error fetching database secrets:", err);
        setError("Failed to load database secrets");
      } finally {
        setIsLoadingDatabaseURLs(false);
      }
    };

    fetchDatabaseSecrets();
  }, []);

  const handleSecretChange = (e) => {
    // setSelectedSecret(e.target.value);
    // console.log("Eveent:", e);
    // You can access the full secret object if needed:
    const selected = secrets.find((secret) => secret.key === e);
    setDatabaseUrl(selected.value);
    // console.log("Selected secret:", selected.value);
  };

  const extractDbConfig = async (url) => {
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

  const checkConnection = async () => {
    setLoading(true);
    // console.log("Database URL:", databaseUrl);
    const dbConfig = await extractDbConfig(databaseUrl);
    if (!dbConfig) {
      setLoading(false);
      return;
    }

    try {
      // console.log("db config:", dbConfig);
      const connectionResponse = await fetchDbData(dbConfig);
      setTableNames(connectionResponse.tables || []);

      message.success("Connected successfully! Select a table.");
    } catch (error) {
      message.error("Connection failed: " + error.message);
    }
    setLoading(false);
  };

  const fetchSchema = async () => {
    if (!selectedTable) {
      message.error("Select a table first");
      return;
    }
    setLoading(true);

    try {
      const extractedDBconfig = await extractDbConfig(databaseUrl);
      const schemaResponse = await fetchTableSchema({
        ...extractedDBconfig,
        tableName: selectedTable,
      });
      const schemaResult = await schemaResponse.json();
      setTableSchema(schemaResult.columns);
      // Reset any previously selected columns when fetching a new schema.
      setSelectedColumns([]);
      message.success("Schema fetched successfully!");
    } catch (error) {
      message.error("Failed to fetch schema: " + error.message);
    }
    setLoading(false);
  };

  const saveConfiguration = () => {
    if (!tableSchema) {
      message.error("Fetch the schema first");
      return;
    }
    if (selectedColumns.length === 0) {
      message.error("Select at least one column");
      return;
    }

    // onSave now includes selectedColumns along with other details.
    onSave({ databaseUrl, selectedTable, tableSchema, selectedColumns });
    message.success("Configuration saved!");
  };

  // rowSelection configuration for the antd Table component.
  const rowSelection = {
    selectedRowKeys: selectedColumns,
    onChange: (selectedRowKeys) => {
      setSelectedColumns(selectedRowKeys);
    },
  };

  return (
    <Card className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DatabaseOutlined /> Database Configuration
      </h2>
      {!tableSchema && (
        <div>
          <Select
            value={dbType}
            onChange={setDbType}
            className="w-full mb-4 nodrag"
          >
            <Select.Option value="postgres">PostgreSQL</Select.Option>
            <Select.Option value="mongodb" disabled>
              MongoDB (Coming Soon)
            </Select.Option>
          </Select>

          <Select
            style={{ width: "100%" }}
            placeholder="Select a database secret"
            loading={loading}
            onChange={handleSecretChange}
            className="nodrag mb-4"
            // value={selectedKey}
            notFoundContent={
              loading ? <Spin size="small" /> : "No secrets found"
            }
          >
            {secrets.map((secret) => (
              <Option key={secret.key} value={secret.key}>
                {secret.key}
              </Option>
            ))}
          </Select>

          {/* <Input
            placeholder="Enter DATABASE_URL"
            value={databaseUrl}
            onChange={(e) => setDatabaseUrl(e.target.value)}
            className="mb-4"
          /> */}

          <Button
            type="primary"
            loading={loading}
            onClick={checkConnection}
            icon={<DatabaseOutlined />}
          >
            Connect & Fetch Tables
          </Button>
        </div>
      )}
      {!tableSchema && tableNames.length > 0 && (
        <Select
          value={selectedTable}
          placeholder="Select the Table"
          onChange={setSelectedTable}
          className="w-full my-4 nodrag"
        >
          {tableNames.map((table) => (
            <Select.Option key={table} value={table}>
              {table}
            </Select.Option>
          ))}
        </Select>
      )}

      {!tableSchema && selectedTable && (
        <Button
          type="primary"
          onClick={fetchSchema}
          icon={<TableOutlined />}
          className="mb-4"
        >
          Fetch Table Schema
        </Button>
      )}

      {tableSchema && (
        <Table
          columns={[
            { title: "Column Name", dataIndex: "name", key: "name" },
            { title: "Data Type", dataIndex: "type", key: "type" },
          ]}
          dataSource={tableSchema}
          rowKey="name"
          pagination={false}
          size="small"
          bordered
          rowSelection={rowSelection}
        />
      )}

      <Button
        type="primary"
        onClick={saveConfiguration}
        icon={<SaveOutlined />}
        disabled={!tableSchema}
        className="mt-4"
      >
        Save Configuration
      </Button>
    </Card>
  );
};

export default DatabaseQueryCard;
