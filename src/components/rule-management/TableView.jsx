
import { useContext, useState } from "react";
// import AuthContext from "../../contexts/AuthProvider";
import Dropdown from "./Dropdown";
// import { CheckCircleOutlined } from "react-icons/md";
// import { CloseOutlined } from "react-icons/rx";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { deleteRule, editRule } from "../../services/rule.services";
import { message } from "antd";

// import axios from "../../api/axios";

//for temporary purpose, using global variable
const category = "Finance";
const execution = "30";
const trend =
  "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93";
const errorRate = "10%";

export const TableView = ({ ruleItems, currOrg, fetchRules }) => {
  const [editStates, setEditStates] = useState({});
  const [loading, setLoading] = useState(false);
  // const { auth, currOrg: contextCurrOrg } = useContext(AuthContext);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const handleEditClick = (id) => {
    setEditStates((prevState) => ({
      ...prevState,
      [id]: { ...ruleItems.find((item) => item.id === id), isEditing: true },
    }));
  };

  const handleSaveEditedRuleData = async (id) => {
    const rule = editStates[id];
    setLoading(true);
    try {
      const response = await editRule(rule, currOrg.id);
      message.success("Rule updated successfully");
      fetchRules();
      setEditStates((prevState) => ({
        ...prevState,
        [id]: { ...prevState[id], isEditing: false },
      }));
    } catch (error) {
      console.error("Error when Edit Rule:", error);
      message.error("Unable to updated Rule");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id) => {
    setEditStates((prevState) => ({
      ...prevState,
      [id]: { isEditing: false },
    }));
  };

  const handleDeleteClick = async (id) => {
    setDeleteLoad(true);
    setLoading(true);
    try {
      await deleteRule(id, currOrg.id);
      setDeleteLoad(false);
      message.success("Rule deleted successfully");
      fetchRules();
    } catch (error) {
      console.error("Error when Edit Rule:", error);
      message.error("Unable to updated Rule");
    } finally {
      setLoading(false);
    }
  };

  const handleExportClick = (rule) => {
    const blob = new Blob([JSON.stringify(rule)], { type: "text/plain" });
    const link = document.createElement("a");

    link.download = `${rule.name}.rule`;

    link.href = window.URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleCopyClick = async (id, secret) => {
    console.log("id -->", id);
    console.log("secret -->", secret);
    const host = import.meta.env.VITE_API_URL || "http://localhost:8080/rules";
    const link = `${host}/rules/engine-rule/process/${id}?secret=DnVpSy`;

    // Copy to clipboard
    try {
      // Use the Clipboard API if it's available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        message.success("Endpoint link copied to clipboard!"); // Notification
      } else {
        // Fallback for environments without the Clipboard API (e.g., HTTP)
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed"; // Prevent scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy"); // Fallback method
        document.body.removeChild(textArea);
        message.success("Endpoint link copied to clipboard!"); // Notification
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      message.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="w-full h-[63vh] mt-3 bg-gray-50 dark:bg-gray-800 px-4 pb-8 rounded-2xl overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10 rounded-xl">
          <tr className="h-20 ">
            <td className="w-1/5 pl-4 lg:w-1/8">Title</td>
            <td className="w-1/4 lg:w-1/6">Description</td>
            <td className="w-2/10 lg:w-1/8">Status</td>
            <td className="w-1/10 pl-2 lg:w-1/10">Category</td>
            <td className="w-1/8 lg:w-1/10">Activation Date</td>
            <td className="w-1/10 lg:w-1/10">Execution</td>
            <td className="w-1/14 lg:w-1/10">Trend</td>
            <td className="w-1/10 lg:w-1/10">Error Rate</td>
            <td className="w-1/20 lg:w-1/10">Action</td>
          </tr>
        </thead>
        <tbody>
          {ruleItems.map((ruleItem, index) => {
            console.log("Rule Details are: ", ruleItem);
            const isEditing = editStates[ruleItem.id]?.isEditing;

            return (
              // <tr
              //   key={index}
              //   className={` ${
              //     index % 2 === 0
              //       ? "bg-[#F5F7FAE5] dark:bg-gray-800"
              //       : "bg-white dark:bg-gray-700"
              //   }
              //   h-24 lg:h-26
              //   ${
              //     ruleItem.status === "ACTIVE"
              //       ? "hover:bg-[#E0FFE3] dark:hover:bg-green-800"
              //       : "hover:bg-[#FFF1E0] dark:hover:bg-yellow-600"
              //   }`}
              // >
              <tr
                key={index}
                className={` 
    ${
      index % 2 === 0
        ? "bg-[#F5F7FAE5] dark:bg-gray-800"
        : "bg-white dark:bg-gray-700"
    } 
    h-24 lg:h-26 
    ${
      ruleItem.status === "ACTIVE"
        ? "hover:bg-[#E0FFE3] dark:hover:bg-green-800"
        : "hover:bg-[#FFF1E0] dark:hover:bg-yellow-600"
    } 
    ${
      {
        logistics: "hover:bg-[#F0E8FF]",
        hr: "hover:bg-[#FFF1E0]",
        security: "hover:bg-[#E0FFE3]",
        finance: "hover:bg-[#E0F7FF]",
        operations: "hover:bg-[#FFF7E0]",
      }[ruleItem.category] || "hover:bg-gray-400"
    }`}
              >
                <td
                  className="pl-4"
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                  }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={ruleItem.name}
                      onChange={(e) =>
                        setEditStates((prevState) => ({
                          ...prevState,
                          [ruleItem.id]: {
                            ...prevState[ruleItem.id],
                            name: e.target.value,
                          },
                        }))
                      }
                      className="px-2 py-1 border rounded dark:bg-gray-500"
                    />
                  ) : (
                    ruleItem.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={ruleItem.description}
                      onChange={(e) =>
                        setEditStates((prevState) => ({
                          ...prevState,
                          [ruleItem.id]: {
                            ...prevState[ruleItem.id],
                            description: e.target.value,
                          },
                        }))
                      }
                      className="px-2 py-1 border rounded dark:bg-gray-500"
                    />
                  ) : (
                    ruleItem.description
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={editStates[ruleItem.id]?.status || ruleItem.status}
                      onChange={(e) =>
                        setEditStates((prevState) => ({
                          ...prevState,
                          [ruleItem.id]: {
                            ...prevState[ruleItem.id],
                            status: e.target.value,
                          },
                        }))
                      }
                      className="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="Active">ACTIVE</option>
                      <option value="Inactive">INACTIVE</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ruleItem.status === "ACTIVE"
                          ? "bg-green-100 text-[#17BA14]"
                          : "bg-red-100 text-[#BA7714]"
                      }`}
                    >
                      {ruleItem.status}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        {
                          logistics: "bg-[#D81DF8]",
                          hr: "bg-[#FC881D]",
                          security: "bg-[#17E82C]",
                          finance: "bg-[#18D5FF]",
                          operations: "bg-[#ED1212]",
                        }[ruleItem.category] || "bg-gray-400"
                      }`}
                    ></div>
                    <span
                      className="text-gray-800 font-medium"
                      style={{ textTransform: "uppercase" }}
                    >
                      {ruleItem.category}
                    </span>
                  </div>
                </td>
                <td>{ruleItem.createdAt}</td>
                <td>{ruleItem.ruleType}</td>
                <td>
                  <img src={trend} alt="logo" className="w-8 h-8" />
                </td>
                <td
                  className={
                    parseFloat(errorRate) <= 10
                      ? "text-[#17E82C]"
                      : "text-[#FF3B25]"
                  }
                >
                  {errorRate}
                </td>

                <td
                  className=""
                  style={{
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                >
                  {isEditing ? (
                    <div className="flex items-center justify-evenly">
                      <button
                        onClick={() => handleSaveEditedRuleData(ruleItem.id)}
                        className="text-green-500 hover:text-green-700 "
                      >
                        <CheckCircleOutlined className="text-2xl" />
                      </button>
                      <button
                        onClick={() => handleCancelClick(ruleItem.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <CloseOutlined className="text-2xl" />
                      </button>
                    </div>
                  ) : (
                    <Dropdown
                      menuItems={[
                        {
                          label: "Edit",
                          onClick: () => handleEditClick(ruleItem.id),
                          key: "edit",
                        },
                        {
                          label: "Edit Rule",
                          link: `/rule-designer/${ruleItem.id}`,
                          key: "editRule",
                        },
                        {
                          label: "Copy Endpoint!",
                          onClick: () =>
                            handleCopyClick(ruleItem.id, ruleItem.secret),
                          key: "copyEndpoint",
                        },
                        // { label: "Export", onClick: () => handleExportClick(ruleItem), key: "export" },
                        {
                          label: "Delete",
                          onClick: () => handleDeleteClick(ruleItem.id),
                          key: "delete",
                        },
                      ]}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
