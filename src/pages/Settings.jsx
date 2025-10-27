// import React from 'react'
// import SaveDataset from '../components/settings/SaveDatasets';
// import SecretKeys from '../components/settings/SecretKeys';

// function Settings() {
//     return (
//         <div>
//             <SecretKeys />
//             <SaveDataset />
//         </div>
//     )
// }

// export default Settings;
import { useEffect, useState } from "react";
import { Tabs, Select, Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import SecretKeys from "../components/settings/SecretKeys";
import SaveDataset from "../components/settings/SaveDatasets";

const sidebarItems = ["Rule Engine Secret Keys"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "configuration"
  ); // Default to 'configuration' if no tab is saved
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = window.document.documentElement;
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab); // Save active tab to localStorage
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        {/* <Button
                    icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button> */}
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs
          activeKey={activeTab} // Bind activeTab state to Tabs component
          className="w-[400px]"
          onChange={setActiveTab}
        >
          <Tabs.TabPane tab="Datasets Saved" key="Dataset" />
          <Tabs.TabPane tab="Configuration" key="configuration" />
        </Tabs>

        {/* <Select
          placeholder="Organisation"
          className="w-[200px] dark:bg-gray-700 dark:text-white"
        >
          <Select.Option value="org1">Organisation 1</Select.Option>
          <Select.Option value="org2">Organisation 2</Select.Option>
        </Select> */}
      </div>

      {activeTab === "Dataset" && <SaveDataset />}
      {activeTab === "configuration" && <SecretKeys />}
    </div>
  );
}
