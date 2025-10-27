

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOfficeBuilding } from "react-icons/hi";
import {
  CaretDownFilled,
  LogoutOutlined,
  BarsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  RocketOutlined,
  CarOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Modal, Radio, Drawer } from "antd";
import ToggleButton from "../common/ToggleButton";
import { logout } from "../../redux/auth/authSlice";
import Loading from "../common/Loading";
import DashboardIcon from "../../assets/DashboardIcon.svg";
import RuleManagementIcon from "../../assets/RuleManagement.svg";
import OrganizationIcon from "../../assets/OrganizationIcon.svg";
import TeamsIcon from "../../assets/TeamsIcon.svg";
import ExecuteIcon from "../../assets/ExecuteIcon.svg";
import TransportIcon from "../../assets/TransportIcon.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // To redirect after logout
  const dispatch = useDispatch();

  const navigation = [
    { name: "Dashboard", to: "/dashboard", icon: DashboardIcon },
    {
      name: "Rule Management",
      to: "/rule-management",
      icon: RuleManagementIcon,
    },
    { name: "Organization", to: "/organization", icon: OrganizationIcon },
    { name: "Teams", to: "/teams", icon: TeamsIcon },
    { name: "Execute", to: "/execute", icon: ExecuteIcon },
    { name: "Transport", to: "/transport", icon: TransportIcon },
  ];

  // Function to log out the user by calling the backend API
  const signOut = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sign-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        console.log("Successfully logged out");

        // Dispatch the logout action to reset Redux state
        dispatch(logout());
        navigate("/sign-in");
      } else {
        console.log("Logout failed:", data.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false); // Set loading to false when logout is complete (success or failure)
    }
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  // Menu for profile dropdown
  const profileMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
      },
      {
        key: "settings",
        label: "Settings",
        onClick: () => navigate("/settings"),
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: signOut, // Call signOut function when logout is clicked
      },
    ],
  };

  return (
    <header className="bg-white dark:bg-gray-700">
      <nav
        className="flex items-center justify-between p-3 mx-auto max-w-8xl lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center lg:flex-1">
          <Link to={"/"} className="flex flex-row">
            <h1 className="text-[#8F29FB] font-semibold text-[20.49px] leading-[15.49px] tracking-[-2%] ml-16 mt-1 py-3 px-4 w-60 ">
              Intelligent Rule
              <span className="block mt-2">Engine</span>
            </h1>
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuVisible(true)}
            className="text-gray-700 dark:text-white p-2"
          >
            <BarsOutlined />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <div className="flex items-baseline ml-10 space-x-4">
            {navigation.map((item) => (
              <div className="flex flex-row items-center justify-center">
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="w-8 h-8 object-contain pr-1 "
                />
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      "relative flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-white bg-gradient-to-b from-[#8F29FB] via-[#9B5CFB] to-[#C084FC] shadow-lg"
                        : "text-[#343434] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="items-center justify-center hidden ml-4 lg:flex lg:flex-1 lg:justify-center">
          {/* <div className="mx-2">
                        <button
                            className="px-3 py-1 flex flex-row justify-between duration-100 dark:bg-slate-900 dark:text-gray-100 bg-gray-100 rounded-2xl !border-0 mx-2"
                        >
                            <HiOfficeBuilding className="mx-1" size={20} />
                            <CaretDownFilled size={1} />
                        </button>
                    </div> */}

          {/* Theme Toggle Button */}
          <ToggleButton />

          <div className="relative ml-3">
            <Dropdown menu={profileMenu} trigger={["click"]}>
              <button className="relative flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                {/* <UserOutlined /> */}
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {/* <Avatar size="sm" /> */}
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
              </button>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={250}
      >
        <div className="space-y-4">
          <UserOutlined />
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="block py-2 text-lg text-[#343434] dark:text-black"
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-6">
            <UserOutlined />
            <Link
              to="#"
              className="block py-2 text-lg text-[#343434] dark:text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Settings
            </Link>
            <Link
              to="#"
              className="block py-2 text-lg text-[#343434] dark:text-white"
              onClick={signOut} // Call signOut function here as well
            >
              Logout
            </Link>
          </div>
        </div>
      </Drawer>

      {/* Settings Modal */}
      <Modal
        title="Settings"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Radio.Group onChange={handleFontSizeChange} value={fontSize}>
          <Radio value="small">Small</Radio>
          <Radio value="normal">Normal</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="large">Large</Radio>
        </Radio.Group>
      </Modal>

      {loading && <Loading />}
    </header>
  );
}

export default Header;
