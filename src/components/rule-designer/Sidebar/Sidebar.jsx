
import React, { useState } from "react";
import { useDnD } from "../../../contexts/DnDContext";
import { Collapse, Button, Input, Card } from "antd";
import { cardDetails } from "./cardDetails";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloseOutlined,
  ApiOutlined,
  EditOutlined,
  SearchOutlined,
  DatabaseOutlined,
  PlusOutlined,
  ReloadOutlined,
  MergeCellsOutlined,
  AppstoreAddOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ScissorOutlined,
  ConsoleSqlOutlined,
  CloudUploadOutlined,
  BranchesOutlined,
  ContainerOutlined,
  CalculatorOutlined,
  FunctionOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import RuleCardsIcon from "../../../assets/RuleCardsIcon.svg";
import BasicCardsIcon from "../../../assets/BasicCardsIcon.svg";
import AdvancedCardsIcon from "../../../assets/AdvancedCardsIcon.svg";
import ModelTrainingCardsIcon from "../../../assets/ModelTrainingCardsIcon.svg";
import DatabaseCardsIcon from "../../../assets/DatabaseCardsIcon.svg";
import PredictionCardsIcon from "../../../assets/PredictionCardsIcon.svg";

const { Panel } = Collapse;

const iconMap = {
  DownloadOutlined,
  AppstoreAddOutlined,
  ApiOutlined,
  FileTextOutlined,
  SearchOutlined,
  MergeCellsOutlined,
  EditOutlined,
  ConsoleSqlOutlined,
  PlusOutlined,
  ReloadOutlined,
  ScissorOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  BranchesOutlined,
  ContainerOutlined,
  CalculatorOutlined,
  FunctionOutlined,
  FileSearchOutlined,
};

const Sidebar = ({ visible, onClose }) => {
  const [_, setType] = useDnD();
  const [search, setSearch] = useState("");

  const onDragStart = (event, cardData) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(cardData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const renderIcon = (iconName, iconColor = "bg-black") => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? (
      <IconComponent
        className={`p-1 text-2xl text-white rounded-lg shadow-md ${
          iconColor || "bg-black"
        }`}
        style={{ boxShadow: "0px 4px 16px 0px #FF9B2540" }}
      />
    ) : null;
  };
  const genExtra = () => <SettingOutlined />;
  const genImage = (panelName) => {
    let imageSrc;

    switch (panelName) {
      case "Rule Cards":
        imageSrc = RuleCardsIcon;
        break;
      case "Basic Cards":
        imageSrc = BasicCardsIcon;
        break;
      case "Advanced Cards":
        imageSrc = AdvancedCardsIcon;
        break;
      case "AI Model Training":
        imageSrc = ModelTrainingCardsIcon;
        break;
      case "Prediction and Model Suggestions":
        imageSrc = PredictionCardsIcon;
        break;
      case "Database Cards":
        imageSrc = DatabaseCardsIcon;
        break;
      default:
        imageSrc = RuleCardsIcon; // Default fallback image
    }

    return (
      <img
        src={imageSrc}
        alt={panelName}
        className="w-8 h-8 p-1 inline-block mr-2 shadow-md rounded"
      />
    );
  };

  const collapseItems = cardDetails.map((section, index) => ({
    key: index + 1,

    header: (
      <div className="flex items-center">
        {genImage(section.panel)}
        {/* Image before the header */}
        <span>{section.panel}</span>
      </div>
    ),
    // header: section.panel,
    children: (
      <>
        {section.cards.map((card, cardIndex) => (
          <motion.div
            key={cardIndex}
            className={`flex items-center justify-between py-2  font-normal border-b cursor-move hover:bg-gray-100/50 transition-colors duration-200 ${
              card.needSource ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onDragStart={(event) =>
              !card.isDisabled && onDragStart(event, card)
            }
            draggable={!card.isDisabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-1/5 mx-4">
              {renderIcon(card.iconName, card.iconColor)}
            </div>
            <div className="w-4/5 text-start">{card.contentName}</div>
          </motion.div>
        ))}
      </>
    ),
    extra: genExtra(),
  }));

  const getUiCards = () => {
    return cardDetails.flatMap((section) =>
      section.cards.map((card) => ({
        contentName: card.contentName,
        type: card.type,
        needSource: card.needSource,
        iconName: card.iconName,
        isDisabled: card.isDisabled,
        inputField: card.inputField,
        flagColor: card.flagColor,
      }))
    );
  };

  const filteredCards = getUiCards().filter((val) =>
    val.contentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute z-50 bg-[#FEFEFE] left-5 h-[70vh] top-24 max-w-[20rem] overflow-y-auto shadow-lg rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="p-4 bg-[#FFFFFF] backdrop-blur-lg rounded-lg shadow-lg  border border-white/20"
            style={{
              background: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="mb-4 ">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold mb-4 font-[Montserrat] text-xl text-[#402665]">
                  Cards
                </h2>
                {/* <Button
                  icon={<CloseOutlined />}
                  shape="default"
                  onClick={onClose}
                  className="hover:bg-gray-100/50"
                /> */}
                {/* <Button
                  className={`rounded-full  nodrag`}
                  icon={
                    <CloseOutlined
                      style={{
                        color: "#FFFFFF",
                      }}
                    />
                  }
                  type="dashed"
                  shape="circle"
                  // onClick={toggleButton}
                  onClick={onClose}
                  style={{
                    background: "#FB29FF",
                    border: "1px solid #FFFFFF",
                    width: "40px", // Increase size
                    height: "40px", // Increase size
                    boxShadow: "0px 8px 17px 0px #F513FA73",
                    zIndex: 999,
                  }}
                /> */}
              </div>
              <div className="relative">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search card by name..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#F3F4F7] border border-white/20 hover:border-white/40 focus:border-white/40"
                />
                {search && search.length > 0 && (
                  <motion.div
                    className="absolute left-0 z-50 overflow-y-auto text-black rounded-lg top-10 bg-white/50 backdrop-blur-lg w-60 max-h-80 card-scroll-bar border border-white/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredCards.length > 0 ? (
                      filteredCards.map((val, ind) => (
                        <motion.div
                          key={ind}
                          className={`flex items-center justify-between px-2 py-2 font-normal bg-white/50 hover:bg-white/70 transition-colors duration-200 border-b border-white/20 ${
                            val.needSource
                              ? "opacity-100 cursor-not-allowed"
                              : ""
                          }`}
                          onDragStart={(event) =>
                            !val.isDisabled && onDragStart(event, val)
                          }
                          draggable={!val.isDisabled}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-1/5 mx-4 ">
                            {renderIcon(val.iconName, val.iconColor)}
                            {/* {renderIcon(val.iconName, bg - red)} */}
                          </div>
                          <div className="w-4/5 ">{val.contentName}</div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-40 text-xl text-gray-600">
                        No Card Found
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            <div
              className="mt-8 card-scroll-bar"
              style={{
                // maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              <Collapse
                accordion
                // defaultActiveKey={["1"]}
                ghost
                size="middle"
                expandIconPosition="end"
                className="font-montserrat font-2xl backdrop-blur-lg border shadow-lg rounded-lg overflow-hidden"
              >
                {collapseItems.map((item) => (
                  // <div>
                  //   <img
                  //     src={RuleCardsIcon}
                  //     alt="Medical Icon"
                  //     className="attribute-node-drop-down-img"
                  //   />
                  // </div>
                  <Panel
                    header={item.header}
                    key={item.key}
                    style={{ backgroundColor: "#FEFEFE" }}
                    className="font-semibold !font-xl text-left pt-2 !text-red backdrop-blur-lg border border-white/20"
                  >
                    {item.children}
                  </Panel>
                ))}
              </Collapse>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
