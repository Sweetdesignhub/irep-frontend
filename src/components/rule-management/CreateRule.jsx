
import React, { useState } from "react";
import { Modal, Button, Input, Select, Spin, message } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CloseOutlined } from "@ant-design/icons";

// Yup validation schema
const validationSchema = Yup.object({
  ruleName: Yup.string()
    .required("Rule name is required")
    .max(100, "Max 100 characters"),
  category: Yup.string().required("Category is required"),
  execType: Yup.string().required("Execution Type is required"),
  ruleDesc: Yup.string()
    .required("Description is required")
    .max(200, "Max 200 characters"),
});

function RuleModal({ isOpen, closeModal, newRule }) {
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const formSubmit = async (values) => {
    const ruleData = {
      name: values.ruleName,
      description: values.ruleDesc,
      category: values.category,
      ruleType: values.execType,
      data: {
        // nodes: [
        //   {
        //     id: "dndnode_1", // Unique ID for the node
        //     type: "Rule Card",
        //     position: { x: 70, y: 100 }, // Position of the Request Card
        //     data: {
        //       label: "Request Card",
        //     },
        //   },
        //   {
        //     id: "dndnode_2", // Unique ID for the node
        //     type: "Response Card",
        //     position: { x: 450, y: 100 }, // Position of the Response Card
        //     data: {
        //       label: "Response Card",
        //     },
        //   },
        // ],
        // edges: [
        //   {
        //     id: "dndnode_3", // Unique ID for the edge
        //     source: "dndnode_1", // Source node's ID
        //     target: "dndnode_2", // Target node's ID
        //     animated: true, // Whether the edge is animated
        //   },
        // ],
        // viewport: {
        //   x: -1,
        //   y: 0,
        //   zoom: 1,
        // },
      },
    };

    setLoading(true);
    try {
      await newRule(ruleData);
      closeModal();
    } catch (error) {
      console.error("Error creating rule", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null} // Custom footer
      closable={false} // Disable the default close button
      width={600} // You can adjust the width
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold leading-6">Create New Rule</h1>
        <Button
          type="link"
          icon={<CloseOutlined />} // Close icon
          onClick={closeModal}
          style={{ fontSize: "20px", color: "red" }}
        />
      </div>

      {/* Formik form */}
      <Formik
        initialValues={{
          ruleName: "",
          category: "",
          execType: "",
          ruleDesc: "",
        }}
        validationSchema={validationSchema}
        onSubmit={formSubmit}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <Form className="space-y-6">
            {/* Rule Name */}
            <div>
              <label
                htmlFor="ruleName"
                className="block text-sm font-medium text-gray-700"
              >
                Rule Name
              </label>
              <Field
                name="ruleName"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="ruleName"
                    placeholder="Rule Name"
                    maxLength={100}
                    status={errors.ruleName && touched.ruleName ? "error" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.ruleName && touched.ruleName && (
                <div className="text-red-600 text-sm">{errors.ruleName}</div>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <Field name="category">
                {({ field }) => (
                  <Select
                    {...field}
                    id="category"
                    placeholder="Select Category"
                    value={field.value || null}
                    onChange={(value) =>
                      handleChange({ target: { name: "category", value } })
                    }
                    options={[
                      { label: "HR", value: "hr" },
                      { label: "Logistics", value: "logistics" },
                      { label: "Security", value: "security" },
                      { label: "Finance", value: "finance" },
                      { label: "Operations", value: "operations" },
                    ]}
                    status={errors.category && touched.category ? "error" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              </Field>
              {errors.category && touched.category && (
                <div className="text-red-600 text-sm">{errors.category}</div>
              )}
            </div>

            {/* Execution Type */}
            <div>
              <label
                htmlFor="execType"
                className="block text-sm font-medium text-gray-700"
              >
                Execution Type
              </label>
              <Field name="execType">
                {({ field }) => (
                  <Select
                    {...field}
                    id="execType"
                    placeholder="Select Execution Type"
                    value={field.value || null}
                    onChange={(value) =>
                      handleChange({ target: { name: "execType", value } })
                    }
                    options={[
                      { label: "Long Rule", value: "LONG_RULE" },
                      { label: "Short Rule", value: "SHORT_RULE" },
                    ]}
                    status={errors.execType && touched.execType ? "error" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              </Field>
              {errors.execType && touched.execType && (
                <div className="text-red-600 text-sm">{errors.execType}</div>
              )}
            </div>

            {/* Rule Description */}
            <div>
              <label
                htmlFor="ruleDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Rule Description
              </label>
              <Field
                name="ruleDesc"
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    id="ruleDesc"
                    placeholder="Rule Description"
                    maxLength={200}
                    status={errors.ruleDesc && touched.ruleDesc ? "error" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.ruleDesc && touched.ruleDesc && (
                <div className="text-red-600 text-sm">{errors.ruleDesc}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
              >
                {loading ? <Spin /> : "Create Rule"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default RuleModal;
