

import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import { Button, message } from "antd";
import { Handle, useReactFlow } from "@xyflow/react";
import * as Yup from "yup";
import "../node.css";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
import { executeQuery } from "../../../../services/database.services";

const QueryDataCard = ({ id, data }) => {
  const { addNodes, addEdges, updateNodeData } = useReactFlow();
  const { dbConfig } = useContext(DbConfigContext);

  const formik = useFormik({
    initialValues: {
      query: data?.query || "",
    },
    validationSchema: Yup.object({
      query: Yup.string().required("Query is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await executeQuery(dbConfig, values.query);
        console.log("Query Result:", response);

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

        // Create and add connection between current node and response node
        const newConnection = {
          id: `edge_${id}_${responseNode.id}`, // Unique edge ID
          source: id,
          sourceHandle: "output",
          target: responseNode.id,
          targetHandle: "input",
        };

        addEdges([newConnection]);
      } catch (error) {
        // console.error("Error executing query:", error);
        message.error(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="card">
      <div className="card-head">
        <div className="card-title">{data.contentName || "Query Data Card"}</div>
        <div
          className="card-flag-color"
          style={{
            backgroundColor: data.flagColor || "black",
          }}
        ></div>
      </div>
      <div className="tick-line"></div>
      <div className="card-content">
        <label>Query</label>
        <textarea
          value={formik.values.query}
          onChange={(e) => formik.setFieldValue("query", e.target.value)}
          placeholder="Enter SQL query"
          rows={4}
          className="nodrag textarea"
        />
        {formik.errors.query && (
          <div className="error">{formik.errors.query}</div>
        )}
      </div>

      <Button
        type="primary"
        htmlType="submit"
        className="nodrag retrieve-btn"
      >
        Execute Query
      </Button>

      <Handle type="target" position="left" id="input" />
      <Handle type="source" position="right" id="output" />
    </form>
  );
};

export default QueryDataCard;
