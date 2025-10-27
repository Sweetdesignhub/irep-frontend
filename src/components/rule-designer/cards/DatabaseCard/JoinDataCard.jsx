

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Form, Button } from "antd";
import { useReactFlow, Handle, useHandleConnections } from "@xyflow/react";
import { joinDbData } from "../../../../services/database.services";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
import "../node.css";

const { Option } = Select;

// Validation schema with Yup
const validationSchema = Yup.object({
  joinType: Yup.string().required("Select a join type"),
  primaryTable: Yup.string().required("Select a Primary Table"),
  primaryKey1: Yup.string().required("Select a primary key from Table 1"),
  primaryKey2: Yup.string().required("Select a primary key from Table 2"),
});

function JoinDataCard({ data }) {
  const { getNode, addNodes, addEdges,updateNodeData } = useReactFlow();
  const { dbConfig } = useContext(DbConfigContext);
  const [primaryTable, setPrimaryTable] = useState("");
  const [secondaryTable, setSecondaryTable] = useState("");

  console.log("data --> ",data);
  

  // Use handle connections to fetch target connections for current node
  const connections = useHandleConnections({
    type: "target",
    id: "tableInput",
  });

  // Debug connections
  useCallback(() => {
    console.log("Connections:", connections);
  }, [connections]);

  // Fetch source nodes from connections
  const sourceNodes =
    connections?.map((conn) => getNode(conn.source)).filter(Boolean) || [];

  // Extract table names and columns from source nodes
  const tables = sourceNodes?.map((node) => node?.data?.table);
  const columns = sourceNodes?.map((node) => node?.data?.columns);
  console.log("ssourceNodes-->", sourceNodes);
  console.log("table-->", tables);
  console.log("column-->", columns);
  const databaseDetails = sourceNodes[0]?.data?.databaseDetails; // Assuming databaseDetails exists in the first source node

  console.log("databaseDetails-->", databaseDetails);
  // Handle primary and secondary table selection
  const handleTableChange = (value) => {
    formik.setFieldValue("primaryTable", value);
    setPrimaryTable(value);

    const secondaryTableName = tables.find((table) => table !== value);
    setSecondaryTable(secondaryTableName);
  };

  // Formik initialization with validation
  const formik = useFormik({
    initialValues: {
      joinType: data?.joinType || "",
      primaryTable: data?.primaryTable || "",
      primaryKey1: data?.primaryKey1 || "",
      primaryKey2: data?.primaryKey2 || "",
    },
    validationSchema: Yup.object({
      joinType: Yup.string().required("Join type is required"),
      primaryTable: Yup.string().required("Primary table is required"),
      primaryKey1: Yup.string().required("Primary key 1 is required"),
      primaryKey2: Yup.string().required("Primary key 2 is required"),
    }),
    onSubmit: async (values) => {
      console.log("submit");

      const joinData = {
        joinType: values.joinType,
        primaryTable: values.primaryTable,
        primaryColumn: {
          [primaryTable]: values.primaryKey1,
          [secondaryTable]: values.primaryKey2,
        },
        tables: tables,
        columns: {
          [primaryTable]: columns[0] || [],
          [secondaryTable]: columns[1] || [],
        },
      };

      updateNodeData(data.id, {
        ...data, // Keep all current properties of the node
        joinType: values.joinType,
        primaryTable: values.primaryTable,
        primaryKey1:values.primaryKey1,
        primaryKey2:values.primaryKey2,
      });

      
      try {
        // Send join data to backend
        
        const response = await joinDbData(dbConfig, joinData);
        console.log("Join data response:", response);

        const responseNode = {
          id: `response_${Date.now()}`,
          type: "Response Card",
          position: { x: data?.position?.x + 550, y: data?.position?.y - 50 },
          data: {
            status: response ? true : false,
            data: JSON.stringify(response),
          },
        };



        // Add the new response node to React Flow
        addNodes(responseNode);

        // Create and add connection between current node and responseNode
        const newConnection = {
          id: `edge_${data.id}_${responseNode.id}`, // Unique edge ID
          source: data.id,
          sourceHandle: "sourceHandleId",
          target: responseNode.id,
          targetHandle: "targetHandleId",
        };

        addEdges([newConnection]); // Add the connection to React Flow
      } catch (error) {
        console.error("Error on join:", error);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="card">
      <Handle
        type="target"
        position="left"
        id="tableInput"
        isConnectable={connections.length < 2}
      />
      <div className="card-head">
        <div className="card-title">{data?.contentName}</div>
        <div
          className="card-flag-color"
          style={{
            backgroundColor: data.flagColor,
          }}
        ></div>
      </div>

      <div
        className="tick-line"
        // style={{ backgroundColor: data.flagColor }}
      ></div>

      <div className="card-content">
        {/* Join Type Selector */}
        <div>
          <label>Join Type</label>
          <Select
            name="joinType"
            placeholder="Select Join Type"
            className="nodrag selector"
            onChange={(value) => formik.setFieldValue("joinType", value)}
            value={formik.values.joinType}
          >
            <Option value="inner">Inner Join</Option>
            <Option value="left">Left Join</Option>
            <Option value="right">Right Join</Option>
            <Option value="full">Full Join</Option>
          </Select>
          {formik.errors.joinType && (
            <div className="error">{formik.errors.joinType}</div>
          )}
        </div>

        {/* Table Selector */}
        <div>
          <label>Primary Table</label>
          <Select
            placeholder="Select the Primary Table"
            className="nodrag selector"
            options={tables.map((table) => ({
              label: table,
              value: table,
            }))}
            onChange={handleTableChange}
            value={formik.values.primaryTable}
          />
          {formik.errors.primaryTable && (
            <div className="error">{formik.errors.primaryTable}</div>
          )}
        </div>

        {/* Primary Key Selectors */}
        {primaryTable && (
          <div>
            <label>Primary Key from {primaryTable}</label>
            <Select
              placeholder="Select Primary Key"
              className="nodrag selector"
              onChange={(value) => formik.setFieldValue("primaryKey1", value)}
              value={formik.values.primaryKey1}
            >
              {databaseDetails?.columns[primaryTable]?.map((col) => (
                <Option key={col.column_name} value={col.column_name}>
                  {col.column_name}
                </Option>
              ))}
            </Select>
            {formik.errors.primaryKey1 && (
              <div className="error">{formik.errors.primaryKey1}</div>
            )}
          </div>
        )}

        {secondaryTable && (
          <div>
            <label>Primary Key from {secondaryTable}</label>
            <Select
              placeholder="Select Primary Key"
              className="nodrag selector"
              onChange={(value) => formik.setFieldValue("primaryKey2", value)}
              value={formik.values.primaryKey2}
            >
              {databaseDetails?.columns[secondaryTable]?.map((col) => (
                <Option key={col.column_name} value={col.column_name}>
                  {col.column_name}
                </Option>
              ))}
            </Select>
            {formik.errors.primaryKey2 && (
              <div className="error">{formik.errors.primaryKey2}</div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button className="nodrag save-btn" type="submit">
          Run
        </button>
      </div>
      <Handle type="source" position="right" id="responseData" />
    </form>
  );
}

export default JoinDataCard;
