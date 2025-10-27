import React, { useContext ,useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select,Button, Input } from "antd";
import { Handle, useHandleConnections, useReactFlow } from "@xyflow/react";
import "../node.css";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
import { insertTableData } from "../../../../services/database.services";

const InsertDataCard = ({ id,data }) => {
  
  const { dbConfig } = useContext(DbConfigContext);
  const { getNode,addNodes ,updateNodeData } = useReactFlow();
  
  const connections = useHandleConnections({
    type: "target",
    id: "dbInput",
  });

  useEffect(() => {
    console.log("Connections:", connections);
  }, [connections]);

  const sourceNodesData =
    connections?.map((conn) => getNode(conn.source)).filter(Boolean) || [];
  
  const sourceNodeData = sourceNodesData[0];
  const tables = sourceNodeData?.data?.details?.tables || [];
  const columnsData = sourceNodeData?.data?.details?.columns || {};

  const formik = useFormik({
    initialValues: {
      table: "",
      columns: {},
    },
    validationSchema: Yup.object().shape({
      table: Yup.string().required("Table is required"),
      columns: Yup.object().shape({}),
    }),
    onSubmit: (values) => {
      console.log("Submitted values:", values);
      data.onSave(values);
    },
  });

  const handleTableChange = (table) => {
    formik.setFieldValue("table", table);
    formik.setFieldValue("columns", {}); // Reset column values

    const selectedColumns = columnsData[table] || [];
    const newValidationSchema = {};
    selectedColumns.forEach((col) => {
      if (!col.is_nullable) {
        newValidationSchema[col.column_name] = Yup.string().required(
          `${col.column_name} is required`
        );
      }
    });
    formik.setValidationSchema(
      Yup.object().shape({
        table: Yup.string().required("Table is required"),
        columns: Yup.object().shape(newValidationSchema),
      })
    );
  };

  const renderColumnInputs = () => {
    const selectedColumns = columnsData[formik.values.table] || [];
    return selectedColumns.map((col) => (
      <div key={col.column_name} className="card-content">
        <label>{col.column_name} ({col.data_type})</label>
        <Input
          value={formik.values.columns[col.column_name] || ""}
          onChange={(e) =>
            formik.setFieldValue(`columns.${col.column_name}`, e.target.value)
          }
          placeholder={`Enter ${col.column_name}`}
          className="nodrag"
        />
        {formik.errors.columns?.[col.column_name] && (
          <div className="error">{formik.errors.columns[col.column_name]}</div>
        )}
      </div>
    ));
  };

  const onInsert = async () => {
    if (!formik.isValid || formik.isSubmitting) {
      console.warn("Form is invalid or submission is in progress");
      return;
    }
  
    const { table, columns } = formik.values;

    console.log("table :",table," ","columns",columns);

    updateNodeData(id, {
      table: table,
      columns:columns
    });
  
    try {
      // Assuming you have an API URL configured
      const response = await insertTableData(dbConfig,table,columns)
  
      console.log("Insert successful:", response.data);
      
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
        id: `edge_${id}_${responseNode.id}`, // Unique edge ID
        source: id,
        sourceHandle: "sourceHandleId",
        target: responseNode.id,
        targetHandle: "targetHandleId",
      };

      addEdges([newConnection]);
    } catch (error) {
      console.error("Error inserting data:", error);
      // Optionally, show an error message
    }
  };

  return (
    <form className="card">
      <div className="card-head">
        <div className="card-title">Insert Data Card</div>
        <div
          className="card-flag-color"
          style={{
            backgroundColor: "black",
          }}
        ></div>
      </div>

      <div className="tick-line"></div>

      <div className="card-content">
        <label>Table</label>
        <Select
          value={formik.values.table}
          placeholder="Select a table"
          options={tables.map((table) => ({
            label: table,
            value: table,
          }))}
          onChange={handleTableChange}
          className="nodrag selector"
        />
        {formik.errors.table && (
          <div className="error">{formik.errors.table}</div>
        )}
      </div>

      {formik.values.table && renderColumnInputs()}

      <Button
        type="primary"
        onClick={onInsert}
        className="nodrag retrieve-btn"
      >
        Insert
      </Button>

      <Handle
        type="target"
        position="left"
        id="dbInput"
        isConnectable={connections.length < 1}
      />
      <Handle type="source" position="right" id="input" />
    </form>
  );
};

export default InsertDataCard;
