import React from "react";
import { Layout, Menu, Collapse } from "antd";
import {
    CalculatorOutlined,
    CloudUploadOutlined,
    BranchesOutlined,
    ContainerOutlined,
    FunctionOutlined,
    DownloadOutlined,
    AppstoreAddOutlined,
    ApiOutlined,
    FileTextOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { cardDetails } from "./cardDetails"; // Import the cardDetails data

const { Sider } = Layout;
const { Panel } = Collapse;

const SidebarNew = () => {
    // Map icon names to Ant Design icons
    const iconComponents = {
        CalculatorOutlined,
        CloudUploadOutlined,
        BranchesOutlined,
        ContainerOutlined,
        FunctionOutlined,
        DownloadOutlined,
        AppstoreAddOutlined,
        ApiOutlined,
        FileTextOutlined,
        SearchOutlined,
    };

    return (
        <Sider
            width={300}
            style={{
                background: "#fff",
                borderRight: "1px solid #e8e8e8",
                height: "100vh",
                overflowY: "auto",
            }}
        >
            <Collapse defaultActiveKey={["0"]} ghost>
                {cardDetails.map((section, index) => (
                    <Panel header={section.panel} key={index}>
                        <Menu mode="inline" style={{ borderRight: 0 }}>
                            {section.cards.map((card, cardIndex) => {
                                const IconComponent = iconComponents[card.iconName];
                                return (
                                    <Menu.Item
                                        key={`${index}-${cardIndex}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "8px 16px",
                                        }}
                                    >
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center rounded-full ${card.iconColor}`}
                                        >
                                            {IconComponent && <IconComponent style={{ color: "#fff" }} />}
                                        </div>
                                        <div style={{ marginLeft: 12 }}>
                                            <div style={{ fontWeight: 500 }}>{card.contentName}</div>
                                            {card.description && (
                                                <div style={{ fontSize: 12, color: "#666" }}>
                                                    {card.description}
                                                </div>
                                            )}
                                        </div>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    </Panel>
                ))}
            </Collapse>
        </Sider>
    );
};

export default SidebarNew;