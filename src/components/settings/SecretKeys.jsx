// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Input, notification, Space, Tooltip } from "antd";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     setSecretKeys,
//     addSecretKey,
//     updateSecretKey,
//     deleteSecretKey,
//     setLoading,
// } from "../../redux/secretKeysSlice/secretKeysSlice.js";
// import "./SecretKeys.css";
// import { EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from "@ant-design/icons";

// const SecretKeys = () => {
//     const userId = useSelector((state) => state.auth.user?.id); // Fetch userId from Redux
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingKey, setEditingKey] = useState(null); // For editing existing keys
//     const [visibleValues, setVisibleValues] = useState({}); // Track visibility of values
//     const [form] = Form.useForm();
//     const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
//     const dispatch = useDispatch();
//     const { secretKeys, loading } = useSelector((state) => state.secretKeys);

//     const fetchSecretKeys = async () => {
//         if (!userId) return;
//         dispatch(setLoading(true));
//         try {
//             const response = await axios.get(`${host}/rules/secret-key/${userId}`);
//             dispatch(setSecretKeys(response.data.secretKeys || []));
//         } catch (error) {
//             notification.error({ message: "Failed to fetch secret keys" });
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };

//     const handleSave = async (values) => {
//         const { key, value } = values;
//         const isDuplicateKey = secretKeys.some((secretKey) => secretKey.key === key);

//         if (isDuplicateKey) {
//             notification.error({ message: "Key already exists. Please use a unique key." });
//             return;
//         }
//         try {
//             if (editingKey) {
//                 const response = await axios.put(`${host}/rules/secret-key/${editingKey}`, { key, value });
//                 dispatch(updateSecretKey(response.data.updatedSecretKey));
//                 notification.success({ message: "Secret key updated successfully" });
//             } else {
//                 const response = await axios.post(`${host}/rules/secret-key`, { userId, key, value });
//                 dispatch(addSecretKey(response.data.newSecretKey));
//                 notification.success({ message: "Secret key created successfully" });
//             }
//             handleCloseModal();
//         } catch (error) {
//             notification.error({ message: "Failed to save secret key" });
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${host}/rules/secret-key/${id}`);
//             dispatch(deleteSecretKey(id));
//             notification.success({ message: "Secret key deleted successfully" });
//         } catch (error) {
//             notification.error({ message: "Failed to delete secret key" });
//         }
//     };

//     const handleOpenModal = (record = null) => {
//         setEditingKey(record?.id || null);
//         setIsModalOpen(true);
//         if (record) {
//             form.setFieldsValue({ key: record.key, value: record.value });
//         } else {
//             form.resetFields();
//         }
//     };

//     const handleCloseModal = () => {
//         setEditingKey(null);
//         setIsModalOpen(false);
//         form.resetFields();
//     };

//     const toggleValueVisibility = (id) => {
//         setVisibleValues((prev) => ({ ...prev, [id]: !prev[id] }));
//     };

//     const copyToClipboard = (value) => {
//         navigator.clipboard.writeText(value);
//         notification.success({ message: "Value copied to clipboard!" });
//     };

//     useEffect(() => {
//         if (userId) fetchSecretKeys();
//     }, [userId]);

//     const columns = [
//         {
//             title: "Key",
//             dataIndex: "key",
//             key: "key",
//         },
//         {
//             title: "Value",
//             dataIndex: "value",
//             key: "value",
//             render: (value, record) => {
//                 const isVisible = visibleValues[record.id];
//                 const maskedValue = `${value.slice(0, 3)}***${value.slice(-3)}`;
//                 return (
//                     <Space>
//                         <span>{isVisible ? value : maskedValue}</span>
//                         <Button
//                             type="text"
//                             icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
//                             onClick={() => toggleValueVisibility(record.id)}
//                         />
//                         <Tooltip title="Copy Value">
//                             <Button
//                                 type="text"
//                                 icon={<CopyOutlined />}
//                                 onClick={() => copyToClipboard(value)}
//                             />
//                         </Tooltip>
//                     </Space>
//                 );
//             },
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <Space>
//                     <Button type="link" onClick={() => handleOpenModal(record)}>
//                         <EditOutlined /> Edit
//                     </Button>
//                     <Button type="link" danger onClick={() => handleDelete(record.id)}>
//                         <DeleteOutlined /> Delete
//                     </Button>
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <div className="max-w-4xl mx-auto p-4 mt-10 rounded-lg">
//             <div className="gradient-border rounded-lg flex flex-row items-center justify-center h-20 w-full mb-4">
//                 <h2 className="text-2xl text-black font-semibold mb-4 mr-64 flex flex-row">
//                     Manage Secret Keys
//                 </h2>
//                 <Button
//                     type="primary"
//                     onClick={() => handleOpenModal()}
//                     className="mb-4 bg-blue-600 hover:bg-blue-700 text-white max-w-[10rem]"
//                 >
//                     Add Secret Key
//                 </Button>
//             </div>
//             <Table
//                 columns={columns}
//                 dataSource={secretKeys}
//                 rowKey="id"
//                 loading={loading}
//                 pagination={{ pageSize: 5 }}
//                 className="rounded-lg shadow-md"
//             />
// <Modal
//     title={editingKey ? "Edit Secret Key" : "Add Secret Key"}
//     visible={isModalOpen}
//     onCancel={handleCloseModal}
//     onOk={() => form.submit()}
//     className="modal-background-transparent shadow-md rounded-lg"
//     // className="rounded-lg "
//     rowClassName={(record, index) => (index % 2 === 0 ? 'shadow-row' : '')}
// >
//     <Form form={form} layout="vertical" onFinish={handleSave}>
//         <Form.Item
//             name="key"
//             label="Key"
//             rules={[{ required: true, message: "Please enter a key" }]}
//         >
//             <Input className="border-gray-300 rounded-md p-2" />
//         </Form.Item>
//         <Form.Item
//             name="value"
//             label="Value"
//             rules={[{ required: true, message: "Please enter a value" }]}
//         >
//             <Input className="border-gray-300 rounded-md p-2" />
//         </Form.Item>
//     </Form>
// </Modal>
//         </div>
//     );
// };

// export default SecretKeys;
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Space,
  Tooltip,
  Spin,
} from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setSecretKeys,
  addSecretKey,
  updateSecretKey,
  deleteSecretKey,
  setLoading,
} from "../../redux/secretKeysSlice/secretKeysSlice.js";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  PlusOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

const sidebarItems = ["Rule Engine Systems"];

const SecretKeys = () => {
  const userId = useSelector((state) => state.auth.user?.id); // Fetch userId from Redux
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [visibleValues, setVisibleValues] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
  const dispatch = useDispatch();
  const { secretKeys, loading } = useSelector((state) => state.secretKeys);

  // Dark Mode State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = window.document.documentElement;
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchSecretKeys = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${host}/rules/secret-key`);
      console.log(response);
      dispatch(setSecretKeys(response.data.secrets || []));
    } catch (error) {
      notification.error({ message: "Failed to fetch secret keys" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (userId) fetchSecretKeys();
  }, [userId]);

  const handleSave = async (values) => {
    const { key, value, type } = values;
    try {
      if (editingKey) {
        const response = await axios.put(
          `${host}/rules/secret-key/${editingKey}`,
          { key, value, type }
        );
        dispatch(updateSecretKey(response.data.updatedSecretKey));
        notification.success({ message: "Secret key updated successfully" });
      } else {
        const response = await axios.post(`${host}/rules/secret-key`, {
          userId,
          key,
          value,
          type,
        });
        dispatch(addSecretKey(response.data.newSecretKey));
        notification.success({ message: "Secret key created successfully" });
      }
      handleCloseModal();
    } catch (error) {
      notification.error({ message: "Failed to save secret key" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${host}/rules/secret-key/${id}`);
      dispatch(deleteSecretKey(id));
      notification.success({ message: "Secret key deleted successfully" });
    } catch (error) {
      notification.error({ message: "Failed to delete secret key" });
    }
  };

  const handleOpenModal = (record = null) => {
    console.log("Inside modal");
    setEditingKey(record?.id || null);
    setIsModalOpen(true);
    if (record) {
      console.log("Record: ", record);
      form.setFieldsValue({
        key: record.key,
        value: record.value,
        type: record.type,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCloseModal = () => {
    setEditingKey(null);
    setIsModalOpen(false);
    form.resetFields();
  };

  const toggleValueVisibility = (id) => {
    setVisibleValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    notification.success({ message: "Value copied to clipboard!" });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({ message: "No keys selected" });
      return;
    }
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          axios.delete(`${host}/rules/secret-key/${id}`)
        )
      );
      selectedRowKeys.forEach((id) => dispatch(deleteSecretKey(id)));
      notification.success({
        message: `${selectedRowKeys.length} secret key(s) deleted successfully`,
      });
      setSelectedRowKeys([]);
    } catch (error) {
      notification.error({ message: "Failed to delete selected secret keys" });
    }
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (value, record) => {
        const isVisible = visibleValues[record.id];
        const maskedValue = `${value.slice(0, 3)}***${value.slice(-3)}`;
        return (
          <Space>
            <span>{isVisible ? value : maskedValue}</span>
            <Button
              type="text"
              icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => toggleValueVisibility(record.id)}
            />
            <Tooltip title="Copy Value">
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(value)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            <EditOutlined /> Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Secret Keys</h1>
        {/* <Button
                    icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button> */}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={() => handleOpenModal()}
            >
              Add new
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={secretKeys}
              rowKey="id"
              pagination={false}
            />
          )}
        </div>
      </div>
      <Modal
        title={editingKey ? "Edit Secret Key" : "Add Secret Key"}
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        className="modal-background-transparent shadow-md rounded-lg"
        // className="rounded-lg "
        rowClassName={(record, index) => (index % 2 === 0 ? "shadow-row" : "")}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="key"
            label="Key"
            rules={[{ required: true, message: "Please enter a key" }]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: "Please enter a value" }]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please enter a Type" }]}
          >
            <Input className="border-gray-300 rounded-md p-2" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SecretKeys;
