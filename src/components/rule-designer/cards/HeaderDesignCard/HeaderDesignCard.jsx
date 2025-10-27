import { Input } from "antd";
import React, { useState } from "react";
import InfoButton from "../../../../ui/InfoButton/InfoButton";

const HeaderDesignCard = ({
  gradientColors = ["#EA61F6", "#FF29EA", "#FF9029"], // Default gradient colors
  iconSrc,
  initialHeader = "Basic Card",
  titleText = "Calculation Card",
  helperText = "The Calculation Card helps you implement basic calculations.",
  infoButtonText = "This is a Calculation Card",
  primaryTextColor = "#8C077F",
  titleTextColor = "#770679",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [header, setHeader] = useState(initialHeader);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);

  return (
    <div
      className="flex items-center justify-between rounded-xl py-10 px-10 bg-gradient-to-t relative mx-auto"
      style={{
        backgroundImage: `linear-gradient(to top, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]})`,
        borderRadius: "12px",
        borderImage:
          "linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(246, 169, 97, 0) 32.68%, rgba(248, 166, 91, 0) 68.17%, #FF9029 97.25%) 1",
      }}
    >
      <div className="flex flex-col items-start">
        <div className="flex flex-row items-center">
          <img
            src={iconSrc}
            alt="Rule Card"
            className="w-16 h-16 bg-white p-1 inline-block mr-8 shadow-md rounded"
          />
          <div className="flex flex-col items-start">
            {isEditing ? (
              <Input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="bg-[#FDE6C3]"
                style={{ color: primaryTextColor }}
              />
            ) : (
              <h4
                onDoubleClick={handleDoubleClick}
                className="text-base text-left cursor-pointer"
                style={{ color: primaryTextColor }}
              >
                {header}
              </h4>
            )}
            <div className="flex flex-row items-start">
              <h4
                className="text-3xl font-semibold mr-3 cursor-pointer"
                style={{ color: titleTextColor }}
              >
                {titleText}
              </h4>
              <InfoButton text={infoButtonText} />
            </div>
          </div>
        </div>
        <h3
          className="text-xl text-left mt-4"
          style={{ color: primaryTextColor }}
        >
          {helperText}
        </h3>
      </div>
    </div>
  );
};

export default HeaderDesignCard;
