import React, { useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Input, Button } from "antd"; // Ant Design components
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Handle, useReactFlow, useHandleConnections } from "@xyflow/react";
import "../node.css"; // Assuming styles are defined here
import { updateTableData } from "../../../../services/database.services"; // Adjust import as per actual path
import { DbConfigContext } from "../../../../contexts/DbConfigContext";

const UpdateDataCard = ({ id, data }) => {
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
    initialValues: {
      table: data?.table || "",
      columnsToUpdate: data?.columnsToUpdate || [{ column: "", newValue: "" }],
      conditions: [
        {
          conditionColumn: "",
          conditionType: "",
          conditionValue: "",
        },
      ],
    },
    validationSchema: Yup.object({
      table: Yup.string().required("Table is required"),
      columnsToUpdate: Yup.array()
        .of(
          Yup.object({
            column: Yup.string().required("Column is required"),
            newValue: Yup.string().required("New value is required"),
          })
        )
        .min(1, "At least one column is required to update"),
      conditions: Yup.array()
        .of(
          Yup.object({
            conditionColumn: Yup.string().required("Condition column is required"),
            conditionType: Yup.string().required("Condition type is required"),
            conditionValue: Yup.string().required("Condition value is required"),
          })
        )
        .min(1, "At least one condition is required"),
    }),
    onSubmit: (values) => {
      console.log("Submit", values);
      updateNodeData(id, {
        table: values.table,
        columns: values.columnsToUpdate,
        conditions: values.conditions,
        databaseDetails: sourceNodeData?.data?.details,
      });
    },
  });

  const onUpdate = async () => {
    const { table, columnsToUpdate, conditions,conditionType } = formik.values;
    console.log("dbConfig -->", dbConfig);

    if (!table || columns?.length === 0) {
      alert("Please select a table and at least one column.");
      return;
    }

    updateNodeData(id, {
      table: table,
      columns: columnsToUpdate,
      conditions: conditions,
      databaseDetails: sourceNodeData?.data?.details,
    });

    try {
      const response = await updateTableData(dbConfig, table, columnsToUpdate,conditionType, conditions);
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
        id: `edge_${id}_${responseNode.id}`,
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

  // Add new column to update
  const addColumn = () => {
    formik.setFieldValue("columnsToUpdate", [
      ...formik.values.columnsToUpdate,
      { column: "", newValue: "" },
    ]);
  };

  // Remove a column to update
  const removeColumn = (index) => {
    const updatedColumns = formik.values.columnsToUpdate.filter((_, i) => i !== index);
    formik.setFieldValue("columnsToUpdate", updatedColumns);
  };

  // Add a new condition
  const addCondition = () => {
    formik.setFieldValue("conditions", [
      ...formik.values.conditions,
      { conditionColumn: "", conditionType: "", conditionValue: "" },
    ]);
  };

  // Remove a condition
  const removeCondition = (index) => {
    const updatedConditions = formik.values.conditions.filter((_, i) => i !== index);
    formik.setFieldValue("conditions", updatedConditions);
  };

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Update Data Card</div>
        <div className="card-flag-color" style={{ backgroundColor: "black" }}></div>
      </div>

      <div className="tick-line"></div>

      <div className="card-content">
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label>Table</label>
            <Select
              value={formik.values.table}
              placeholder="Select a table"
              options={tables.map((table) => ({
                label: table,
                value: table,
              }))}
              onChange={(value) => formik.setFieldValue("table", value)}
              className="nodrag selector"
            />
            {formik.errors.table && <div className="error">{formik.errors.table}</div>}
          </div>

          <div>
          <label>Columns to Update</label>
            {formik.values.columnsToUpdate.map((col, index) => (
              <div key={index} className="condition-group">
                <Select
                  value={col.column}
                  placeholder="Select column"
                  options={
                    columns[formik.values.table]?.map((col) => ({
                      label: col.column_name,
                      value: col.column_name,
                    })) || []
                  }
                  onChange={(value) =>
                    formik.setFieldValue(`columnsToUpdate[${index}].column`, value)
                  }
                  className="nodrag selector"
                />
                <Input
                  value={col.newValue}
                  onChange={(e) =>
                    formik.setFieldValue(`columnsToUpdate[${index}].newValue`, e.target.value)
                  }
                  placeholder="Enter new value"
                />
                <Button
              disabled={index==0}
                  onClick={() => removeColumn(index)}
                  className="remove-column-btn"
                  shape="circle"
                  icon={<MinusOutlined />}
                />
              </div>
            ))}
            <Button
              onClick={addColumn}
              className="add-condition-btn"
              shape="circle"
              icon={<PlusOutlined />}
            />
          </div>

          <div>
            <label>Conditions</label>
            {formik.values.conditions.map((condition, index) => (
              <div key={index} className="condition-group">
                <Select
                  value={condition.conditionColumn}
                  placeholder="Select condition column"
                  options={
                    columns[formik.values.table]?.map((col) => ({
                      label: col.column_name,
                      value: col.column_name,
                    })) || []
                  }
                  onChange={(value) =>
                    formik.setFieldValue(`conditions[${index}].conditionColumn`, value)
                  }
                  className="nodrag selector"
                />
                <Select
                  value={condition.conditionType}
                  placeholder="Select condition type"
                  options={[
                    { label: "Equals", value: "equals" },
                    { label: "Not Equals", value: "notEquals" },
                    // Add other options here
                  ]}
                  onChange={(value) =>
                    formik.setFieldValue(`conditions[${index}].conditionType`, value)
                  }
                  className="nodrag selector"
                />
                <Input
                  className="nodrag input"
                  value={condition.conditionValue}
                  onChange={(e) =>
                    formik.setFieldValue(`conditions[${index}].conditionValue`, e.target.value)
                  }
                  placeholder="Enter condition value"
                />
                <Button
              disabled={index==0}
                  onClick={() => removeCondition(index)}
                  className="remove-condition-btn"
                  shape="circle"
                  icon={<MinusOutlined />}
                />
              </div>
            ))}
            <Button
              onClick={addCondition}
              className="add-condition-btn"
              shape="circle"
              icon={<PlusOutlined />}
            />
          </div>

          <Button
            type="primary"
            onClick={onUpdate}
            className="nodrag retrieve-btn"
          >
            Retrieve
          </Button>
        </form>
      </div>

      <Handle
        type="target"
        position="left"
        id="dbInput"
        isConnectable={connections.length < 1}
      />
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default UpdateDataCard;
