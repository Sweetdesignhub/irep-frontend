

import { useContext, useState } from "react";
// import AuthContext from "../../contexts/AuthProvider";
import Dropdown from "./Dropdown";
// import { MdCheck } from "react-icons/md";
// import { RxCross2 } from "react-icons/rx";
// import axios from "../../api/axios";
// import { toast } from "sonner";
// import { message } from "antd";

//for temporary purpose, using global variable
const getBorderColor = (category) => {
  switch (category) {
    case "finance":
      return "#69D0FF";
    case "hr":
      return "#FE8D43";
    case "operations":
      return "#5534A5";
    case "logistics":
      return "#B844EE";
    case "security":
      return "#00FF00";
    default:
      return "#000000";
  }
};
const category = "Finance";
const execution = "30";
const trend =
  "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93";
const errorRate = "10%";
const borderColor = "#69D0FF";

export const GridView = ({ ruleItems, currOrg, fetchRules }) => {
  const [editStates, setEditStates] = useState({});
  const [loading, setLoading] = useState(false);
  // const { auth } = useContext(AuthContext);
  const [deleteLoad, setDeleteLoad] = useState(false);

  const handleEditClick = (id) => {
    setEditStates((prevState) => ({
      ...prevState,
      [id]: { ...ruleItems.find((item) => item.id === id), isEditing: true },
    }));
  };

  const handleSaveClick = () => {

  };

  const handleCancelClick = (id) => {
    setEditStates((prevState) => ({
      ...prevState,
      [id]: { isEditing: false },
    }));
  };

  const handleDeleteClick = () => {

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
    const link = `${host}/api/rule-management/api/?id=${id}&secret=${jsonStruct.secret}`;

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
    <div className="grid grid-cols-1 gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3 ">
      {ruleItems.map((ruleItem, index) => {
        const isEditing = editStates[ruleItem.id]?.isEditing;
        return (
          <div
            key={index}
            className={`p-4 bg-white dark:bg-gray-800 relative rounded-2xl border-l-4 dark:border-gray-600`}
            style={{ borderLeftColor: getBorderColor(ruleItem.category) }}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text">
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
              </h3>

              <div className="flex mb-4">
                <p className="text-gray-600 dark:text-white">
                  {ruleItem.createdAt}
                </p>
                <button className="text-2xl">
                  {isEditing ? (
                    <div className="flex items-center justify-evenly">
                      <button
                        onClick={() => handleSaveClick(ruleItem.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <MdCheck className="text-2xl" />
                      </button>
                      <button
                        onClick={() => handleCancelClick(ruleItem.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <RxCross2 className="text-2xl" />
                      </button>
                    </div>
                  ) : (
                    <Dropdown
                      menuItems={[
                        {
                          label: "Edit",
                          onClick: () => handleEditClick(ruleItem.id),
                        },
                        {
                          label: "Edit Rule",
                          link: `/rule-designer/${ruleItem.id}`,
                        },
                        {
                          label: "Copy Endpoint",
                          onClick: () =>
                            handleCopyClick(ruleItem.id, ruleItem.secret),
                        },
                        {
                          label: "Export",
                          onClick: () => handleExportClick(ruleItem),
                        },
                        {
                          label: "Delete",
                          onClick: () => handleDeleteClick(ruleItem.id),
                        },
                      ]}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="py-3 border-b-2">
              <p className="mb-2 text-sm">
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
              </p>
              <p className="mb-2 text-sm">{ruleItem.category}</p>
            </div>

            <div className="flex justify-between mt-3">
              <div className="flex flex-col items-center justify-center lg:border-r-2 lg:pr-11 sm:border-r-0 sm:pr-0">
                <p className="font-bold">{execution}</p>
                <span className="text-gray-600 dark:text-white">
                  {" "}
                  Executions
                </span>
              </div>
              <div className="flex flex-col items-center justify-center lg:border-r-2 lg:pr-11 sm:border-r-0 sm:pr-0">
                <img src={trend} alt="trend" />
                <span className="text-gray-600 dark:text-white"> Trend</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-bold">{errorRate}</p>
                <span className="text-gray-600 dark:text-white">
                  {" "}
                  Error Rate
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
