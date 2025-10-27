// ReportNode.jsx
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jsPDF } from "jspdf";
import HeaderDesignCard from "../HeaderDesignCard/HeaderDesignCard";
import BasicCardsIcon from "../../../../assets/BasicCardsIcon.svg";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

// Yup validation schema
const pdfConfigSchema = Yup.object().shape({
  title: Yup.string().required("Report title is required"),
  fontSize: Yup.number()
    .min(8, "Font size must be at least 8")
    .max(40, "Font size cannot exceed 40")
    .required("Font size is required"),
  orientation: Yup.string()
    .oneOf(["portrait", "landscape"], "Invalid orientation")
    .required("Orientation is required"),
  filename: Yup.string().required("File name is required"),
});

const ReportCard = ({ data, id }) => {
  const { setNodes } = useReactFlow();

  // Function to update node data
  const updateNodeData = (newData) => {
    console.log("New Data is: ", newData);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      );
      console.log("Updated Nodes State: ", updatedNodes);
      return updatedNodes;
    });
    console.log("Data Stored is: ", { ...data, ...newData });
  };

  // Function to generate PDF based on config
  const generatePDF = (values) => {
    const doc = new jsPDF({
      orientation: values.orientation || "portrait",
    });

    // Apply configuration
    doc.setFontSize(values.fontSize || 16);
    doc.text(values.title || "Report", 20, 20);

    // Add existing node data to PDF
    let yPos = 40;
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "pdfConfig") {
        doc.setFontSize(values.fontSize - 4 || 12);
        doc.text(`${key}: ${JSON.stringify(value)}`, 20, yPos);
        yPos += 10;
      }
    });

    // Save the PDF with custom filename
    doc.save(values.filename ? `${values.filename}.pdf` : "report.pdf");
  };

  return (
    <div className="w-[28vw]">
      {/* Input Handle */}
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <HeaderDesignCard
        gradientColors={["#00000000", "#EA61F6", "#FF29EA"]}
        iconSrc={BasicCardsIcon}
        initialHeader="Basic Card"
        titleText="Report Card"
        helperText="Generate a report of the values"
        infoButtonText="Learn more about Report"
        primaryTextColor="#8C077F"
        titleTextColor="#770679"
      />
      {/* Node Content */}
      <div className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Report Generator
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Configure and generate a PDF report from input data
        </p>

        {/* Formik Form */}
        <Formik
          initialValues={{
            title: data.pdfConfig?.title || "Report",
            fontSize: data.pdfConfig?.fontSize || 16,
            orientation: data.pdfConfig?.orientation || "portrait",
            filename: data.pdfConfig?.filename || "report",
          }}
          validationSchema={pdfConfigSchema}
          onSubmit={(values) => {
            // Save config to node data
            updateNodeData({ pdfConfig: values });
            // Generate PDF with the submitted values
            // generatePDF(values);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  Report Title
                </label>
                <Field
                  name="title"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter report title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Font Size */}
              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium">
                  Font Size
                </label>
                <Field
                  name="fontSize"
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter font size"
                />
                <ErrorMessage
                  name="fontSize"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Orientation */}
              <div>
                <label
                  htmlFor="orientation"
                  className="block text-sm font-medium"
                >
                  Page Orientation
                </label>
                <Field
                  as="select"
                  name="orientation"
                  className="w-full p-2 border rounded"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </Field>
                <ErrorMessage
                  name="orientation"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Filename */}
              <div>
                <label htmlFor="filename" className="block text-sm font-medium">
                  File Name
                </label>
                <Field
                  name="filename"
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter file name (without .pdf)"
                />
                <ErrorMessage
                  name="filename"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Save PDF Details
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Output Handle */}
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
};

export default ReportCard;
