
import React, { useState } from "react";
import { Input, Form, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import "../node.css";
import { Handle } from "@xyflow/react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useReactFlow } from "@xyflow/react"; // Import React Flow hook

const validationSchema = Yup.object().shape({
  Gender: Yup.string().required("Gender is required"),
  Payment_Information: Yup.string().required("Payment Information is required"),
  Renewal_Status: Yup.string().required("Renewal Status is required"),
  Usage_Frequency: Yup.string().required("Usage Frequency is required"),
  Favorite_Genres: Yup.string().required("Favorite Genre is required"),
  Devices_Used: Yup.string().required("Device Used is required"),
  Engagement_Metrics: Yup.string().required("Engagement Metric is required"),
  Feedback_Ratings: Yup.number()
    .required("Feedback Rating is required")
    .min(0)
    .max(5),
  Customer_Support_Interactions: Yup.number()
    .required("Customer Support Interactions are required")
    .integer()
    .min(0),
  Age: Yup.number().required("Age is required").integer().min(0),
});

const InputParameterCard = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleDoubleClick = () => setIsEditing(true);
  const [header, setHeader] = useState("Basic Card");
  const [uploadType, setUploadType] = useState("s3"); // Default to S3
  const [csvUrl, setCsvUrl] = useState("");
  const [columns, setColumns] = useState([]);
  const [target, setTarget] = useState("");
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { updateNodeData } = useReactFlow(); // Access updateNodeData from React Flow

  // Fetch CSV and parse headers
  const fetchCsvHeaders = async () => {
    console.log(uploadType, " ", file);
    setLoading(true);
    try {
      if (uploadType === "s3") {
        // Fetch from S3 URL
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true });
        setColumns(parsed.meta.fields || []);
      } else if (uploadType === "local" && file) {
        // Parse local file
        console.log("herer");
        Papa.parse(file, {
          header: true,
          complete: (result) => {
            console.log(result.meta.fields);
            setColumns(result.meta.fields || []);
          },
        });
      }
    } catch (error) {
      console.error("Error fetching CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = ({ file }) => {
    console.log("here" + " ", file.name);
    setFile(file);
  };

  return (
    <div className="w-[28vw]">
      <div
        className="flex items-center justify-between rounded-xl py-10 px-10 bg-gradient-to-t relative from-transparent via-[#EA61F6] to-[#FF29EA]  mx-auto"
        style={{
          //   borderWidth: "2px",
          //   borderStyle: "solid",
          borderRadius: "12px", // Matches rounded-xl
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={BasicCardsIcon}
              alt="Rule Card"
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
                  className="color-red bg-[#FDE6C3] text-[#8C077F]" // Apply the .titles class here
                />
              ) : (
                <h4
                  onDoubleClick={handleDoubleClick}
                  className=" text-base  text-[#8C077F] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row items-start">
                <h4 className=" text-3xl  text-[#770679] font-semibold mr-3 font-xl cursor-pointer">
                  {"Calculation Card  "}
                </h4>
                <InfoButton text="This is a Calculation Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#8C077F] mt-4">
            The Calculation Card Help You Implement basic Calculations{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">{data.contentName}</div>
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
          <Formik
            initialValues={{
              Gender: "", // Add default value
              Payment_Information: "", // Add default value
              Renewal_Status: "", // Add default value
              Usage_Frequency: "", // Add default value
              Favorite_Genres: "", // Add default value
              Devices_Used: "", // Add default value
              Engagement_Metrics: "", // Add default value
              Feedback_Ratings: 3.8, // Add default value
              Customer_Support_Interactions: 7, // Add default value
              Age: 46, // Add default value
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                console.log("values-->", values);
                updateNodeData(id, {
                  featureInput: { ...values }, // Set the form values as node data
                });
                console.log("Form submitted with values:", values, " ", id);
                data.onDatasetConfigured();
              } catch (error) {
                console.error("Failed to fetch model details:", error);
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form
                onFinish={handleSubmit}
                layout="vertical"
                className="form-style"
              >
                {/* Upload Type Selector */}
                <Form.Item label="File Upload Type">
                  <Select
                    className="nodrag"
                    value={uploadType}
                    onChange={(value) => setUploadType(value)}
                    options={[
                      { label: "S3 Pre-signed URL", value: "s3" },
                      { label: "Local File Upload", value: "local" },
                    ]}
                    placeholder="Select Upload Type"
                  />
                </Form.Item>

                {/* Conditional Rendering based on Upload Type */}
                {uploadType === "s3" ? (
                  <Form.Item label="Dataset URL">
                    <Input
                      value={csvUrl}
                      onChange={(e) => setCsvUrl(e.target.value)}
                      placeholder="Enter pre-signed CSV URL"
                    />
                  </Form.Item>
                ) : (
                  <Form.Item label="Upload Local CSV File">
                    <Upload
                      accept=".csv"
                      beforeUpload={() => false} // Prevent auto-upload
                      onChange={handleFileUpload}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                )}

                {/* Fetch Columns Button */}
                <Button
                  onClick={fetchCsvHeaders}
                  type="primary"
                  loading={loading}
                  className="nodrag save-btn"
                >
                  Fetch CSV Columns
                </Button>

                {/* Target and Feature Selectors */}
                <div className="collapse-style-scroll nodrag nowheel">
                  <Form.Item>
                    <label>Gender</label>
                    <Field name="Gender">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                          ]}
                          placeholder="Select Gender"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Gender"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Payment Information</label>
                    <Field name="Payment_Information">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Mastercard", value: "Mastercard" },
                            { label: "Visa", value: "Visa" },
                            { label: "Amex", value: "Amex" },
                          ]}
                          placeholder="Select Payment Method"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Payment_Information"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Renewal Status</label>
                    <Field name="Renewal_Status">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Manual", value: "Manual" },
                            { label: "Auto-renew", value: "Auto-renew" },
                          ]}
                          placeholder="Select Renewal Status"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Renewal_Status"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Usage Frequency</label>
                    <Field name="Usage_Frequency">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Regular", value: "Regular" },
                            { label: "Frequent", value: "Frequent" },
                            { label: "Occasional", value: "Occasional" },
                          ]}
                          placeholder="Select Usage Frequency"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Usage_Frequency"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Favorite Genres</label>
                    <Field name="Favorite_Genres">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Action", value: "Action" },
                            { label: "Drama", value: "Drama" },
                            { label: "Comedy", value: "Comedy" },
                          ]}
                          placeholder="Select Favorite Genre"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Favorite_Genres"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Devices Used</label>
                    <Field name="Devices_Used">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Mobile", value: "Mobile" },
                            { label: "Desktop", value: "Desktop" },
                            { label: "Tablet", value: "Tablet" },
                            { label: "Smart TV", value: "Smart TV" },
                            { label: "Smartphone", value: "Smartphone" },
                          ]}
                          placeholder="Select Device Used"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Devices_Used"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Engagement Metrics</label>
                    <Field name="Engagement_Metrics">
                      {({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "High", value: "High" },
                            { label: "Medium", value: "Medium" },
                            { label: "Low", value: "Low" },
                          ]}
                          placeholder="Select Engagement Metric"
                          onChange={(value) =>
                            field.onChange({
                              target: { name: field.name, value },
                            })
                          }
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Engagement_Metrics"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Feedback Ratings</label>
                    <Field name="Feedback_Ratings">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter Feedback Rating"
                          className="nodrag"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Feedback_Ratings"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Customer Support Interactions</label>
                    <Field name="Customer_Support_Interactions">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter Support Interactions"
                          className="nodrag"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Customer_Support_Interactions"
                      component="div"
                      className="error"
                    />
                  </Form.Item>

                  <Form.Item>
                    <label>Age</label>
                    <Field name="Age">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter Age"
                          className="nodrag"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="Age"
                      component="div"
                      className="error"
                    />
                  </Form.Item>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="nodrag save-btn"
                >
                  submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <Handle
          type="source"
          position="right"
          id="output"
          style={{ background: "#555" }}
        />
      </div>
    </div>
  );
};

export default InputParameterCard;
