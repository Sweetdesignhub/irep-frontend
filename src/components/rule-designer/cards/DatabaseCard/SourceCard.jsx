// SourceCard.jsx
import React, { useContext, useEffect, useState } from "react";
import { Input, Form, Button, Card } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Handle, useReactFlow } from "@xyflow/react";
import "../node.css";
import { fetchDbData } from "../../../../services/database.services";
import { DbConfigContext } from "../../../../contexts/DbConfigContext";
import { DatabaseOutlined } from "@ant-design/icons";
import DatabaseCardsIcon from "../../../../assets/DatabaseCardsIcon.svg";
import InfoButton from "../../../../ui/InfoButton/InfoButton";

const validationSchema = Yup.object().shape({
  host: Yup.string().required("Host is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  database: Yup.string().required("Database name is required"),
  port: Yup.number().required("Port is required").positive().integer(),
});

const SourceCard = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Database Card");

  const { setConfig, gotDatabaseDetails } = useContext(DbConfigContext);
  const { setNodes } = useReactFlow();

  const [apiData, setApiData] = useState(
    data || {
      endpoint: "",
      method: "GET",
      queryParams: "",
      token: "",
      requestBody: "",
    }
  );

  const updateNodeData = (newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      )
    );
  };
  // Function to update the local state and node data
  const updateData = (key, value) => {
    const updatedData = { ...apiData, [key]: value };
    setApiData(updatedData);
    updateNodeData(updatedData); // Update the node data
    console.log("Updated Data: ", data);
  };

  useEffect(() => {
    if (data.details && data.details.tables && data.details.columns) {
      console.log("--->", data);
      gotDatabaseDetails();
      // data.onDatabaseConfigured?.(); // Call onDatabaseConfigured if details already exist
    }
  }, [data.details]);

  return (
    <div className="w-[28vw]">
      <div
        className="flex items-center justify-between rounded-xl py-12 px-10 absolute inset-0 rounded border-[0.65px] border-transparent bg-gradient-to-t from-white  to-yellow-300 relative   mx-auto"
        style={{
          borderRadius: "12px", // Matches rounded-xl
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={DatabaseCardsIcon}
              alt="Database Card"
              className="w-16 h-16 bg-white p-1 inline-block mr-8 shadow-md rounded"
            />
            {/* Editable Title */}

            <div className="flex flex-col items-start">
              {isEditing ? (
                <Input
                  type="text"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  onBlur={handleBlur}
                  autoFocus
                  className="color-red bg-[#8C6707] text-[#8C3107]" // Apply the .titles class here
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className=" text-base text-[#8C6707] text-left cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#796006] font-semibold mr-3 font-xl cursor-pointer">
                  {"Database Card"}
                </h4>
                <InfoButton text="This is a Database Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C6707] mt-4">
            This Database Card helps you to connect with your Database{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <Card className="bg-yellow-100 border border-yellow-300 rounded-xl shadow-md p-4 font-montserrat">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DatabaseOutlined className="text-yellow-600 text-xl" />
            <h3 className="text-lg font-semibold text-yellow-900">
              {data.contentName || "Database Config"}
            </h3>
          </div>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: data.flagColor || "#888" }}
          />
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            host:
              data.details?.host ||
              "dpg-ct6nkvjtq21c73eb1erg-a.singapore-postgres.render.com",
            username: data.details?.username || "rule_engine_potgres_user",
            password:
              data.details?.password || "o4jyhEMOF46K8sRaVVJWTwepwWOg9hHq",
            database: data.details?.database || "rule_engine_potgres",
            port: data.details?.port || 5432,
          }}
          onSubmit={async (values) => {
            try {
              const details = await fetchDbData(values);

              updateNodeData(id, {
                ...data,
                details: {
                  ...values,
                  tables: details.tables,
                  columns: details.columns,
                },
              });
            } catch (error) {
              console.error("Failed to fetch database details:", error);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onFinish={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Host</label>
                <Field name="host">
                  {({ field }) => <Input {...field} placeholder="Host" />}
                </Field>
              </div>

              <div>
                <label className="text-sm text-gray-700">Username</label>
                <Field name="username">
                  {({ field }) => <Input {...field} placeholder="Username" />}
                </Field>
              </div>

              <div>
                <label className="text-sm text-gray-700">Password</label>
                <Field name="password">
                  {({ field }) => (
                    <Input.Password {...field} placeholder="Password" />
                  )}
                </Field>
              </div>

              <div>
                <label className="text-sm text-gray-700">Database</label>
                <Field name="database">
                  {({ field }) => (
                    <Input {...field} placeholder="Database Name" />
                  )}
                </Field>
              </div>

              <div>
                <label className="text-sm text-gray-700">Port</label>
                <Field name="port">
                  {({ field }) => (
                    <Input {...field} type="number" placeholder="Port" />
                  )}
                </Field>
              </div>

              <Button type="primary" htmlType="submit" className="w-full">
                Connect
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default SourceCard;
