
import { Dropdown as AntdDropdown, Menu } from "antd";
import { MoreOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function Dropdown({ menuItems }) {
  const menuItemsFormatted = menuItems.map((item, index) => ({
    key: index,
    label: item.link ? (
      <Link to={item.link} className="flex items-center">
        <RightOutlined className="mr-2" />
        {item.label}
      </Link>
    ) : (
      <button
        onClick={item.onClick}
        className="flex items-center w-full text-left bg-transparent border-none p-0"
      >
        <RightOutlined className="mr-2" />
        {item.label}
      </button>
    ),
  }));

  return (
    <AntdDropdown
      overlay={<Menu items={menuItemsFormatted} />}
      trigger={['click']}
      placement="bottomRight"
    >
      <span className="text-gray-700 dark:text-gray-300 bg-transparent border-none p-0 cursor-pointer">
        <MoreOutlined />
      </span>
    </AntdDropdown>
  );
}

export default Dropdown;
