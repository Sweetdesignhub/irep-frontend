
import axios from "axios";
import { validateYupSchema } from "formik";
import { message } from "antd";

const API_URL = `${import.meta.env.VITE_API_URL}/rules`; // Adjust this URL based on your backend

export const saveRule = async (id, rule) => {
  try {
    const response = await axios.post(`${API_URL}/rule/save`, { id, rule });
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getAllRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/rules`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getRuleByIndex = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/rule/${id}`);
    return response.data.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const deleteRuleByIndex = async (index) => {
  try {
    await axios.delete(`${API_URL}/rule/${index}`); // Return the retrieved data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getRequestStructure = async (index) => {
  try {
    const data = await axios.get(`${API_URL}/rule/reqJsonStruct/${index}`); // Return the retrieved data
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

// Version
export const createNewVersionByRuleId = async (
  id,
  updatedRule,
  versionName
) => {
  try {
    const data = await axios.post(`${API_URL}/rule/version/create/${id}`,{updatedRule,versionName}); // Return the retrieved data
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
  // message.error("Cooking Backend - create version");
};

export const getAllVersionByRuleId = async (id) => {
  try {
    const data = await axios.get(`${API_URL}/rule/version/${id}`); // Return the retrieved data
    return data.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const updateVersionByRuleId = async (versionId, updatedRule) => {
  try {
    console.log("updatedRule :",updatedRule);
    const data = await axios.post(`${API_URL}/rule/version/update/${versionId}`,{updatedRule}); // Return the retrieved data
    console.log("data :",data);
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const updateCurrentVersionAndRule = async (ruleId,updatedRule,versionId) => {
  try {
    console.log("updatedRule :",updatedRule);
    const data = await axios.post(`${API_URL}/rule/version/save/${ruleId}`,{versionId,updatedRule}); // Return the retrieved data
    console.log("data :",data);
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};