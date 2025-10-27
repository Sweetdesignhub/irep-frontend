

import React, { useState } from "react";
import { Input, Form, Button, Select } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Handle } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import ModelTrainingCardsIcon from "../../../../assets/ModelTrainingCardsIcon.svg";
import "../node.css";
import InfoButton from "../../../../ui/InfoButton/InfoButton";

// Validation Schema
const validationSchema = Yup.object().shape({
  Algorithm: Yup.string().required("Algorithm is required"), // Ensure this field is required
});

const AlgorithmCard = ({ data }) => {
  const { getNode, addNodes, addEdges } = useReactFlow();
  const [algorithmSelected, setAlgorithmSelected] = useState(null); // Track the selected algorithm

  return (
    <>
      <div
        className="flex items-center justify-between rounded-xl py-10 px-10 bg-gradient-to-t relative from-white/50 via-[#64F661] to-[#29FF3E]  mx-auto"
        style={{
          borderRadius: "12px",
          borderImage:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
        }}
      >
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center">
            <img
              src={AdvancedCardsIcon}
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
                  className=" text-base  text-[#2A8C07] text-left   cursor-pointer"
                >
                  {header}
                </h4>
              )}
              <div className="flex flex-row ">
                <h4 className=" text-3xl  text-[#087906] font-semibold mr-3 font-xl cursor-pointer">
                  {"API Card  "}
                </h4>
                <InfoButton text="This is a Api Card" />
              </div>
            </div>
          </div>
          <h3 className="text-xl text-left  text-[#2A8C07] mt-4">
            The API Card Helps You Make an API Call to A certain URL{" "}
          </h3>
        </div>

        {/* Info Button */}
        {/* <InfoButton text="This is a Rule Card" /> */}
      </div>
      <div>
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
                Algorithm: "", // Initialize algorithm as empty string
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  console.log("Submitting values: ", values);

                  // Assuming you have a mock response from API or a prediction
                  const response = { sample_accuracy: 0.85 }; // Mocked response
                  console.log(data);
                  // Create a new node based on response
                  const responseNode = {
                    id: `response_${Date.now()}`,
                    type: "Response Card",
                    position: {
                      x: data?.position?.x + 250,
                      y: data?.position?.y - 100,
                    },
                    data: {
                      status: response ? true : false,
                      data: JSON.stringify(response),
                    },
                  };

                  // Add the response node to React Flow
                  addNodes(responseNode);

                  // Add edge connecting the original node to the new response node
                  const newConnection = {
                    id: `edge_${data.id}_${responseNode.id}`,
                    source: data.id,
                    sourceHandle: "out",
                    target: responseNode.id,
                    targetHandle: "in",
                  };

                  addEdges([newConnection]);
                } catch (error) {
                  console.error("Error during submission:", error);
                }
              }}
            >
              {({ handleSubmit }) => (
                <Form onFinish={handleSubmit}>
                  {/* Algorithm Selector */}
                  <Form.Item
                    name="Algorithm"
                    // label="Select Algorithm"
                    required
                    validateStatus="error"
                    help={
                      <ErrorMessage
                        name="Algorithm"
                        component="div"
                        className="error"
                      />
                    }
                  >
                    <label>Algorithm</label>
                    <Field name="Algorithm">
                      {({ field, form }) => (
                        <Select
                          {...field} // This ensures Formik integrates with Select
                          options={[
                            { label: "KNN Algorithm", value: "KNN" },
                            { label: "Random Forest", value: "RandomForest" },
                            { label: "Decision Tree", value: "DecisionTree" },
                          ]}
                          placeholder="Select Algorithm"
                          onChange={(value) => {
                            form.setFieldValue("Algorithm", value); // Update Formik value on selection
                            setAlgorithmSelected(value); // Track the selected algorithm
                          }}
                          className="nodrag selector"
                        />
                      )}
                    </Field>
                  </Form.Item>

                  {/* Submit Button */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="nodrag save-btn"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
          <Handle type="target" position="left" id="in" />
          <Handle type="source" position="right" id="out" />
        </div>
      </div>
    </>
  );
};

export default AlgorithmCard;
