import React, { useState, useEffect } from "react";
import { Card, Spin, Alert, Table } from "antd";
import axios from "axios";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

const NLPExecutable = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const analyzeSentiment = async () => {
      if (!data?.variableName || !data?.databaseDetails) {
        setError("Missing required data: variableName or databaseDetails");
        return;
      }

      // Check if databaseDetails is an array of objects
      if (!Array.isArray(data.databaseDetails)) {
        setError("databaseDetails should be an array of objects");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Collect all values for the specified variableName across all objects
        const valuesToAnalyze = data.databaseDetails
          .map((item) => ({
            originalItem: item,
            value: item[data.variableName],
          }))
          .filter((item) => item.value !== undefined);

        if (valuesToAnalyze.length === 0) {
          setError(
            `Variable "${data.variableName}" not found in any databaseDetails items`
          );
          return;
        }
        // console.log("values to analyse: ", valuesToAnalyze);
        // Make API calls for each value
        const pythonHost =
          import.meta.env.VITE_PYTHON_INFERENCING_API_URL ||
          "http://127.0.0.1:8000"; // Adjust your API URL

        const analysisPromises = valuesToAnalyze.map((item) => {
          console.log("Item is:", item);
          return axios.post(`${pythonHost}/analyze-sentiment`, {
            sentence: String(item.value), // Ensure we're sending a string
          });
        });

        const responses = await Promise.all(analysisPromises);
        console.log("Response: ", responses);
        // Combine original data with analysis results
        const processedResults = valuesToAnalyze.map((item, index) => ({
          ...item.originalItem,
          [`${data.variableName}_sentiment`]:
            responses[index].data.sentiment_score,
        }));

        setResults(processedResults);

        // Call the onAnswer callback if provided
        if (typeof data.onAnswer === "function") {
          console.log("Pasingdhbvcjhdsbvjhbc");
          data.onAnswer(processedResults);
        }
      } catch (err) {
        console.error("Sentiment analysis failed:", err);
        setError(`Analysis failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    analyzeSentiment();
  }, []);

  // Prepare columns for the table
  const tableColumns =
    results.length > 0
      ? [
          ...Object.keys(results[0])
            .filter((key) => key !== `${data.variableName}_sentiment`)
            .map((key) => ({
              title: key,
              dataIndex: key,
              key: key,
              render: (text) =>
                typeof text === "string"
                  ? text.substring(0, 50) + (text.length > 50 ? "..." : "")
                  : text,
            })),
          {
            title: `Sentiment (${data.variableName})`,
            dataIndex: `${data.variableName}_sentiment`,
            key: "sentiment",
            // render: (score) => (score !== undefined ? score.toFixed(2) : "N/A"),
            render: (value) => {
              if (
                value !== undefined &&
                !isNaN(parseFloat(value)) &&
                isFinite(value)
              ) {
                return parseFloat(value).toFixed(2);
              }
              return "N/A";
            },
          },
        ]
      : [];

  //     const tableColumns = selectedColumns.map((col) => ({
  //       title: col.replace(/_/g, " ").toUpperCase(),
  //       dataIndex: col,
  //       key: col,
  //   render: (value) => {
  //     // Check if the value is a number
  //     console.log(typeof value);
  //     const numericValue = parseFloat(value);

  //     // Check if conversion was successful and it's a finite number
  //     if (!isNaN(numericValue) && isFinite(numericValue)) {
  //       // Round to 2 decimal places
  //       return numericValue.toFixed(2);
  //     }

  //     // Return original value if not a number
  //     return value;
  //   },
  //     }));

  return (
    <Card
      title={`NLP Sentiment Analysis for "${data.variableName}"`}
      className="w-full  border border-gray-300 rounded-lg shadow-sm"
    >
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <div className="p-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-4">
            <Spin size="large" />
            <p className="mt-2 text-gray-600">
              Analyzing sentiment for {data.databaseDetails.length} records...
            </p>
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {results.length > 0 && !loading && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Analysis Results:
            </h3>
            <Table
              columns={tableColumns}
              dataSource={results}
              rowKey={(record) => record.email || record.name || Math.random()}
              pagination={{ pageSize: 5 }}
              bordered
              size="small"
              className="rounded-lg overflow-hidden"
            />
            <div className="mt-2 text-sm text-gray-500">
              Showing {results.length} records with sentiment analysis for "
              {data.variableName}"
            </div>
          </div>
        )}
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a target!"
      />
    </Card>
  );
};

export default NLPExecutable;
