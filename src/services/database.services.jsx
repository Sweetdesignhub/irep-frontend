

import { useContext } from "react";
import axios from "axios";
// import AuthContext from "../contexts/AuthProvider";
// const { auth, currOrg: contextCurrOrg } = useContext(AuthContext);
const API_URL = `${import.meta.env.VITE_API_URL}/rules`;
// const API_URL = `http://localhost:8091/api`;

// import pkg from "pg";
// const { Pool } = pkg;

export const fetchDbData = async (dbConfig) => {
  console.log("Db config is: ", dbConfig);
  try {
    const response = await axios.post(
      `${API_URL}/database/get/details`,
      dbConfig
      // {
      //   headers: {
      //     Authorization: "Bearer " + auth.token,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};
export const fetchTableSchema = async (requestBody) => {
  const { host, port, username, password, database, tableName } = requestBody;
  console.log("req in fetch schema", requestBody);
  if (!host || !port || !username || !database || !tableName) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing required fields in request body",
      }),
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/databaseCard/fetch-schema`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host,
        port,
        username,
        password,
        database,
        tableName,
      }),
    });
    console.log("fetch schema", response.data);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch table schema");
    }

    return response;
  } catch (error) {
    console.error("Error fetching table schema:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
// export const fetchTableSchema = async (reqBody) => {
//   const { host, port, username, password, database, tableName } = reqBody;

//   if (!host || !port || !username || !database || !tableName) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: "Missing required fields in request body",
//       }),
//       { status: 400 }
//     );
//   }

//   const pool = new Pool({
//     user: username,
//     host: host,
//     database: database,
//     password: password,
//     port: port,
//     ssl: { rejectUnauthorized: false },
//   });

//   const client = await pool.connect();
//   try {
//     // Query to get column names and their data types from information_schema
//     const result = await client.query(
//       `SELECT
//         column_name as "name",
//         data_type as "type",
//         character_maximum_length as "maxLength",
//         is_nullable = 'YES' as "nullable",
//         column_default as "defaultValue"
//       FROM information_schema.columns
//       WHERE table_name = $1
//       ORDER BY ordinal_position`,
//       [tableName.toLowerCase()] // PostgreSQL typically uses lowercase for table names
//     );

//     if (result.rows.length === 0) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           error: "Table not found or has no columns",
//         }),
//         { status: 404 }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         table: tableName,
//         columns: result.rows,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching table schema:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: "Error fetching table schema",
//         details: error.message,
//       }),
//       { status: 500 }
//     );
//   } finally {
//     client.release();
//     await pool.end();
//   }
// };

export const fetchTableData = async (
  dbConfig,
  table,
  columns,
  conditions,
  limit
) => {
  try {
    const response = await axios.post(`${API_URL}/database/get/table/data`, {
      dbConfig,
      table,
      columns: columns || [],
      conditions: conditions || [], // Include conditions in the request
      limit,
    });
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

// export const insertDataInTable = async (dbConfig, table, columnData) => {
//   try {
//     const response = await axios.post(`${API_URL}/database/table/insert`, {
//       dbConfig,
//       table,
//       columnData,
//     },
//       // {
//       //   headers: {
//       //     Authorization: "Bearer " + auth.token,
//       //   },
//       // }
//     );
//     return response.data; // Return the retrieved data
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error; // Re-throw the error for further handling
//   }
// };

export const joinDbData = async (dbConfig, data) => {
  try {
    const response = await axios.post(
      `${API_URL}/database/join/dbdata`,
      {
        dbConfig,
        data,
      }
      // {
      //   headers: {
      //     Authorization: "Bearer " + auth.token,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error joining database data:", error);
    throw error;
  }
};

export const executeQuery = async (dbConfig, query) => {
  try {
    const response = await axios.post(`${API_URL}/database/execute-query`, {
      dbConfig,
      query,
    });
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

// Frontend Code
export const updateTableData = async (
  dbConfig,
  table,
  columnsToUpdate,
  conditionType,
  conditions
) => {
  try {
    const response = await axios.post(`${API_URL}/database/update/table/data`, {
      dbConfig,
      table,
      columnsToUpdate,
      conditionType,
      conditions,
    });

    return response.data; // Return the updated rows or a success message
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error(error.response?.data?.error || "Error updating table data");
  }
};
export const deleteTableData = async (
  dbConfig,
  table,
  conditionColumn,
  conditionValue
) => {
  try {
    // Sending the DELETE request to the backend
    const response = await axios.post(`${API_URL}/database/delete/table/data`, {
      dbConfig,
      table,
      conditionColumn,
      conditionValue,
    });

    // Return the response data (could be a success message or the deleted rows)
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const insertTableData = async (dbConfig, table, columns) => {
  try {
    // Sending the DELETE request to the backend
    const response = await axios.post(`${API_URL}/database/insert/table/data`, {
      dbConfig,
      table,
      columns,
    });

    // Return the response data (could be a success message or the deleted rows)
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const transformTableData = async (
  dbConfig,
  tableName,
  aggregationType,
  operation,
  columnName
) => {
  try {
    // Sending the DELETE request to the backend
    const response = await axios.post(
      `${API_URL}/database/transform/table/data`,
      {
        dbConfig,
        tableName,
        aggregationType,
        operation,
        columnName,
      }
    );

    // Return the response data (could be a success message or the deleted rows)
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Re-throw the error for further handling
  }
};
