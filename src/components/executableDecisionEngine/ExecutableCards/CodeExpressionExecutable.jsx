import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import axios from "axios";
import FormData from "form-data"; // Required for sending files in requests
import CustomHandle from "../../../ui/customHandle/CustomHandle";
import { Button, Input } from "antd";

const CodeExpressionExecutable = ({ data }) => {
  const [output, setOutput] = useState(""); // State for holding output of the executed code
  const [userInput, setUserInput] = useState(""); // State for holding user input based on code execution
  const [error, setError] = useState(""); // State to hold any execution error
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  
  const { question, options, onAnswer } = data;

  const handleDownloadFiles = () => {
    // Create a Blob for the Python code
    const codeBlob = new Blob([data.code], { type: "text/plain" });
    const codeUrl = URL.createObjectURL(codeBlob);
    const codeLink = document.createElement("a");
    codeLink.href = codeUrl;
    codeLink.download = "code.py";
    codeLink.click();
    URL.revokeObjectURL(codeUrl);

    // Create a Blob for the input
    // const inputBlob = new Blob([userInput], { type: "text/plain" });
    // const inputUrl = URL.createObjectURL(inputBlob);
    // const inputLink = document.createElement("a");
    // inputLink.href = inputUrl;
    // inputLink.download = "input.txt";
    // inputLink.click();
    // URL.revokeObjectURL(inputUrl);
  };
  console.log("data is", data);

  // Function to handle code execution
  const handleExecute = async () => {
    const code = data.code || ""; // Code is retrieved from the `data` prop
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/rules/decision-engine-code-js`;
    const language = data.language || "javascript"; // Language from the `data` prop
    const pythonHost = import.meta.env.VITE_PYTHON_INFERENCING_API_URL;
    console.log(data);
    try {
      setIsLoading(true); // Start loading

      // If the language is Python, send the code as a .py file
      if (language === "python") {
        const formData = new FormData();
        const codeBlob = new Blob([code], { type: "text/plain" });
        formData.append("file", codeBlob, "code.py");
        console.log("Entered Python code");
        // formData.append("input", userInput); // Append user input as part of the form data

        // FOR INPUT PASS THE BACKEND INPUTS AS STRINGS
        // BECAUSE OF CONSTRAINTS

        // Send the request with the form data
        const response = await axios.post(
          `${pythonHost}/execute_file`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Res:", response.data);
        // Set the response output for Python execution
        setOutput(response.data.output || "No output returned.");
        onAnswer(response.data.output || "No output returned.");
      } else {
        // For other languages (JavaScript)
        const response = await axios.post(apiUrl, {
          code,
          input: userInput,
        });

        // Set the response output for JavaScript execution
        setOutput(response.data.output || "No output returned.");
        onAnswer(response.data.output || "No output returned.");
      }

      setError(""); // Clear any previous errors
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`); // Handle API errors
      setOutput(""); // Clear previous output
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className="font-montserrat text-l font-bold mb-3 ml-1">
        Expression Card
      </div>
      <div className="h-auto min-h-[32] min-w-[320px] max-w-[600px] w-auto  break-words p-4 bg-[#FDFAFD] border border-[#66708514] border-[1.5px] rounded-lg rounded-xl shadow-lg shadow-[#166DBE1A]">
        <CustomHandle
          type="target"
          position={Position.Top}
          tooltipText="Drag to connect as a target!"
        />

        <h2 className="ml-4 text-xl text-black font-semibold mb-4">
          Code Expression Executable
        </h2>

        {/* Input field to pass parameters into the code */}

        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="ml-4 w-[90%] text-black p-2 border  rounded mb-4"
          placeholder="Enter input for code execution"
        />

        {/* Button to execute the code */}
        <Button
          className="ml-4 mb-4 mt-2"
          onClick={handleExecute}
          color="primary"
          variant="filled"
        >
          {isLoading ? "Executing..." : "Execute Code"}
        </Button>
        {/* <button
                    onClick={handleExecute}
                    className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500"} text-white py-2 rounded`}
                    disabled={isLoading}
                >
                    {isLoading ? "Executing..." : "Execute Code"}
                </button> */}
        {/* Downloads */}
        {/* <button
                    onClick={handleDownloadFiles}
                    className="bg-green-500 text-white py-2 px-4 rounded ml-4"
                >
                    Download Files
                </button> */}

        {/* Output result */}
        {output && (
          <div className="ml-4 mt-4">
            <h3 className="font-semibold text-black">Output:</h3>
            <pre className="text-black">{output}</pre>
          </div>
        )}

        {/* Error handling */}
        {error && (
          <div className="ml-4 mt-4 text-red-500">
            <h3 className="font-semibold text-red">Error:</h3>
            <pre>{error}</pre>
          </div>
        )}

        {/* Source and target handles for the flow node */}
        {/* <Handle type="source" position="bottom" />                
                <Handle type="target" position="top" />
                 */}
        <CustomHandle
          type="source"
          position={Position.Bottom}
          tooltipText="Drag to connect as a target!"
        />
      </div>
    </div>
  );
};

export default CodeExpressionExecutable;
