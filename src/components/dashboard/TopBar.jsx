import React, { useState } from "react";
import { Select } from "antd";

function TopBar({ isOkay = true }) {
  const [selectedTime, setSelectedTime] = useState("all");

  const timeOptions = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "custom", label: "Date Range" },
  ];

  const handleTimeSelect = (value) => {
    setSelectedTime(value);
  };

  return (
    // <div
    //     className={`p-6 rounded-xl bg-gradient-to-t ${isOkay
    //         ? "from-purple-400 via-purple-500 to-purple-600"
    //         : "from-red-400 via-red-500 to-red-600"
    //         }`}
    // >
    <div
      className={`p-6 rounded-xl bg-gradient-to-t relative ${
        isOkay
          ? "from-purple-200 via-purple-400 to-purple-500"
          : "from-red-200 via-red-400 to-red-500"
      }`}
    >
      <div className="flex justify-between items-center">
        {isOkay ? (
          <div>
            <h1 className="text-2xl text-white font-bold mb-1">
              Make your Business rules Simpler and faster
            </h1>
            <p
              className={`font-medium text-[20px] ${
                isOkay ? "text-[#7F1DF8]" : "text-[#FF2525]"
              }`}
            >
              The Engine is Running Like a Dream!
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-white font-bold mb-1">
              Crash Landing:
            </h1>
            <p
              className={`font-semibold ${
                isOkay ? "text-[#7F1DF8]" : "text-[#FF2525]"
              }`}
            >
              494 Rules Need Immediate Rescue!
            </p>
          </div>
        )}
        <div className="mt-10 flex w-full lg:w-auto lg:justify-end">
          {timeOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleTimeSelect(option.value)}
              className={`cursor-pointer mr-4 mb-2 lg:mb-0 px-3 py-1 relative overflow-hidden rounded-lg 
        ${
          selectedTime === option.value
            ? `${
                isOkay ? "text-[#7F1DF8]" : "text-[#FF2525]"
              } border-b-4 border-purple-500 after:content-[''] after:block after:h-1 after:w-1/2 after:mx-auto after:rounded-full after:bg-${
                isOkay ? "[#7F1DF8]" : "[#FF2525]"
              } after:mt-1`
            : "text-gray-400"
        }
      `}
            >
              {/* Radial white glow effect */}
              <span
                className="absolute inset-0 bg-white opacity-30 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                }}
              />

              <h1 className="text-[#617283]">{option.label}</h1>
            </div>
          ))}
        </div>

        {/* <div className="mt-10 flex w-full lg:w-auto lg:justify-end">
                    {timeOptions.map((option) => (
                        <p
                            key={option.value}
                            onClick={() => handleTimeSelect(option.value)}
                            className={`cursor-pointer mr-4 mb-2 lg:mb-0 px-3 py-1 relative
                                ${selectedTime === option.value
                                    ? `${isOkay ? "text-[#7F1DF8]" : "text-[#FF2525]"} after:content-[''] after:block after:h-1 after:rounded-full after:bg-${isOkay ? "[#7F1DF8]" : "[#FF2525]"} after:mt-1`
                                    : "text-gray-400"
                                }`}
                        >
                            {option.label}
                        </p>
                    ))}
                </div> */}
      </div>
    </div>
  );
}

export default TopBar;
