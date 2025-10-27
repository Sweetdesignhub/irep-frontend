import React, { useState, useEffect } from "react";
import { Card, Spin, Alert, Table, Input } from "antd";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";

const CalculationExecutable = ({ data, id }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [calculatedFieldName, setCalculatedFieldName] = useState(
    data.calculatedFieldName || "calculatedValue"
  );

  useEffect(() => {
    const calculateResults = () => {
      if (!data?.formula || !data?.semanticAnalysisDetails) {
        setError("Missing required data: formula or semanticAnalysisDetails");
        return;
      }

      if (!Array.isArray(data.semanticAnalysisDetails)) {
        setError("semanticAnalysisDetails should be an array of objects");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Extract variables from formula
        const formulaVars = extractVariablesFromFormula(data.formula);

        // Process each employee record
        const calculatedResults = data.semanticAnalysisDetails.map(
          (employee) => {
            // Prepare values for calculation
            console.log("Calculation: ", employee);
            const values = {};

            formulaVars.forEach((varName) => {
              // First try to get the original value
              let value = employee[varName];

              // If not a number, try the _sentiment version
              if (isNaN(parseFloat(value))) {
                const sentimentVar = `${varName}_sentiment`;
                value = employee[sentimentVar];

                if (isNaN(parseFloat(value))) {
                  throw new Error(
                    `Missing numeric value for variable: ${varName}`
                  );
                }
              }

              values[varName] = parseFloat(value);
            });

            // Add any additional required variables (like employeeSalary)
            if (!values.employeeSalary) {
              values.employeeSalary = 100000; // Default value or get from employee data
            }

            // Calculate the result using the formula
            const calculation = evaluateFormula(data.formula, values);

            return {
              ...employee,
              [calculatedFieldName]: calculation,
            };
          }
        );

        setResults(calculatedResults);

        if (typeof data.onAnswer === "function") {
          data.onAnswer({
            calculatedResults,
            calculatedFieldName,
            nodeId: id,
          });
        }
      } catch (err) {
        console.error("Calculation failed:", err);
        setError(`Calculation failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    calculateResults();
  }, [data, calculatedFieldName, id]);

  // Helper function to extract variables from formula
  const extractVariablesFromFormula = (formula) => {
    const varRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const matches = formula.match(varRegex) || [];
    const excluded = ["Math", "sin", "cos", "tan", "sqrt", "pow", "PI"];
    return [...new Set(matches)].filter((v) => !excluded.includes(v));
  };

  // Helper function to safely evaluate the formula
  const evaluateFormula = (formula, values) => {
    const context = {
      ...values,
      Math: Math,
    };

    const expression = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) =>
      context.hasOwnProperty(match) ? context[match] : match
    );

    try {
      // eslint-disable-next-line no-new-func
      return new Function("return " + expression)();
    } catch (err) {
      throw new Error(`Formula evaluation error: ${err.message}`);
    }
  };

  // Dynamically generate table columns based on available data
  const generateTableColumns = () => {
    if (results.length === 0) return [];

    // Get all keys from the first result
    const allKeys = Object.keys(results[0]);

    return allKeys.map((key) => {
      // Special formatting for calculated field
      if (key === calculatedFieldName) {
        return {
          title: (
            <Input
              value={calculatedFieldName}
              onChange={(e) => setCalculatedFieldName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              size="small"
            />
          ),
          dataIndex: key,
          key: key,
          render: (text) => (typeof text === "number" ? text.toFixed(2) : text),
        };
      }

      // Format numeric fields
      if (
        typeof results[0][key] === "number" ||
        (typeof results[0][key] === "string" &&
          !isNaN(parseFloat(results[0][key])))
      ) {
        return {
          title: key,
          dataIndex: key,
          key: key,
          render: (text) => parseFloat(text).toFixed(2),
        };
      }

      // Default formatting for other fields
      return {
        title: key,
        dataIndex: key,
        key: key,
        render: (text) => text,
      };
    });
  };

  return (
    <Card
      title="Salary Calculation"
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
              Calculating results for{" "}
              {data.semanticAnalysisDetails?.length || 0} employees...
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

        {!loading && !error && (
          <div className="mt-4">
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800">Formula:</h4>
              <code className="text-sm bg-white p-2 rounded inline-block mt-1">
                {data.formula}
              </code>
              <div className="mt-2">
                <label className="text-sm text-gray-600">
                  Calculated Field Name:
                </label>
                <Input
                  value={calculatedFieldName}
                  onChange={(e) => setCalculatedFieldName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {results.length > 0 && (
              <>
                <Table
                  columns={generateTableColumns()}
                  dataSource={results}
                  rowKey={(record) =>
                    record.email || record.id || Math.random()
                  }
                  pagination={{ pageSize: 5 }}
                  bordered
                  size="middle"
                  className="rounded-lg overflow-hidden"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Showing {results.length} records with calculated field "
                  {calculatedFieldName}"
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </Card>
  );
};

export default CalculationExecutable;
