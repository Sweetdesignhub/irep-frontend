import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  message,
  Card,
  Table,
  Spin,
  Modal,
  Form,
} from "antd";
import {
  DatabaseOutlined,
  SaveOutlined,
  TableOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  fetchDbData,
  fetchTableSchema,
} from "../../../../../services/database.services";
import axios from "axios";
import { useSelector } from "react-redux";

const DatabaseWriteCard = ({ onSave }) => {
  const [dbType, setDbType] = useState("postgres");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [tableNames, setTableNames] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableSchema, setTableSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newColumnModalVisible, setNewColumnModalVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("varchar");
  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
  const [secrets, setSecrets] = useState([]);
  const [isLoadingDatabaseURLs, setIsLoadingDatabaseURLs] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;

  // Common database column types
  const columnTypes = [
    "varchar",
    "text",
    "integer",
    "bigint",
    "boolean",
    "date",
    "timestamp",
    "json",
    "jsonb",
  ];

  useEffect(() => {
    const fetchDatabaseSecrets = async () => {
      setIsLoadingDatabaseURLs(true);
      try {
        const response = await axios.get(`${host}/rules/secret-key/${userId}`, {
          params: {
            type: "DATABASE",
          },
        });
        setSecrets(response.data.secretKeys);
      } catch (err) {
        console.error("Error fetching database secrets:", err);
        message.error("Failed to load database secrets");
      } finally {
        setIsLoadingDatabaseURLs(false);
      }
    };

    fetchDatabaseSecrets();
  }, []);

  const handleSecretChange = (value) => {
    const selected = secrets.find((secret) => secret.key === value);
    setDatabaseUrl(selected.value);
  };

  const extractDbConfig = async (url) => {
    try {
      const urlObj = new URL(url);
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
    const dbConfig = await extractDbConfig(databaseUrl);
    if (!dbConfig) {
      setLoading(false);
      return;
    }

    try {
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
      message.success("Schema fetched successfully!");
    } catch (error) {
      message.error("Failed to fetch schema: " + error.message);
    }
    setLoading(false);
  };

  const handleAddNewColumn = () => {
    if (!newColumnName) {
      message.error("Please enter a column name");
      return;
    }

    // Validate column name (basic check)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newColumnName)) {
      message.error(
        "Invalid column name. Must start with a letter or underscore and contain only alphanumeric characters and underscores."
      );
      return;
    }

    // Check if column already exists
    if (tableSchema.some((col) => col.name === newColumnName)) {
      message.error(`Column '${newColumnName}' already exists`);
      return;
    }

    // Add the new column to the schema
    const newColumn = {
      name: newColumnName,
      type: newColumnType,
      isNew: true, // Mark as new for tracking
    };

    setTableSchema([...tableSchema, newColumn]);
    setNewColumnModalVisible(false);
    setNewColumnName("");
    message.success(`Column '${newColumnName}' added`);
  };

  const saveConfiguration = () => {
    if (!tableSchema) {
      message.error("Fetch the schema first");
      return;
    }

    // Filter only new columns that were added
    const newColumns = tableSchema.filter((col) => col.isNew);

    if (newColumns.length === 0) {
      message.error("No new columns to add");
      return;
    }

    // onSave callback with all necessary information
    onSave({
      databaseUrl,
      selectedTable,
      newColumns,
      operationType: "ADD_COLUMNS",
    });
    message.success("Write configuration saved!");
  };

  return (
    <Card className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DatabaseOutlined /> Database Write Configuration
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
            loading={isLoadingDatabaseURLs}
            onChange={handleSecretChange}
            className="nodrag mb-4"
            notFoundContent={
              isLoadingDatabaseURLs ? <Spin size="small" /> : "No secrets found"
            }
          >
            {secrets.map((secret) => (
              <Select.Option key={secret.key} value={secret.key}>
                {secret.key}
              </Select.Option>
            ))}
          </Select>

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
        <div>
          <Table
            columns={[
              { title: "Column Name", dataIndex: "name", key: "name" },
              { title: "Data Type", dataIndex: "type", key: "type" },
              {
                title: "Status",
                key: "status",
                render: (_, record) => (record.isNew ? "New" : "Existing"),
              },
            ]}
            dataSource={tableSchema}
            rowKey="name"
            pagination={false}
            size="small"
            bordered
          />

          <Button
            type="dashed"
            onClick={() => setNewColumnModalVisible(true)}
            icon={<PlusOutlined />}
            className="mt-4"
          >
            Add New Column
          </Button>
        </div>
      )}

      <Modal
        title="Add New Column"
        visible={newColumnModalVisible}
        onOk={handleAddNewColumn}
        onCancel={() => setNewColumnModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Column Name" required>
            <Input
              placeholder="Enter column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Data Type">
            <Select
              value={newColumnType}
              onChange={setNewColumnType}
              className="w-full"
            >
              {columnTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {tableSchema && (
        <Button
          type="primary"
          onClick={saveConfiguration}
          icon={<SaveOutlined />}
          className="mt-4"
        >
          Save Write Configuration
        </Button>
      )}
    </Card>
  );
};

export default DatabaseWriteCard;
