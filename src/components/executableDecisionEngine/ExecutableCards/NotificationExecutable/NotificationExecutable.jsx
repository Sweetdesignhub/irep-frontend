import React, { useState, useEffect } from "react";
import { Card, Alert, Table, Button, Radio, Input, message } from "antd";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import axios from "axios";

const NotificationExecutable = ({ data, id }) => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("individual");
  const [groupEmails, setGroupEmails] = useState("");
  const [variableValues, setVariableValues] = useState([]);
  console.log("Notification Data: ", data);
  useEffect(() => {
    if (
      data?.basicCalculationDetails?.calculatedResults &&
      data?.templateConfig?.templateVariables
    ) {
      const extractedValues =
        data.basicCalculationDetails.calculatedResults.map((item) => {
          const values = {};
          data.templateConfig.templateVariables.forEach((variable) => {
            values[variable.name] = item[variable.name] || "N/A";
          });
          return {
            ...values,
            email: item.email,
          };
        });
      setVariableValues(extractedValues);
    }
  }, [data]);

  const sendEmails = async () => {
    if (!data?.templateConfig || !data?.emailConfig?.subject) {
      message.error("Template configuration or email subject is missing");
      return;
    }

    setLoading(true);

    try {
      if (selectedOption === "individual") {
        // Send individual appraisal emails
        const responses = await Promise.all(
          data.basicCalculationDetails.calculatedResults.map(
            async (employee) => {
              const payload = {
                recipientEmail: employee.email,
                emailSubject: data.emailConfig.subject,
                emailBody: data.templateConfig.templateContent,
                variables: data.templateConfig.templateVariables.reduce(
                  (acc, variable) => {
                    acc[variable.name] = employee[variable.name] || "";
                    return acc;
                  },
                  {}
                ),
              };
              const host =
                import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
              const response = await axios.post(
                `${host}/rules/notificationCard/appraisal`,
                payload
              );
              return response.data;
            }
          )
        );

        message.success(`Sent ${responses.length} appraisal emails`);
      } else {
        // Send group report email
        const emails = groupEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
        if (emails.length === 0) {
          message.error("Please enter at least one group email");
          return;
        }

        const payload = {
          recipientEmail: emails.join(","),
          emailSubject: `${data.emailConfig.subject} - Group Report`,
          emailBody: `
            <h1>Employee Appraisal Report</h1>
            <pre>${JSON.stringify(
              data.basicCalculationDetails.calculatedResults,
              null,
              2
            )}</pre>
          `,
          sendAsHTML: true,
        };
        const host =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
        const response = await axios.post(
          `${host}/rules/notificationCard/single`,
          payload
        );

        message.success(`Sent report to ${emails.length} recipients`);
      }

      if (typeof data.onAnswer === "function") {
        data.onAnswer({
          status: "sent",
          nodeId: id,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
      message.error(
        `Failed to send emails: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    ...(data?.templateConfig?.templateVariables || []).map((variable) => ({
      title: variable.name,
      dataIndex: variable.name,
      key: variable.name,
      render: (text) => (typeof text === "number" ? text.toFixed(2) : text),
    })),
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <Card
      title="Email Notification"
      className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-sm"
    >
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div className="p-4">
        {!data?.basicCalculationDetails?.calculatedResults ? (
          <Alert
            message="Missing Data"
            description="No calculated results available"
            type="warning"
            showIcon
          />
        ) : !data?.templateConfig ? (
          <Alert
            message="Missing Template Configuration"
            description="No template configuration provided"
            type="warning"
            showIcon
          />
        ) : !data?.emailConfig?.subject ? (
          <Alert
            message="Missing Email Subject"
            description="No email subject provided"
            type="warning"
            showIcon
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Email Template Variables</h3>
              <Table
                columns={columns}
                dataSource={variableValues}
                rowKey="email"
                pagination={{ pageSize: 3 }}
                size="small"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium mb-2">Send Options</h3>
              <Radio.Group
                onChange={(e) => setSelectedOption(e.target.value)}
                value={selectedOption}
                className="mb-4"
              >
                <Radio value="individual">
                  Send individual appraisal emails
                </Radio>
                <Radio value="group">Send complete report to group</Radio>
              </Radio.Group>

              {selectedOption === "group" && (
                <div className="mt-2">
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter recipient emails, separated by commas"
                    value={groupEmails}
                    onChange={(e) => setGroupEmails(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter email addresses separated by commas
                  </p>
                </div>
              )}

              <Button
                type="primary"
                onClick={sendEmails}
                loading={loading}
                className="mt-4"
              >
                {selectedOption === "individual"
                  ? "Send Appraisal Emails"
                  : "Send Group Report"}
              </Button>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium mb-2">Email Preview</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.templateConfig.templateContent
                    .replace("{{name}}", "John Doe")
                    .replace("{{department}}", "IT")
                    .replace("{{newSalary}}", "106,936"),
                }}
              />
            </div>
          </div>
        )}
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </Card>
  );
};

export default NotificationExecutable;
