"use client";

import { useState, useEffect } from "react";
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";
import { useSelector } from "react-redux";
import { Upload, notification, Typography } from "antd";
import axios from "axios";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../ui/customHandle/CustomHandle";

const { Dragger } = Upload;
const { Text } = Typography;

const UploadFileNode = ({ data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState(""); // Store the final outcome
  const [error, setError] = useState(""); // Store error messages
  const [awsTextractDetails, setAwsTextractDetails] = useState({});

  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"; // Adjust your API URL
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  console.log("The Data is: ", data);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const response = await axios.get(`${host}/rules/secret-key/`, {
          params: {
            type: "AWS", // Add this query parameter
          },
        });
        console.log("Secret Fetch: ", response.data.secrets);
        // if (!response.ok) throw new Error("Failed to fetch secret keys");
        const secrets = response.data.secrets; // Assuming API returns an array of key-value pairs

        const regionKey = secrets.find((secret) => secret.key === "region");
        const accessKeyIdKey = secrets.find(
          (secret) => secret.key === "accessKeyId"
        );
        const secretAccessKeyKey = secrets.find(
          (secret) => secret.key === "secretAccessKey"
        );

        if (regionKey && accessKeyIdKey && secretAccessKeyKey) {
          setAwsTextractDetails({
            region: regionKey.value,
            accessKeyId: accessKeyIdKey.value,
            secretAccessKey: secretAccessKeyKey.value,
          });
        } else {
          notification.warning({
            message: "Missing Secret Keys",
            description:
              "Required secret keys are missing from the API response.",
          });
        }
      } catch (err) {
        setError("Error fetching secret keys");
        notification.error({
          message: "API Error",
          description: err.message || "Unable to fetch secret keys",
        });
      }
    };

    if (userId) fetchSecrets();
  }, [userId]);

  const processWithTextract = async (file) => {
    console.log("inside process with textract: ", file);

    // const { region, accessKeyId, secretAccessKey } = data.data.awsTextractDetails;
    const { region, accessKeyId, secretAccessKey } = awsTextractDetails;

    const textractClient = new TextractClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log("Textract Client initialized");

    const fileBytes = new Uint8Array(await file.arrayBuffer());

    const queryDetails = data.queryDetails;
    if (!queryDetails || queryDetails.length === 0) {
      throw new Error("Query details are missing.");
    }

    // Prepare query list for Textract
    const queries = queryDetails.split(",").map((query) => ({
      Text: query.trim(),
    }));

    console.log("Query is: ", queries);

    const params = {
      Document: {
        Bytes: fileBytes,
      },
      FeatureTypes: ["QUERIES"], // Only include 'QUERIES', remove other types
      QueriesConfig: {
        Queries: queries,
      },
    };

    try {
      const command = new AnalyzeDocumentCommand(params);
      console.log("Textract Command: ", command);

      const response = await textractClient.send(command);
      console.log("Textract Response: ", response);

      return response;
    } catch (error) {
      console.error("Textract Processing Error: ", error);
      throw new Error(`Textract processing failed: ${error.message}`);
    }
  };

  const processQueryResults = (textractResponse) => {
    console.log(
      "Textract Response: ",
      JSON.stringify(textractResponse, null, 2)
    );

    // Find the QUERY_RESULT block
    const queryResults = textractResponse.Blocks?.filter(
      (block) => block.BlockType === "QUERY_RESULT"
    );

    if (!queryResults || queryResults.length === 0) {
      console.log("No query results found for the provided queries.");
      return "No relevant outcome found"; // Handle case where no results are found
    }

    // Extract the Text value from the QUERY_RESULT block
    const queryResultText = queryResults.map((block) => block.Text).join(", "); // In case there are multiple results

    console.log("Query Result Text: ", queryResultText);

    return queryResultText || "No relevant outcome found"; // Return the extracted text or default message if empty
  };

  const handleFileProcessing = async (file) => {
    setProcessing(true);
    setError(""); // Clear previous errors
    console.log("---dv-0cdfovvbi", data);
    try {
      if (!data.queryDetails || !data.outcomeDetails) {
        throw new Error("Query details or outcome details are missing.");
      }

      const textractResponse = await processWithTextract(file);

      const parsedOutcome = processQueryResults(textractResponse);
      console.log("Parsed Outcome: ", parsedOutcome);

      setOutcome(parsedOutcome);
      data.onFileProcessed(parsedOutcome); // Notify parent with the outcome
    } catch (error) {
      console.error("File Processing Error: ", error);
      setError(error.message || "An unknown error occurred during processing.");
    } finally {
      setProcessing(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      handleFileProcessing(file);
    } else {
      setError("No file selected. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      handleFileProcessing(file);
    } else {
      setError("No file selected. Please try again.");
    }
  };

  return (
    <div className="">
      <div>
        <h1 className="font-montserrat text-l font-bold mb-3 ml-1">
          Upload File
        </h1>
      </div>
      <div className="h-[16] min-h-[16] min-w-[320px] max-w-[400px] w-auto shadow-lg shadow-[#166DBE1A] break-words bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-xl p-2">
        <CustomHandle
          type="target"
          position={Position.Top}
          tooltipText="Drag to connect as a target!"
        />

        <h1 className="ml-6 font-montserrat font-medium text-sm text-[#343434BF] mb-2">
          {data.question || "Upload File"}
        </h1>
        <div
          className={`
                        flex flex-col items-center justify-center
                        bg-white rounded-2xl shadow-lg p-4 m-4
                        border-2 border-dashed ${
                          isDragging ? "border-blue-500" : "border-gray-200"
                        }
                        transition-colors duration-200
                    `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
        >
          <p className="text-lg text-gray-600 mb-2">
            Drop product specification files
          </p>
          <p className="text-sm text-gray-400 mb-2">
            here to extract relevant details.
          </p>
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <input
            type="file"
            accept={data.acceptedTypes}
            onChange={handleFileChange}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </div>
        <h1 className="ml-6 font-montserrat font-medium text-sm text-[#343434BF] mb-2">
          {processing ? (
            <p className="text-sm text-blue-500 mt-4">Processing...</p>
          ) : error ? (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          ) : outcome ? (
            <p className="text-sm text-blue-500 font-medium mt-4">
              Outcome: {outcome}
            </p>
          ) : null}
        </h1>
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a target!"
        />
      </div>
    </div>
  );
};

export default UploadFileNode;
