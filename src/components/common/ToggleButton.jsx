

import React, { useEffect, useState } from "react";

function ToggleButton() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const options = [
    {
      icon: "sunny",
      text: "light",
    },
    {
      icon: "moon",
      text: "dark",
    },
    {
      icon: "desktop-outline",
      text: "system",
    },
  ];

  // Apply the theme based on user preference or system default
  useEffect(() => {
    const element = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (theme === "dark") {
        element.classList.add("dark");
      } else if (theme === "light") {
        element.classList.remove("dark");
      } else {
        // System preference
        if (darkQuery.matches) {
          element.classList.add("dark");
        } else {
          element.classList.remove("dark");
        }
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme); // Save theme preference
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      if (theme === 'system') {
        const element = document.documentElement;
        if (e.matches) {
          element.classList.add("dark");
        } else {
          element.classList.remove("dark");
        }
      }
    };

    darkQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      darkQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <div className="duration-100 dark:bg-slate-900 dark:text-gray-100 bg-gray-100 rounded-2xl relative">
      <button
        className="w-8 h-8 leading-9 text-xl rounded-full m-1"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <ion-icon name="sunny"></ion-icon>
      </button>

      {dropdownVisible && (
        <div className="absolute top-14 right-[-3rem] mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg z-10">
          {options.map((opt) => (
            <button
              key={opt.text}
              className={`flex justify-start items-center w-full px-8 py-2 text-left text-[15px] rounded-lg ${theme === opt.text ? "text-sky-600" : ""
                }`}
              onClick={() => {
                setTheme(opt.text);
                setDropdownVisible(false);
              }}
            >
              <ion-icon name={opt.icon}></ion-icon> <p className="ml-4">{opt.text}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ToggleButton;