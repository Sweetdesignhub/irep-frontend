
import React, { useState, useEffect, useRef } from "react";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Card from "../components/rule-management/Card";
import ListGridViewToggle from "../components/rule-management/ListGridViewToggle";
import CreateRule from "../components/rule-management/CreateRule";
import {
  createRuleApi,
  getRuleByOrgId,
  importRule,
} from "../services/rule.services";
import { PlusOutlined } from "@ant-design/icons";
import { message, Input } from "antd";
import Loading from "../components/common/Loading";
import SiderSettingsIcon from "../assets/SiderSettingsIcon.png";
import Logistics_dashboard from "../assets/Logistics-Dashboard.svg";
import Finance_Dashboard from "../assets/Finance_Dashboard.svg";
import Security_dashboard from "../assets/Security_Dashboard.svg";
import Operations_Dashboard from "../assets/Operations_Dashboard.svg";
import HR_DashboardIcon from "../assets/HR_Dashboard.svg";
import { Navigate, useNavigate } from "react-router-dom";

const cardsData = [
  {
    logoURL: Logistics_dashboard,
    // "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2F6f7f5f4d15c945fd991be7888e12b033",
    title: "Logistics",
    quantity: "0",
  },
  {
    logoURL: HR_DashboardIcon,
    // "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2F9fb021977df6407cb86418220826e888",
    title: "HR",
    quantity: "0",
  },
  {
    logoURL: Security_dashboard,
    // "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Ffaf8cd8da2d844558b27aee4b2f1d523",
    title: "Security",
    quantity: "0",
  },
  {
    logoURL: Finance_Dashboard,
    // "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2F72a8232ba112488bbe1ac82057eb06d8",
    title: "Finance",
    quantity: "0",
  },
  {
    logoURL: Operations_Dashboard,
    // "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2F26a0a2da30164227b4a770db7df825aa",
    title: "Operations",
    quantity: "0",
  },
];

const defaultCurrOrg = {
  id: "1",
  name: "HH",
  description: "Hemanth Test org - Don't Touch",
  owner: "63d2ba28790a3956daf1d576",
  createdAt: "2024-03-21T20:10:05.977Z",
  updatedAt: "2024-03-21T20:10:05.977Z",
  __v: 0,
};

function RuleManagement() {
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [updatedCardsData, setUpdatedCardsData] = useState(cardsData);
  const [rules, setRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCreateRuleClick = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const currOrg = defaultCurrOrg;
  const filterSearch = rules.filter(
    (rule) =>
      rule.name && rule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleView = (newView) => {
    setView(newView);
  };

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await getRuleByOrgId(currOrg.id);
      console.log("Retrieved data:", response);
      const rules = response?.data?.rules;
      const counts = response?.data?.categoryCounts;
      console.log("rules :", rules);

      const tempRules = rules.map((rule) => ({
        ...rule,
        createdAt: new Date(rule.createdAt).toLocaleDateString(),
      }));
      const newCardsData = cardsData.map((card) => {
        return {
          ...card,
          quantity: counts[card.title.toLowerCase()].toString(),
        };
      });
      setRules(tempRules);
      setUpdatedCardsData(newCardsData);
    } catch (error) {
      console.error("Error when Create Rule:", error);
      // alert("Failed to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  const createRule = async (ruledata) => {
    try {
      const response = await createRuleApi(currOrg.id, ruledata);
      console.log("Retrieved data:", response);
      const newRule = response?.data;
      setRules((prevRules) => [...prevRules, newRule]);

      // Update the cardsData state
      setUpdatedCardsData((prevCardsData) => {
        const updatedCardsData = prevCardsData.map((card) => {
          if (card.title.toLowerCase() === newRule.category.toLowerCase()) {
            return {
              ...card,
              quantity: (parseInt(card.quantity, 10) + 1).toString(),
            };
          }
          return card;
        });
        return updatedCardsData;
      });

      setIsModalOpen(false);
      message.success("Rule created successfully!");
      return newRule;
    } catch (error) {
      console.error("Error when Create Rule:", error);
      message.error("Failed to create rule. Please try again.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("Called ", file);

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        let parsedData;
        try {
          const fileContent = event.target.result;
          parsedData = JSON.parse(fileContent);
          console.log("Parsed JSON data:", JSON.parse(fileContent));
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }

        try {
          await importRule(currOrg.id, parsedData);
          message.success("Rules imported successfully");
          fetchRules();
        } catch (error) {
          console.error("Error importing rules: ", error);
          message.error("Unable to import rule");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsText(file);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [currOrg]);

  return (
    <div className="h-full px-16 py-5  overflow-y-auto">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="font-Monserrat pt-1 text-[#343434] text-[20px] font-bold flex flex-row">
            Rule Management{" "}
            <p className="font-medium mx-2 text-[16px] mt-0.5">
              ({rules.length})
            </p>
          </h1>
        </div>

        <div className="ml-10 flex items-center justify-end">
          <Input
            type="text"
            placeholder="Search rules..."
            // value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-4 py-1 px-4 w-48 rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F6616100] text-black focus:border-transparent"
          />
          <button
            className="bg-white shadow-md px-4 hover:opacity-90 text-[#FFFFFF] rounded-xl w-36 py-1 text-sm flex items-center justify-around mr-6 relative"
            // disabled
          >
            <label
              htmlFor="file-upload"
              className="flex text-[#7F1DF8] font-semibold text-[12px] items-center justify-around w-full cursor-pointer"
            >
              Import Rule
              <PlusOutlined className="h-6" />
            </label>

            <Input
              id="file-upload"
              type="file"
              // multiple
              className="absolute top-0 left-0 shadow-md w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".rule"
              // ref={fileInputRef}
            />
          </button>
          <button
            className="bg-white shadow-md hover:opacity-90 text-[#FFFFFF] rounded-xl w-44 py-1 text-sm flex items-center justify-around mr-6 relative"
            onClick={handleCreateRuleClick}
          >
            <label className="flex  font-semibold  text-[#7F1DF8] text-[12px] items-center justify-around w-full cursor-pointer px-4">
              Create New Rule
              <PlusOutlined className="h-6" />
            </label>
          </button>

          <img src={SiderSettingsIcon} onClick={() => navigate("/settings")} />
          <div>
            <button
              className={`mr-2 p-2  ${
                view === "grid"
                  ? "bg-white rounded-full text-gray-800 border-2"
                  : "text-gray-300"
              }`}
              onClick={() => toggleView("grid")}
            >
              {/* <IoGrid /> */}
              <AppstoreOutlined />
            </button>
            <button
              className={` p-2 ${
                view === "list"
                  ? "bg-white rounded-full text-gray-800 border-2"
                  : "text-gray-300"
              }`}
              onClick={() => toggleView("list")}
            >
              {/* <PiListBold /> */}
              <UnorderedListOutlined />
            </button>
          </div>
        </div>
      </div>

      <>
        {loading && <Loading />}

        <div className="flex flex-wrap mt-6">
          {updatedCardsData.map((data, index) => (
            <div
              key={index}
              className="flex w-full gap-2 px-2 mb-4 sm:w-1/2 md:w-1/3 lg:w-1/5"
            >
              <Card
                logoURL={data.logoURL}
                title={data.title}
                quantity={data.quantity}
              />
            </div>
          ))}
        </div>

        <div>
          <ListGridViewToggle
            view={view}
            ruleItems={filterSearch}
            currOrg={currOrg}
            fetchRules={fetchRules}
          />
        </div>

        {isModalOpen && (
          <CreateRule
            closeModal={() => setIsModalOpen(false)}
            isOpen={isModalOpen}
            newRule={createRule}
          />
        )}

        {isImportModalOpen && (
          <ImportModal
            closeModal={() => setIsImportModalOpen(false)}
            isOpen={isImportModalOpen}
            // newRule={createNewRule}
          />
        )}
      </>
    </div>
  );
}

export default RuleManagement;
