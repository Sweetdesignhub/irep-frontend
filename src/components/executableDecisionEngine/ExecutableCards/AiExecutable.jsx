import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Handle, Position } from "@xyflow/react";
import axios from "axios";
import { Line } from "@ant-design/plots";
import CustomHandle from "../../../ui/customHandle/CustomHandle";

const AiExecutable = ({ data }) => {
  const [forecastPeriods, setForecastPeriods] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { question, options, onAnswer } = data;
  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"; // Adjust your API URL
  const pythonHost =
    import.meta.env.VITE_PYTHON_INFERENCING_API_URL ||
    "http://localhost:8080/api/v1"; // Adjust your API URL

  const handleForecast = async () => {
    console.log("Data is: ", data);

    if (!forecastPeriods) {
      message.error("Please enter forecast periods.");
      return;
    }
    if (!data.dataset || !data.dependent || !data.target) {
      message.error(
        "Required data is missing: Dataset, Dependent, or Target variables."
      );
      return;
    }

    try {
      setLoading(true);
      // Step 1: Fetch file URL from dataset
      const datasetResponse = await axios.get(
        `${host}/rules/dataset/${data.dataset}`
      );
      const fileUrl = datasetResponse.data.fileUrl;

      if (!fileUrl) {
        message.error("File URL not found for the dataset.");
        setLoading(false);
        return;
      }

      // Step 2: Fetch the file as a Blob
      const fileResponse = await axios.get(`${host}/${fileUrl}`, {
        responseType: "blob",
      });
      const fileBlob = fileResponse.data;

      // Convert the fileBlob to a proper CSV Blob
      const csvBlob = new Blob([fileBlob], { type: "text/csv" });

      // Step 3: Prepare FormData for the request
      const formData = new FormData();
      formData.append("file", csvBlob, "dataset.csv");
      formData.append("dependent_variable", data.dependent);
      formData.append("target_variable", data.target);
      formData.append("forecast_periods", forecastPeriods);

      // Step 4: Make API call to /forecast
      const forecastResponse = await axios.post(
        `${pythonHost}/forecast`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Forecast successful!");

      // Parse forecast data into a format suitable for Ant Design charts
      const forecastResult = forecastResponse.data.forecast;
      const formattedData = Object.keys(forecastResult).map((key) => ({
        period: key,
        value: forecastResult[key],
      }));
      setLoading(false);
      setForecastData(formattedData);
    } catch (error) {
      setLoading(false);
      console.error("Error during forecast:", error);
      message.error("Forecast failed. Please check the input and try again.");
    }
  };

  // Ant Design Line Chart Config
  const config = {
    data: forecastData,
    xField: "period",
    yField: "value",
    point: {
      size: 5,
      shape: "circle",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    tooltip: {
      showMarkers: true,
    },
    smooth: true,
  };

  return (
    <div>
      <div className="font-montserrat text-l font-bold mb-3 ml-1">
        AI Model Node
      </div>
      <div className="h-auto min-h-[32] min-w-[320px] max-w-[600px] w-auto  break-words p-4 bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-lg rounded-xl shadow-lg shadow-[#166DBE1A]">
        <CustomHandle
          type="target"
          position={Position.Top}
          tooltipText="Drag to connect as a target!"
        />

        {/* Input Section */}
        <div className="ml-4 mt-2 form-section mb-4">
          <h2 className="text-sm text-[#343434BF] mb-2">Forecast Periods:</h2>
          <Input
            type="number"
            placeholder="Enter forecast periods"
            value={forecastPeriods}
            onChange={(e) => setForecastPeriods(e.target.value)}
            className="forecast-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        {/* <Button
                    type="primary"
                    onClick={handleForecast}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300 rounded-lg py-2 font-semibold transition duration-200"
                >
                    Generate Forecast
                </Button> */}
        <Button
          className="ml-4 mb-4 mt-2"
          onClick={handleForecast}
          color="primary"
          variant="filled"
        >
          {isLoading ? "Generating..." : "Generate Forecast"}
        </Button>
        {/* Chart Section */}
        {forecastData.length > 0 && (
          <div className="chart-section mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Forecast Results
            </h3>
            <Line {...config} />
          </div>
        )}

        {/* React Flow Handles */}
        {/* <Handle type="target" position="top" id="in" className="w-3 h-3 bg-gray-400" />
                <Handle type="source" position="bottom" id="out" className="w-3 h-3 bg-gray-400" /> */}
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a target!"
        />
      </div>
    </div>
  );
};

export default AiExecutable;
