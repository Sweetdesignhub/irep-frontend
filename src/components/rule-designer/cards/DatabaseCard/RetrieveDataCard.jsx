import { useCallback, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { Select, Space, Button, Input } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import * as Yup from "yup";
import { Handle, useReactFlow, useHandleConnections } from "@xyflow/react";
import "../node.css";
import { fetchTableData } from "../../../../services/database.services";
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
    initialValues: {
      table: data?.table || "",
      columns: data?.columns || [],
      conditions: [
        {
          conditionColumn: "",
          conditionType: "",
          conditionValue: "",
        },
      ],
      limit: "", // Added limit field
    },
    validationSchema: Yup.object({
      table: Yup.string().required("Table is required"),
      columns: Yup.array().required("Select at least one column"),
      conditions: Yup.array()
        .of(
          Yup.object({
            conditionColumn: Yup.string().required("Condition column is required"),
            conditionType: Yup.string().required("Condition type is required"),
            conditionValue: Yup.string().required("Condition value is required"),
          })
        )
        .min(1, "At least one condition is required"),
      limit: Yup.number().positive().integer().nullable(), // Validate the limit field
    }),
    // onSubmit: (values) => {
    //   console.log("Submit", values);
    //   updateNodeData(id, {
    //     table: values.table,
    //     columns: values.columns,
    //     conditions: values.conditions,
    //     limit: values.limit, // Store the limit value
    //     databaseDetails: sourceNodeData?.data?.details,
    //   });
    // },
  });

  const onSubmit = async () =>{
    const values = formik.values;

    console.log("Formik Submit Triggered!");
      console.log(values); // Check if the values are correctly passed
      updateNodeData(id, {
        table: values.table,
        columns: values.columns,
        conditions: values.conditions,
        limit: values.limit, // Store the limit value
        databaseDetails: sourceNodeData?.data?.details,
      });
      console.log("Updated", values);
  }
  

  const onRetrieve = async () => {
    const { table, columns, conditions, limit } = formik.values;
    console.log("dbConfig -->", dbConfig);

    if (!table || columns.length === 0) {
      alert("Please select a table and at least one column.");
      return;
    }

    updateNodeData(id, {
      table: table,
      columns: columns,
      conditions: conditions,
      limit: limit, // Include limit in node data
      databaseDetails: sourceNodeData?.data?.details,
    });

    try {
      const response = await fetchTableData(dbConfig, table, columns, conditions, limit); // Pass limit to the API

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

  // Add new condition
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
    <form onSubmit={formik.handleSubmit} className="card">
      <div className="card-head">
        <div className="card-title">{data.contentName}</div>
        <div
          className="card-flag-color"
          style={{
            backgroundColor: data.flagColor,
          }}
        ></div>
      </div>
      <div className="tick-line"></div>

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
        {formik.errors.table && <div className="error">{formik.errors.table}</div>}
      </div>

      <div className="card-content">
        <label>Columns</label>
        <Select
          value={formik.values.columns}
          mode="multiple"
          placeholder="Enter the Column name"
          options={
            columns[formik.values.table]?.map((col) => ({
              label: col.column_name,
              value: col.column_name,
            })) || []
          }
          onChange={(value) => formik.setFieldValue("columns", value)}
          className="nodrag selector"
        />
        {formik.errors.columns && <div className="error">{formik.errors.columns}</div>}
      </div>

      <div className="card-content">
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
                // Add more condition types if needed
              ]}
              onChange={(value) =>
                formik.setFieldValue(`conditions[${index}].conditionType`, value)
              }
              className="nodrag selector"
            />
            <Input
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
        
      <div className="card-content">
        <label>Limit</label>
        <Input
          type="number"
          value={formik.values.limit}
          onChange={(e) => formik.setFieldValue("limit", e.target.value)}
          placeholder="Enter limit (optional)"
        />
        {formik.errors.limit && <div className="error">{formik.errors.limit}</div>}
      </div>

      <button className="nodrag save-btn" type="submit" 
        onClick={onSubmit}>
        Save
      </button>
      <Button
        type="primary"
        onClick={onRetrieve}
        className="nodrag retrieve-btn"
      >
        Retrieve
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
