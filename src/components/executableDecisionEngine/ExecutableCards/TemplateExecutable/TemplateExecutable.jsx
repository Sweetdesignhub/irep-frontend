import React, { useEffect } from "react";
import { Card, Tag, Divider } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

const TemplateExecutable = ({ data }) => {
  // Default appraisal template if no emailConfig is provided
  const defaultAppraisalTemplate = {
    name: "Employee Appraisal Notification",
    content: `
      <h3>Salary Adjustment Notification</h3>
      <p>Dear {{name}},</p>
      <p>We are pleased to inform you about your salary revision following your recent performance appraisal.</p>
      
      <p><strong>Details:</strong></p>
      <ul>
        <li>Department: {{department}}</li>
        <li>New Salary: {{newSalary}}</li>
      </ul>
      
      <p>This adjustment will be reflected in your next paycheck.</p>
      <p>Congratulations on your achievements!</p>
      
      <p>Best regards,<br/>
      HR Department</p>
    `,
    variables: [
      { name: "name", description: "Employee's full name" },
      { name: "department", description: "Employee's department" },
      { name: "newSalary", description: "New salary amount" },
    ],
  };

  const { emailConfig = defaultAppraisalTemplate } = data;
  const { name, content, variables } = emailConfig;

  // Automatically trigger onAnswer callback when component mounts
  useEffect(() => {
    if (data.onAnswer) {
      const templateConfig = {
        templateName: name,
        templateContent: content,
        templateVariables: variables,
        // You can add more template-related properties here if needed
        timestamp: new Date().toISOString(),
      };

      data.onAnswer(templateConfig);
    }
  }, [data, name, content, variables]);

  // Quill modules to disable editing
  const modules = {
    toolbar: false,
  };

  return (
    <div className="relative">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />

      <Card
        title={<span className="text-xl font-semibold">{name}</span>}
        className="max-w-3xl w-full shadow-lg "
      >
        <div className="space-y-6">
          <div>
            <Divider orientation="left" className="text-gray-500">
              Variables
            </Divider>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable, index) => (
                <Tag key={index} color="blue" className="px-3 py-1 text-sm">
                  <span className="font-mono">{`{{${variable.name}}}`}</span>
                  {variable.description && (
                    <span className="ml-2 text-gray-500">
                      {variable.description}
                    </span>
                  )}
                </Tag>
              ))}
            </div>
          </div>

          <Divider orientation="left" className="text-gray-500">
            Content Preview
          </Divider>

          <Card
            bordered={false}
            className="p-0 border border-gray-200 rounded-lg"
            bodyStyle={{ padding: 0 }}
          >
            <ReactQuill
              theme="snow"
              value={content}
              readOnly={true}
              modules={modules}
              className="[&_.ql-editor]:min-h-[200px] [&_.ql-container]:border-0"
            />
          </Card>
        </div>
      </Card>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
};

export default TemplateExecutable;
