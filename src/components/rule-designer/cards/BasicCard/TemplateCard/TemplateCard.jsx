import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Save, Trash2, Copy, RefreshCw, List, Plus, X } from "lucide-react";
import HeaderDesignCard from "../../HeaderDesignCard/HeaderDesignCard";
import BasicCardsIcon from "../../../../../assets/BasicCardsIcon.svg";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";
import { message } from "antd";
import ReportGenerator from "./ReportGenerator";

// Predefined templates
const predefinedTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    variables: [{ name: "name", description: "Recipient's name" }],
    content:
      "<h3>Welcome to Our Service!</h3><p>Dear {{name}},</p><p>Thank you for joining our platform. We're excited to have you onboard.</p><p>Best regards,<br/>The Team</p>",
  },
  {
    id: "followup",
    name: "Follow-up Email",
    variables: [
      { name: "name", description: "Recipient's name" },
      { name: "topic", description: "Discussion topic" },
    ],
    content:
      "<h3>Following Up</h3><p>Dear {{name}},</p><p>I wanted to follow up on our previous conversation about {{topic}}.</p><p>Looking forward to your response,<br/>The Team</p>",
  },
  {
    id: "reminder",
    name: "Reminder Email",
    variables: [
      { name: "name", description: "Recipient's name" },
      { name: "event", description: "Event name" },
      { name: "date", description: "Event date" },
    ],
    content:
      "<h3>Friendly Reminder</h3><p>Dear {{name}},</p><p>This is a friendly reminder about {{event}} scheduled for {{date}}.</p><p>Regards,<br/>The Team</p>",
  },
];

const TemplateCard = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [templateName, setTemplateName] = useState(
    data.emailConfig?.name || ""
  );
  const [templateContent, setTemplateContent] = useState(
    data.emailConfig?.content || ""
  );
  const [variables, setVariables] = useState(data.emailConfig?.variables || []);
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableDesc, setNewVariableDesc] = useState("");
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [showAddVariable, setShowAddVariable] = useState(false);

  // Load saved templates from localStorage
  useEffect(() => {
    const loadSavedTemplates = () => {
      try {
        const templates =
          JSON.parse(localStorage.getItem("emailTemplates")) || [];
        setSavedTemplates(templates);
      } catch (error) {
        console.error("Error loading templates:", error);
        setSavedTemplates([]);
      }
    };

    loadSavedTemplates();
  }, []);

  // Save template to localStorage and node data
  const saveTemplate = () => {
    if (!templateName.trim()) {
      message.error("Please provide a template name");
      return;
    }

    const emailConfig = {
      name: templateName,
      content: templateContent,
      variables: variables,
      updatedAt: new Date().toISOString(),
    };

    // Update node data
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, emailConfig } } : node
      )
    );

    // Save to localStorage
    const existingTemplates =
      JSON.parse(localStorage.getItem("emailTemplates")) || [];
    const templateIndex = existingTemplates.findIndex((t) => t.id === id);

    if (templateIndex >= 0) {
      existingTemplates[templateIndex] = { id, ...emailConfig };
    } else {
      existingTemplates.push({ id, ...emailConfig });
    }

    localStorage.setItem("emailTemplates", JSON.stringify(existingTemplates));
    setSavedTemplates(existingTemplates);
    message.success("Template saved successfully!");
    // alert("Template saved successfully!");
  };

  // Load a predefined or saved template
  const loadTemplate = (template) => {
    setTemplateName(template.name);
    setTemplateContent(template.content);
    setVariables(template.variables || []);
    setShowTemplateList(false);
  };

  // Reset the editor
  const resetTemplate = () => {
    setTemplateName("");
    setTemplateContent("");
    setVariables([]);
  };

  // Duplicate the current template
  const duplicateTemplate = () => {
    const newName = `${templateName} (Copy)`;

    const emailConfig = {
      name: newName,
      content: templateContent,
      variables: variables,
      updatedAt: new Date().toISOString(),
    };

    // Create a new template ID
    const newId = `template-${Date.now()}`;

    // Save to localStorage
    const existingTemplates =
      JSON.parse(localStorage.getItem("emailTemplates")) || [];
    existingTemplates.push({ id: newId, ...emailConfig });
    localStorage.setItem("emailTemplates", JSON.stringify(existingTemplates));

    setSavedTemplates(existingTemplates);
    setTemplateName(newName);
    message.success("Template saved successfully!");
  };

  // Delete a template
  const deleteTemplate = () => {
    if (confirm("Are you sure you want to delete this template?")) {
      // Remove from localStorage
      const existingTemplates =
        JSON.parse(localStorage.getItem("emailTemplates")) || [];
      const filteredTemplates = existingTemplates.filter((t) => t.id !== id);
      localStorage.setItem("emailTemplates", JSON.stringify(filteredTemplates));

      setSavedTemplates(filteredTemplates);
      resetTemplate();

      // Clear node data
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, emailConfig: null } }
            : node
        )
      );
    }
  };

  // Add a new variable
  const addVariable = () => {
    if (!newVariableName.trim()) {
      message.error("Please enter a variable name");
      return;
    }

    // Check if variable already exists
    if (variables.some((v) => v.name === newVariableName)) {
      message.error("Variable with this name already exists");
      return;
    }

    const newVariable = {
      name: newVariableName,
      description: newVariableDesc,
    };

    setVariables([...variables, newVariable]);
    setNewVariableName("");
    setNewVariableDesc("");
    setShowAddVariable(false);
  };

  // Remove a variable
  const removeVariable = (varName) => {
    setVariables(variables.filter((v) => v.name !== varName));
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link"],
        ["clean"],
      ],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
  ];

  return (
    <div className="rounded-lg px-4 w-full max-w-md">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <HeaderDesignCard
        gradientColors={["#00000000", "#EA61F6", "#FF29EA"]}
        iconSrc={BasicCardsIcon}
        initialHeader="Basic Card"
        titleText="Template Card"
        helperText="Generate a Template for your use case"
        infoButtonText="Learn more about Report"
        primaryTextColor="#8C077F"
        titleTextColor="#770679"
      />
      <div className="px-4 bg-white py-4">
        <div className="mb-4 flex bg-white justify-between px-2 items-center">
          <h3 className="text-lg font-semibold">Email Template</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplateList(!showTemplateList)}
              className="p-2 rounded hover:bg-gray-100"
              title="Load Template"
            >
              <List size={16} />
            </button>
            <button
              onClick={resetTemplate}
              className="p-2 rounded hover:bg-gray-100"
              title="Reset"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={duplicateTemplate}
              className="p-2 rounded hover:bg-gray-100"
              title="Duplicate Template"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={deleteTemplate}
              className="p-2 rounded hover:bg-gray-100 text-red-500"
              title="Delete Template"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {showTemplateList && (
          <div className="mb-4 p-2 border rounded bg-gray-50">
            <h4 className="font-medium mb-2">Predefined Templates</h4>
            <div className="divide-y">
              {predefinedTemplates.map((template) => (
                <div
                  key={template.id}
                  className="py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
                  onClick={() => loadTemplate(template)}
                >
                  {template.name}
                </div>
              ))}
            </div>

            {savedTemplates.length > 0 && (
              <>
                <h4 className="font-medium mb-2 mt-4">Saved Templates</h4>
                <div className="divide-y">
                  {savedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="py-2 cursor-pointer hover:bg-gray-100 px-2 rounded"
                      onClick={() => loadTemplate(template)}
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter template name"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Variables</label>
            <button
              onClick={() => setShowAddVariable(!showAddVariable)}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
            >
              <Plus size={14} className="mr-1" />
              Add Variable
            </button>
          </div>

          {showAddVariable && (
            <div className="mb-3 p-3 border rounded bg-gray-50">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Variable Name
                  </label>
                  <input
                    type="text"
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="e.g., name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newVariableDesc}
                    onChange={(e) => setNewVariableDesc(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddVariable(false)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={addVariable}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {variables.length > 0 ? (
            <div className="border rounded divide-y">
              {variables.map((variable) => (
                <div
                  key={variable.name}
                  className="p-2 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium">{`{{${variable.name}}}`}</span>
                    {variable.description && (
                      <span className="text-gray-500 text-sm ml-2">
                        {variable.description}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeVariable(variable.name)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove variable"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-3 border rounded bg-gray-50">
              No variables added yet
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Template Content
          </label>
          <div className="border rounded">
            <ReactQuill
              theme="snow"
              value={templateContent}
              className="nodrag"
              onChange={setTemplateContent}
              modules={modules}
              formats={formats}
              placeholder="Compose your template here..."
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Tip: Use variables in your template with {"{{variableName}}"}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveTemplate}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Save size={16} />
            Save Template
          </button>
        </div>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
};

export default TemplateCard;
