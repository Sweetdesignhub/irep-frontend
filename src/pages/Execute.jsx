import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Button, Spin, message, Card, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getRuleByOrgId } from "../services/rule.services/";
import { fetchNodesAndEdges } from "../services/rule.services";
import ExecutableDecisionEngine from "../components/executableDecisionEngine/ExecutableDecisionEngine";
import axios from "axios";

const { Text } = Typography;

function Execute() {
  const [rules, setRules] = useState([]);
  const [ruleId, setRuleId] = useState("");
  const [contents, setContents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (selectedRule) {
      loadNodesAndEdges(selectedRule.id);
    }
  }, [selectedRule]);

  // Sanitize and format the activation date
  // const formattedDate = new Intl.DateTimeFormat("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }).format(new Date(selectedRule.activationDate));

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await getRuleByOrgId("1");
      const rules = response?.data?.rules || [];
      const formattedRules = rules.map((rule) => ({
        ...rule,
        createdAt: new Date(rule.createdAt).toLocaleDateString(),
      }));
      setRules(formattedRules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      message.error("Failed to retrieve data.");
    } finally {
      setLoading(false);
    }
  };

  const loadNodesAndEdges = async (ruleId) => {
    try {
      const { nodes, edges } = await fetchNodesAndEdges(ruleId);
      console.log("Nodes and Edges fetched:", { nodes, edges });
      setNodes(nodes);
      setEdges(edges);
    } catch (error) {
      console.error("Failed to load nodes and edges:", error);
    }
  };

  const handleMenuClick = async ({ key }) => {
    const selectedRule = rules.find((rule) => rule.id === parseInt(key));
    if (!selectedRule) {
      console.error("Selected rule not found.");
      return;
    }

    setSelectedRule(selectedRule);
    setRuleId(selectedRule.id);

    try {
      // Fetch the .js file for the selected rule
      const host =
        import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
      const response = await axios.get(
        `${host}/rules/engine-rule/get/${selectedRule.id}`
      );
      const { content } = response.data;
      console.log("Content of this rule: ", content);
      // Extract the flow JSON object from the content
      const extractedContent = extractFlowJSON(content);
      setContents(extractedContent);

      console.log("Extracted JSON object:", contents);
    } catch (error) {
      console.error("Error fetching flow file:", error);
    }
  };

  // Function to extract the flow JSON from the JavaScript content
  const extractFlowJSON = (content) => {
    try {
      const cleanedContent = content.trim();
      const match = cleanedContent.match(/export const flow = ({.*?});/s);

      if (match && match[1]) {
        const jsonString = match[1];
        return JSON.parse(jsonString); // Return parsed JSON object
      } else {
        throw new Error("Flow JSON object not found.");
      }
    } catch (err) {
      console.error("Error parsing flow content:", err);
      return null;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {rules.map((rule) => (
        <Menu.Item key={rule.id}>{rule.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Execute</h2>
      {loading ? (
        <Spin tip="Loading rules..." />
      ) : (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            {selectedRule ? selectedRule.name : "Select a Rule"}{" "}
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
      {selectedRule && (
        <div>
          {/* <Card title="Rule Details" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <span><b>Name:</b> {selectedRule.name}</span>
              <span><b>Description:</b> {selectedRule.description}</span>
              <span><b>Status:</b> {selectedRule.status}</span>
              <span><b>Type:</b> {selectedRule.ruleType}</span>
              <span><b>Activation Date:</b> {selectedRule.activationDate}</span>
              <span><b>Category:</b> {selectedRule.category}</span>
            </div>
          </Card> */}
          <Card title="Rule Details" className="mt-5 shadow-md">
            <div className="flex flex-wrap gap-5">
              <Text>
                <b>Name:</b> {selectedRule.name}
              </Text>
              <Text>
                <b>Description:</b> {selectedRule.description}
              </Text>
              <Text>
                <b>Status:</b> {selectedRule.status}
              </Text>
              <Text>
                <b>Type:</b> {selectedRule.ruleType}
              </Text>
              <Text>
                <b>
                  Activation Date:
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(selectedRule.activationDate))}
                </b>
              </Text>
              <Text>
                <b>Category:</b> {selectedRule.category}
              </Text>
            </div>
          </Card>
          {/* Render ExecutableDecisionEngine only if contents are set */}
          {contents && <ExecutableDecisionEngine flowData={contents} />}
        </div>
      )}
    </div>
  );
}

export default Execute;
