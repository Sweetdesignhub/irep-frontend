
import React, { useContext ,useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select,Button, Input } from "antd";
import { Handle, useHandleConnections, useReactFlow } from "@xyflow/react";
import "../node.css";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
import { transformTableData } from "../../../../services/database.services";

const { Option } = Select;

const TransformDataCard = ({id, data }) => {
  const { getNode,addNodes ,updateNodeData } = useReactFlow();
  const {dbConfig} = useContext(DbConfigContext);
  
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
   
  console.log("columnsData --> ",columnsData);

  const formik = useFormik({
    initialValues: {
      tableName: "",
      aggregationType: "",
      operation: "",
      columnName: "",
    },
    validationSchema: Yup.object({
      tableName: Yup.string().required("Table name is required"),
      aggregationType: Yup.string().required("Aggregation type is required"),
      operation: Yup.string().required("Operation is required"),
      columnName: Yup.string().required("Column name is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values); // Pass the form values to the parent component or handler
    },
  });

  const onTransform = async () => {
    if (!formik.isValid || formik.isSubmitting) {
      console.warn("Form is invalid or submission is in progress");
      return;
    }
  
    const {tableName,aggregationType,operation,columnName} = formik.values;

    updateNodeData(id, {
      tableName,aggregationType,operation,columnName
    });
  
    try {
      // Assuming you have an API URL configured
      const response = await transformTableData(dbConfig,tableName,aggregationType,operation,columnName)
  
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
    <form onSubmit={formik.handleSubmit} className="card">
        <div className="card-head">
          <div className="card-title">Transform Data Card</div>
          <div
            className="card-flag-color"
            style={{
              backgroundColor: "black",
            }}
          ></div>
        </div>

        <div className="tick-line"></div>

        <div className="card-content">
          {/* Select Table Name */}
          <div>
            <label className="label">Select Table Name</label>
            
            <Select
              value={formik.values.table}
              placeholder="Select a table"
              options={tables.map((table) => ({
                label: table,
                value: table,
              }))}
              onChange={(value) => formik.setFieldValue("tableName", value)}
              className="nodrag selector"
            />
            {formik.touched.tableName && formik.errors.tableName ? (
              <div className="error">{formik.errors.tableName}</div>
            ) : null}
          </div>

          {/* Select Aggregation Type */}
          <div>
            <label className="label">Select Aggregation Type</label>
            <Select
              className="nodrag selector"
              placeholder="Select Aggregation"
              onChange={(value) => formik.setFieldValue("aggregationType", value)}
              value={formik.values.aggregationType}
              options={[
                {
                  label:"Aggregate Function",
                  value:"aggregate",
                }
              ]}
            />
            
            {formik.touched.aggregationType && formik.errors.aggregationType ? (
              <div className="error">{formik.errors.aggregationType}</div>
            ) : null}
          </div>

          {/* Select Operation */}
          <div>
            <label className="label">Select Operation</label>
            <Select
              className="input-field"
              placeholder="Select Operation"
              onChange={(value) => formik.setFieldValue("operation", value)}
              value={formik.values.operation}
              options={[
                {
                  label:"MIN",
                  value:"min",
                },{
                  label:"MAX",
                  value:"max",
                },
                {
                  label:"COUNT",
                  value:"count",
                },{
                  label:"SUM",
                  value:"sum",
                },{
                  label:"AVG",
                  value:"avg",
                }
              ]}
            />
            {formik.touched.operation && formik.errors.operation ? (
              <div className="error">{formik.errors.operation}</div>
            ) : null}
          </div>

          {/* Select Column Name */}
          <div>
            <label className="label">Select Column Name</label>
            <Select
              placeholder="Select Column"
              onChange={(value) => formik.setFieldValue("columnName", value)}
              className="nodrag selector"
              value={formik.values.columnName}
              options={
                columnsData[formik.values.tableName]?.map((col) => ({
                  label: col.column_name,
                  value: col.column_name,
                })) || []
              }
            />
            {formik.touched.columnName && formik.errors.columnName ? (
              <div className="error">{formik.errors.columnName}</div>
            ) : null}
          </div>
        </div>

        <Button
            type="primary"
            onClick={onTransform}
            className="nodrag retrieve-btn"
          >
            Transform
          </Button>
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
    </form>
  );
};

export default TransformDataCard;
