"use client";

import { useState } from "react";
import { Card } from "antd";
import {
  CloseOutlined,
  RightOutlined,
  MessageOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import CustomHandle from "../../../../../ui/customHandle/CustomHandle";
import SendEmailCard from "./NotificationSubComp/SendEmailCard";
import HeaderDesignCard from "../../HeaderDesignCard/HeaderDesignCard";
import AdvancedCardsIcon from "../../../../../assets/AdvancedCardsIcon.svg";
import { useReactFlow } from "@xyflow/react";

export default function NotificationsNode({ data, id }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showSendEmailCard, setShowSendEmailCard] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSaveEmailConfig = (emailConfig) => {
    console.log("Email Config from Callback: ", emailConfig);
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, emailConfig } } : node
      )
    );
  };

  const notificationTools = [
    // {
    //   id: "custom-smtp",
    //   title: "Custom SMTP Email Senders",
    //   description: "Send email via custom SMTP",
    //   icon: <MailOutlined className="text-green-500 text-xl" />,
    // },
    // {
    //   id: "email-notification",
    //   title: "Send Email Notification",
    //   description: "Send email via Gumloop",
    //   icon: <MailOutlined className="text-green-500 text-xl" />,
    // },
    // {
    //   id: "sms-notification",
    //   title: "Send SMS Notification",
    //   description: "Send SMS via Gumloop",
    //   icon: <PhoneOutlined className="text-green-500 text-xl" />,
    // },
    // {
    //   id: "sendgrid-email",
    //   title: "SendGrid Email Sender",
    //   description: "Send email via SendGrid",
    //   icon: <MailOutlined className="text-green-500 text-xl" />,
    // },
    {
      id: "sendEmailCard",
      title: "Custom SMTP Email Sender",
      description: "Send email via custom SMTP",
      icon: <MailOutlined className="text-green-500 text-xl" />,
    },
  ];

  if (!isOpen) return null;
  // if (showSendEmailCard) return <SendEmailCard />;

  return (
    <div className="relative w-[26vw] flex flex-center flex-col ">
      <CustomHandle
        type="target"
        position={Position.Top}
        tooltipText="Drag to connect as a target!"
      />
      <HeaderDesignCard
        gradientColors={["#00000000", "#64F661", "#29FF3E"]}
        iconSrc={AdvancedCardsIcon}
        initialHeader="Advanced Card"
        titleText="Notification Card"
        helperText="Notify many via customizable Cards"
        infoButtonText="Learn more about Notification"
        primaryTextColor="#2A8C07"
        titleTextColor="#087906"
      />
      {!showSendEmailCard && (
        <Card className="max-w-md rounded-3xl ">
          <div className="bg-green-100 p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-xl">
                  <MessageOutlined className="text-green-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Node Category
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Notifications
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:bg-green-200 p-1 rounded-full"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <p className="text-gray-600 mt-4">
              Send alerts via different channels
            </p>
          </div>

          <div className=" overflow-y-auto p-4">
            {notificationTools.map((tool) => (
              <NotificationToolItem
                key={tool.id}
                {...tool}
                onClick={() => {
                  if (tool.id === "sendEmailCard") {
                    setShowSendEmailCard(true);
                  } else {
                    data.onSelectTool?.(tool.id, tool.title);
                  }
                }}
              />
            ))}
          </div>
        </Card>
      )}
      {showSendEmailCard && <SendEmailCard onSave={handleSaveEmailConfig} />}

      <CustomHandle
        type="source"
        position={Position.Bottom}
        tooltipText="Drag to connect as a source!"
      />
    </div>
  );
}

function NotificationToolItem({ title, description, icon, onClick }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 cursor-pointer mb-2"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-xl">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <RightOutlined className="text-gray-400 text-lg" />
    </div>
  );
}
