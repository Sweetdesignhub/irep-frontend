

import axios from "axios";

const API_URL = import.meta.env.VITE_PY_API_URL; // Adjust this URL based on your backend

export const fetchPredictedData = async (values) => {
  try {
    console.log("API_URL --> ", API_URL);

    const response = await axios.post(`${API_URL}/response`, values);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};
