

import { useCallback, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { Select, Input , Button } from "antd";
import * as Yup from "yup";
import { Handle, useReactFlow, useHandleConnections } from "@xyflow/react";
import "../node.css";
import { deleteTableData } from "../../../../services/database.services";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
const RetrieveDataCard = ({ id, data }) => {
  const { getNode, addNodes, addEdges, updateNodeData } = useReactFlow();
  const { dbConfig } = useContext(DbConfigContext);

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
  const columns = sourceNodeData?.data?.details?.columns || [];

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      table: data?.table || "",
      columns: data?.columns || [],
      conditionColumn: data?.conditionColumn || "",
      conditionValue: data?.conditionValue || "",
    },
    validationSchema: Yup.object({
      table: Yup.string().required("Table is required"),
      columns: Yup.array().required("Select at least one column"),
      conditionColumn: Yup.string().required("Condition column is required"),
      conditionValue: Yup.string().required("Condition value is required"),
    }),
    // onSubmit: (values) => data.onSave(values),
    onSubmit: (values) => {
      console.log("Submit");

      console.log(values.table, " <-->", values.columns);

      updateNodeData(id, {
        table: values.table,
        columns: values.columns,
        databaseDetails: sourceNodeData?.data?.details,
      });

      console.log("Updated ", values);
    },
  });

  const onDelete = async () => {
    const { table, conditionColumn, conditionValue } = formik.values;
    console.log("dbConfig -->", dbConfig);

    if (!table || !conditionColumn || !conditionValue) {
      alert("Please check the form");
      return;
    }

    updateNodeData(id, {
      table: table,
      conditionColumn: conditionColumn,
      conditionValue:conditionValue,
      databaseDetails: sourceNodeData?.data?.details,
    });

    try {
      const response = await deleteTableData(dbConfig, table,conditionColumn ,conditionValue);
      // setRetrievedData(response); // Store the retrieved data in state
      console.log("Retrieved data:", response);

      // Create a response node
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
      console.error("Error fetching data:", error);
      alert("Failed to retrieve data.");
    }
  };

  const handleConditionColumnChange = (value) => {
    formik.setFieldValue("conditionColumn", value);
  };


  return (
    <form onSubmit={formik.handleSubmit} className="card">
      <div className="card-head">
        <div className="card-title">Delete Card</div>
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
        <label>Table</label>

        <Select
          value={formik.values.table}
          placeholder="Enter the Table name"
          options={tables.map((table) => ({
            label: table,
            value: table,
          }))}
          onChange={(value) => formik.setFieldValue("table", value)}
          className="nodrag selector"
        />

        {formik.errors.table && (
          <div className="error">{formik.errors.table}</div>
        )}
      </div>

      <div>
        <label>Condition Column</label>
        <Select
          value={formik.values.conditionColumn}
          placeholder="Select condition column"
          options={
            columns[formik.values.table]?.map((col) => ({
              label: col.column_name,
              value: col.column_name,
            })) || []
          }
          onChange={handleConditionColumnChange}
          className="nodrag selector"
        />
        {formik.errors.conditionColumn && (
          <div className="error">{formik.errors.conditionColumn}</div>
        )}
      </div>

      <div>
        <label>Condition Value</label>
        <Input
          value={formik.values.conditionValue}
          onChange={(e) =>
            formik.setFieldValue("conditionValue", e.target.value)
          }
          placeholder="Enter condition value"
        />
        {formik.errors.conditionValue && (
          <div className="error">{formik.errors.conditionValue}</div>
        )}
      </div>

      <Button
        type="primary"
        onClick={onDelete}
        className="nodrag retrieve-btn"
      >
        Delete
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

export default RetrieveDataCard;
