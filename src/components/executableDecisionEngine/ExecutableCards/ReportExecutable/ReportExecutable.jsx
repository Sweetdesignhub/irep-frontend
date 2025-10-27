import React, { useState, useEffect } from "react";
import { Card, Spin, Alert, Button, message } from "antd";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../ui/customHandle/CustomHandle";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import logo from "../../../../assets/DashboardIcon.svg"; // Replace with your logo

const ReportExecutable = ({ data, id }) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [calculatedFieldName, setCalculatedFieldName] = useState("");

  console.log("Report", data);

  // Initialize data when component mounts or data changes
  useEffect(() => {
    if (data?.basicCalculationDetails) {
      setCalculatedFieldName(
        data.basicCalculationDetails.calculatedFieldName || "calculatedValue"
      );
      setReportData(data.basicCalculationDetails.calculatedResults || []);
    }
  }, [data]);

  // Parse template and replace placeholders with actual data
  const parseTemplate = (template, data) => {
    // Replace simple variables
    let output = template.replace(
      /\{\{(\w+)\}\}/g,
      (match, p1) => data[p1] || match
    );

    // Replace tables
    output = output.replace(/\{\{table:(\w+)\}\}/g, (match, p1) => {
      console.log("inside the table part", p1);
      const dataset = data[p1];
      if (!Array.isArray(dataset)) return match;

      // Generate table HTML with a special marker for the main data table
      if (p1 === "reportData") {
        return `<table class="main-data-table"><tr><td>DATA_TABLE_PLACEHOLDER</td></tr></table>`;
      }

      // For other tables, generate simple HTML
      return `
        <table border="1">
          <thead>
            <tr>
              ${Object.keys(dataset[0])
                .map((key) => `<th>${key}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${dataset
              .map(
                (row) => `
              <tr>
                ${Object.values(row)
                  .map((val) => `<td>${val}</td>`)
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    });
    // console.log("Output of Parse Template is:", output);
    return output;
  };

  const MyDocument = () => {
    const parsedContent = parseTemplate(data.templateConfig.templateContent, {
      ...data,
      tableData: reportData,
      date: new Date().toLocaleDateString(),
      calculatedFieldName,
    });

    // Convert HTML to formatted text with basic structure
    const formatContent = (html) => {
      // First extract the table if it exists
      const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/);
      const tableHtml = tableMatch ? tableMatch[0] : null;
      const textWithoutTable = tableMatch
        ? html.replace(tableMatch[0], "{{TABLE}}")
        : html;

      // Process non-table content
      const textContent = textWithoutTable
        .replace(/<h1[^>]*>([^<]*)<\/h1>/g, "\n\n## $1 ##\n\n")
        .replace(/<p[^>]*>([^<]*)<\/p>/g, "\n$1\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        textContent,
        tableHtml,
      };
    };

    const { textContent, tableHtml } = formatContent(parsedContent);

    // Format table data for PDF
    const renderTable = () => {
      if (!tableHtml) return null;

      // Extract headers
      const headerMatch = tableHtml.match(
        /<thead>.*?<tr>(.*?)<\/tr>.*?<\/thead>/s
      );
      const headers = headerMatch
        ? headerMatch[1]
            .match(/<th>(.*?)<\/th>/g)
            .map((h) => h.replace(/<\/?th>/g, "").trim())
        : [];

      // Extract rows
      const rowMatches = tableHtml.matchAll(/<tr>(.*?)<\/tr>/gs);
      const rows = [];
      for (const rowMatch of rowMatches) {
        const cells = rowMatch[1].match(/<td>(.*?)<\/td>/g);
        if (cells) {
          rows.push(cells.map((c) => c.replace(/<\/?td>/g, "").trim()));
        }
      }

      // Remove header row if it exists in tbody
//      if (rows.length > 0 && rows[0].length === headers.length) {
 //       rows.shift();
 //     }
     
      return (
        <View style={styles.table}>
          {/* Table Header */}

          <View style={styles.tableRow}>
            {headers.map((header, index) => (
              <View key={`header-${index}`} style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={styles.tableCell}
                >
                  <Text style={styles.tableCellText}>
                    {formatCellValue(cell, headers[cellIndex])}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    };

    return (
      <Document>
        <Page style={styles.page}>
          {/* Main Content */}
          <View style={styles.watermark}>
            <Text style={styles.watermarkText}>CONFIDENTIAL</Text>
          </View>
          <Text style={styles.title}>{data.pdfConfig.title}</Text>

          <View style={styles.section}>
            <Text style={styles.content}>
              {textContent.replace("{{TABLE}}", "")}
            </Text>
          </View>

          {/* Table */}
          {renderTable()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Generated on {new Date().toLocaleString()}
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  // Styles
  const styles = StyleSheet.create({
    title: {
      fontSize: 36,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      marginBottom: 20,
    },
    page: {
      padding: 40,
      fontFamily: "Helvetica",
      display: "flex",
      flexDirection: "column",
      position: "relative", // Needed for absolute positioning of watermark
    },
    watermark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-45deg)",
      opacity: 0.1,
      zIndex: -1, // Place behind other content
    },
    watermarkText: {
      fontSize: 64,
      color: "#888888",
      left: -20,
      fontWeight: "bold",
    },
    section: {
      marginBottom: 20,
    },
    content: {
      fontSize: 12,
      lineHeight: 1.5,
      marginBottom: 20,
    },
    table: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      borderWidth: 1,
      borderColor: "#cccccc",
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
    },
    tableHeaderCell: {
      padding: 8,
      backgroundColor: "#f2f2f2",
      flex: 1,
      textAlign: "center",
    },
    tableHeaderText: {
      fontWeight: "bold",
      fontSize: 10,
    },
//    tableCell: {
  //    padding: 8,
//      flex: 1,
//      textAlign: "center",
//    },
//    tableCellText: {
//      fontSize: 9,
//    },
tableCell: {
      // padding: 12,
      // flex: 1,
      // textAlign: "center",
      overflow: "hidden", // hide anything that overflows
      padding: 8,
      flex: 1, // still use flex to distribute
      justifyContent: "center",
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: "#ccc",
    },
    tableCellText: {
      fontSize: 8,
 
      //////
      textAlign: "center",
      // Allows content to wrap to next line
      flexWrap: "wrap",
      width: "100%",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
    },
    footerText: {
      fontSize: 8,
      color: "#666666",
    },
  });

  // Cell formatting function
  const formatCellValue = (value, header) => {
    // Format numeric values
    if (
      header.toLowerCase().includes("score") ||
      header.toLowerCase().includes("value") ||
      header.toLowerCase().includes("salary")
    ) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        // Format currency for salary
        if (header.toLowerCase().includes("salary")) {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(num);
        }
        // Format other numbers to 2 decimal places
        return num.toFixed(2);
      }
    }
    return value;
  };

  // Handle PDF generation and download
  useEffect(() => {
    if (!data?.basicCalculationDetails?.calculatedResults) {
      setError(
        "Missing required data: basicCalculationDetails.calculatedResults"
      );
      return;
    }

    setLoading(true);
    setError(null);

    // Call the onAnswer callback with the pdfConfig
    if (typeof data.onAnswer === "function") {
      data.onAnswer({
        pdfConfig: data.pdfConfig,
        nodeId: id,
        timestamp: new Date().toISOString(),
        recordCount: data.basicCalculationDetails.calculatedResults.length,
      });
    }

    setLoading(false);
  }, [data, id]);

  return (
    <Card
      title="Report Card"
      className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-sm"
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
            <p className="mt-2 text-gray-600">Preparing report...</p>
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

        {!loading && !error && reportData.length > 0 && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">
              {data?.pdfConfig?.title || "Employee Appraisal Report"}
            </h3>

            <div className="mb-6 w-full">
              <PDFDownloadLink
                document={<MyDocument />}
                fileName={
                  data?.pdfConfig?.filename || "employee_appraisal_report.pdf"
                }
                style={{ textDecoration: "none" }}
              >
                {({ blob, loading: pdfLoading }) => {
                  if (pdfLoading) {
                    return (
                      <Button type="primary" loading>
                        Preparing Download...
                      </Button>
                    );
                  }

                  return (
                    <Button
                      type="primary"
                      onClick={() => {
                        if (blob) {
                          saveAs(
                            blob,
                            data?.pdfConfig?.filename ||
                              "employee_appraisal_report.pdf"
                          );
                        }
                      }}
                    >
                      Download Report
                    </Button>
                  );
                }}
              </PDFDownloadLink>
            </div>

            <div className="text-sm text-gray-500 mt-4 w-full">
              <p>Report Summary:</p>
              <div className="bg-gray-100 p-3 rounded mt-1">
                <p>• Employees: {reportData?.length}</p>
                <p>• Calculated Field: {calculatedFieldName}</p>
                <p>• Generated: {new Date().toLocaleString()}</p>
              </div>
            </div>
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

export default ReportExecutable;

// import React, { useState, useEffect } from "react";
// import { Card, Spin, Alert, Button, message } from "antd";
// import { Handle, Position } from "@xyflow/react";
// import CustomHandle from "../../../../ui/customHandle/CustomHandle";
// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";
// import { saveAs } from "file-saver";
// import logo from "../../../../assets/DashboardIcon.svg"; // Replace with your logo

// const ReportExecutable = ({ data, id }) => {
//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState(null);
//   const [reportData, setReportData] = useState([]);
//   const [calculatedFieldName, setCalculatedFieldName] = useState("");

//   console.log("Report", data.templateConfig);
//   // Create styles for PDF document
//   const styles = StyleSheet.create({
//     page: {
//       flexDirection: "column",
//       backgroundColor: "#FFFFFF",
//       padding: 40,
//       fontSize: data?.pdfConfig?.fontSize || 12,
//     },
//     header: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 30,
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//       paddingBottom: 20,
//     },
//     logo: {
//       width: 100,
//       height: 40,
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: "bold",
//       color: "#2c3e50",
//     },
//     date: {
//       marginTop: 70,
//       marginRight: 40,
//       fontSize: 12,
//       fontWeight: "bold",
//       color: "#2c3e50",
//     },
//     section: {
//       marginBottom: 20,
//     },
//     sectionTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 10,
//       color: "#3498db",
//     },
//     table: {
//       display: "table",
//       width: "auto",
//       borderStyle: "solid",
//       borderWidth: 1,
//       borderRightWidth: 0,
//       borderBottomWidth: 0,
//       marginBottom: 20,
//     },
//     tableRow: {
//       flexDirection: "row",
//     },
//     tableColHeader: {
//       width: "20%",
//       borderStyle: "solid",
//       borderWidth: 1,
//       borderLeftWidth: 0,
//       borderTopWidth: 0,
//       backgroundColor: "#f8f9fa",
//       padding: 5,
//     },
//     tableCol: {
//       width: "20%",
//       borderStyle: "solid",
//       borderWidth: 1,
//       borderLeftWidth: 0,
//       borderTopWidth: 0,
//       padding: 5,
//     },
//     tableCellHeader: {
//       fontWeight: "bold",
//       fontSize: 12,
//     },
//     tableCell: {
//       fontSize: 10,
//     },
//     footer: {
//       position: "absolute",
//       bottom: 30,
//       left: 40,
//       right: 40,
//       textAlign: "center",
//       fontSize: 10,
//       color: "#95a5a6",
//       borderTopWidth: 1,
//       borderTopColor: "#e0e0e0",
//       paddingTop: 10,
//     },
//   });

//   // Initialize data when component mounts or data changes
//   useEffect(() => {
//     if (data?.basicCalculationDetails) {
//       setCalculatedFieldName(
//         data.basicCalculationDetails.calculatedFieldName || "calculatedValue"
//       );
//       setReportData(data.basicCalculationDetails.calculatedResults || []);
//     }
//   }, [data]);

//   // Parse template and replace placeholders with actual data
//   const parseTemplate = (template, data) => {
//     // Replace simple variables
//     let output = template.replace(
//       /\{\{(\w+)\}\}/g,
//       (match, p1) => data[p1] || match
//     );

//     // Replace tables
//     output = output.replace(/\{\{table:(\w+)\}\}/g, (match, p1) => {
//       const dataset = data[p1];
//       if (!Array.isArray(dataset)) return match;

//       // Generate table HTML with a special marker for the main data table
//       if (p1 === "reportData") {
//         return `<table class="main-data-table"><tr><td>DATA_TABLE_PLACEHOLDER</td></tr></table>`;
//       }

//       // For other tables, generate simple HTML
//       return `
//         <table border="1">
//           <thead>
//             <tr>
//               ${Object.keys(dataset[0])
//                 .map((key) => `<th>${key}</th>`)
//                 .join("")}
//             </tr>
//           </thead>
//           <tbody>
//             ${dataset
//               .map(
//                 (row) => `
//               <tr>
//                 ${Object.values(row)
//                   .map((val) => `<td>${val}</td>`)
//                   .join("")}
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//       `;
//     });

//     return output;
//   };

//   // PDF Document Component
//   const MyDocument = () => {
//     if (!reportData || reportData.length === 0) return null;
//     console.log("My report Data: ", { reportData, data });
//     console.log("My report template: ", data.templateConfig.templateContent);
//     const parsedContent = parseTemplate(data.templateConfig.templateContent, {
//       ...data,
//       reportData,
//       calculatedFieldName,
//     });
//     // Get all unique keys from the data for table headers
//     const allKeys = reportData.reduce((keys, item) => {
//       Object.keys(item).forEach((key) => {
//         if (!keys.includes(key)) keys.push(key);
//       });
//       return keys;
//     }, []);

//     return (
//       <Document>
//         <Page
//           size="A4"
//           style={styles.page}
//           orientation={data?.pdfConfig?.orientation || "portrait"}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Image src={logo} style={styles.logo} />
//             <Text style={styles.title}>
//               {data?.pdfConfig?.title || "Report Title"}
//             </Text>
//             <Text style={styles.date}>
//               Date: {new Date().toLocaleDateString()}
//             </Text>
//           </View>

//           {/* Summary Section */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Executive Summary</Text>
//             <Text>
//               This report contains appraisal details for {reportData.length}{" "}
//               employees. The calculated field "{calculatedFieldName}" represents
//               the final appraisal score.
//             </Text>
//           </View>

//           {/* Data Table */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Employee Appraisal Details</Text>
//             <View style={styles.table}>
//               {/* Table Header */}
//               <View style={styles.tableRow}>
//                 {allKeys.map((key, index) => (
//                   <View key={`header-${index}`} style={styles.tableColHeader}>
//                     <Text style={styles.tableCellHeader}>
//                       {key === calculatedFieldName
//                         ? "Final Score"
//                         : key.replace(/_/g, " ")}
//                     </Text>
//                   </View>
//                 ))}
//               </View>

//               {/* Table Rows */}
//               {reportData.map((item, rowIndex) => (
//                 <View key={`row-${rowIndex}`} style={styles.tableRow}>
//                   {allKeys.map((key, colIndex) => (
//                     <View
//                       key={`cell-${rowIndex}-${colIndex}`}
//                       style={styles.tableCol}
//                     >
//                       <Text style={styles.tableCell}>
//                         {formatCellValue(item[key], key)}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text>
//               Confidential - {data?.pdfConfig?.title || "Report"} - Generated on{" "}
//               {new Date().toLocaleString()}
//             </Text>
//           </View>
//         </Page>
//       </Document>
//     );
//   };

//   // Format cell values appropriately
//   const formatCellValue = (value, key) => {
//     if (value === null || value === undefined) return "N/A";
//     if (typeof value === "number") {
//       // Format currency for salary fields
//       if (key.includes("Salary")) {
//         return new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(value);
//       }
//       // Format other numbers with 2 decimal places
//       return value.toFixed(2);
//     }
//     // Handle string representations of numbers
//     if (!isNaN(parseFloat(value))) return parseFloat(value).toFixed(2);
//     return value;
//   };

//   // Handle PDF generation and download
//   useEffect(() => {
//     if (!data?.basicCalculationDetails?.calculatedResults) {
//       setError(
//         "Missing required data: basicCalculationDetails.calculatedResults"
//       );
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     // Call the onAnswer callback with the pdfConfig
//     if (typeof data.onAnswer === "function") {
//       data.onAnswer({
//         pdfConfig: data.pdfConfig,
//         nodeId: id,
//         timestamp: new Date().toISOString(),
//         recordCount: data.basicCalculationDetails.calculatedResults.length,
//       });
//     }

//     setLoading(false);
//   }, [data, id]);

//   return (
//     <Card
//       title="Report Card"
//       className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-sm"
//     >
//       <CustomHandle
//         type="target"
//         position={Position.Top}
//         tooltipText="Drag to connect as a target!"
//       />
//       <div className="p-4">
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-4">
//             <Spin size="large" />
//             <p className="mt-2 text-gray-600">Preparing report...</p>
//           </div>
//         )}

//         {error && (
//           <Alert
//             message="Error"
//             description={error}
//             type="error"
//             showIcon
//             className="mb-4"
//           />
//         )}

//         {!loading && !error && reportData.length > 0 && (
//           <div className="flex flex-col items-center">
//             <h3 className="text-lg font-medium mb-4">
//               {data?.pdfConfig?.title || "Employee Appraisal Report"}
//             </h3>

//             <div className="mb-6 w-full">
//               <PDFDownloadLink
//                 document={<MyDocument />}
//                 fileName={
//                   data?.pdfConfig?.filename || "employee_appraisal_report.pdf"
//                 }
//                 style={{ textDecoration: "none" }}
//               >
//                 {({ blob, loading: pdfLoading }) => {
//                   if (pdfLoading) {
//                     return (
//                       <Button type="primary" loading>
//                         Preparing Download...
//                       </Button>
//                     );
//                   }

//                   return (
//                     <Button
//                       type="primary"
//                       onClick={() => {
//                         if (blob) {
//                           saveAs(
//                             blob,
//                             data?.pdfConfig?.filename ||
//                               "employee_appraisal_report.pdf"
//                           );
//                         }
//                       }}
//                     >
//                       Download Report
//                     </Button>
//                   );
//                 }}
//               </PDFDownloadLink>
//             </div>

//             <div className="text-sm text-gray-500 mt-4 w-full">
//               <p>Report Summary:</p>
//               <div className="bg-gray-100 p-3 rounded mt-1">
//                 <p>• Employees: {reportData.length}</p>
//                 <p>• Calculated Field: {calculatedFieldName}</p>
//                 <p>• Generated: {new Date().toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <CustomHandle
//         type="source"
//         position={Position.Bottom}
//         tooltipText="Drag to connect as a source!"
//       />
//     </Card>
//   );
// };

// export default ReportExecutable;
