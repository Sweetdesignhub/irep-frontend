import { useState } from "react";
import { Card, Input, Button, Tag, message } from "antd";
import { MailOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SendEmailCard({ onSave }) {
  const [emailConfig, setEmailConfig] = useState({
    senderEmail: "",
    subject: "",
    // body: "",
    // variables: [],
    // newVariable: "",
  });

  const handleVariableAdd = () => {
    if (
      emailConfig.newVariable.trim() &&
      !emailConfig.variables.includes(emailConfig.newVariable)
    ) {
      setEmailConfig((prev) => ({
        ...prev,
        variables: [...prev.variables, emailConfig.newVariable],
        newVariable: "",
      }));
      message.success("Variable added successfully!");
    } else {
      message.error("Variable cannot be empty or duplicate!");
    }
  };

  const handleSaveTemplate = () => {
    if (
      !emailConfig.senderEmail.trim() ||
      !emailConfig.subject.trim()
      // ||
      // !emailConfig.body.trim()
    ) {
      message.error("Sender email, subjectcannot be empty!");
      return;
    }

    // Callback to parent (NotificationNode)
    onSave(emailConfig);
    message.success("Email template saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg p-4 min-w-[350px] border shadow-lg">
      <Card
        title={
          <div className="flex items-center gap-2">
            <MailOutlined className="text-blue-500" /> Send Email
          </div>
        }
      >
        <Input
          placeholder="Sender's Email"
          value={emailConfig.senderEmail}
          onChange={(e) =>
            setEmailConfig({ ...emailConfig, senderEmail: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Email Subject"
          value={emailConfig.subject}
          onChange={(e) =>
            setEmailConfig({ ...emailConfig, subject: e.target.value })
          }
          className="mb-2"
        />
        {/* <div className="mb-2">
          <p className="text-gray-600">Available Variables:</p>
          {emailConfig.variables.map((variable, index) => (
            <Tag key={index} className="mr-1">{`{{${variable}}}`}</Tag>
          ))}
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add Variable"
              value={emailConfig.newVariable}
              onChange={(e) =>
                setEmailConfig({ ...emailConfig, newVariable: e.target.value })
              }
            />
            <Button icon={<PlusOutlined />} onClick={handleVariableAdd} />
          </div>
        </div> */}
        {/* <ReactQuill
          value={emailConfig.body}
          onChange={(value) => setEmailConfig({ ...emailConfig, body: value })}
          className="mb-4 nodrag"
        /> */}
        <Button type="primary" block onClick={handleSaveTemplate}>
          Save Template
        </Button>
      </Card>
    </div>
  );
}
