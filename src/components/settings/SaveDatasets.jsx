import React, { useState, useEffect } from "react";
import { Input, Button, Upload, message, List, Popconfirm, Modal, Form } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import 'tailwindcss/tailwind.css';

const SaveDataset = () => {
    const [datasets, setDatasets] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDataset, setEditingDataset] = useState(null);
    const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        // Fetch existing datasets from backend
        axios.get(`${host}/rules/dataset`)
            .then(response => setDatasets(response.data))
            .catch(error => message.error("Error fetching datasets"));
    }, []);

    const handleFileUpload = (file) => {
        // Handle file upload to backend
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        axios.post(`${host}/rules/dataset`, formData)
            .then(response => {
                message.success("Dataset uploaded successfully");
                setDatasets([...datasets, response.data]);
                window.location.reload();  // Refresh the page
            })
            .catch(error => message.error("Failed to upload dataset"));
    };

    const handleLinkSubmit = (data) => {
        // Handle S3 link submission
        axios.post(`${host}/rules/dataset`, { ...data })
            .then(response => {
                message.success("Dataset linked successfully");
                setDatasets([...datasets, response.data]);
            })
            .catch(error => message.error("Failed to link dataset"));
    };

    const handleDeleteDataset = (id) => {
        axios.delete(`${host}/rules/dataset/${id}`)
            .then(response => {
                setDatasets(datasets.filter(dataset => dataset.id !== id));
                message.success("Dataset deleted successfully");
            })
            .catch(error => message.error("Failed to delete dataset"));
    };

    const handleReuploadDataset = (dataset) => {
        setEditingDataset(dataset);
        setIsModalVisible(true);
    };

    const handleModalSubmit = (data) => {
        axios.put(`${host}/rules/dataset/${editingDataset.id}`, data)
            .then(response => {
                const updatedDatasets = datasets.map(item =>
                    item.id === editingDataset.id ? response.data : item
                );
                setDatasets(updatedDatasets);
                setIsModalVisible(false);
                message.success("Dataset re-uploaded successfully");
                window.location.reload();  // Refresh the page
            })
            .catch(error => message.error("Failed to re-upload dataset"));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => handleFileUpload(acceptedFiles[0]),
        multiple: false,
        accept: '.csv,.xlsx,.json', // Modify based on your supported file types
    });

    return (
        <div className="p-4 bg-white rounded-lg mb-40 shadow-md max-w-3xl mx-auto">
            <h1 className="text-2xl text-black font-semibold mb-4">Save Dataset</h1>
            {/* Dataset Title & Drag-and-Drop Section */}
            <div className="mb-6">
                <form onSubmit={handleSubmit(handleLinkSubmit)} className="space-y-4">
                    {/* Dataset Title */}
                    <Input
                        placeholder="Enter dataset title"
                        {...register("title", { required: true })}
                        className="w-full mb-4"
                    />
                    {errors.title && <span className="text-red-500">Title is required</span>}

                    {/* File Upload or S3 Link */}
                    <div {...getRootProps()} className="border-2 border-dashed p-6 text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p className="text-black">Drag & drop a file here, or click to select one</p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                        <Button icon={<UploadOutlined />} type="primary" onClick={() => handleSubmit(handleLinkSubmit)}>Upload</Button>
                    </div>
                </form>
            </div>

            {/* List of Current Datasets */}
            <h2 className="text-xl text-black  font-semibold mb-4">Currently Stored Datasets</h2>
            <List
                itemLayout="horizontal"
                dataSource={datasets}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button icon={<EditOutlined />} onClick={() => handleReuploadDataset(item)} />,
                            <Popconfirm
                                title="Are you sure you want to delete this dataset?"
                                onConfirm={() => handleDeleteDataset(item.id)}
                            >
                                <Button icon={<DeleteOutlined />} type="danger" />
                            </Popconfirm>
                        ]}
                    >
                        <List.Item.Meta
                            title={item.title}
                            description={`Uploaded on: ${new Date(item.createdAt).toLocaleDateString()}`}
                        />
                    </List.Item>
                )}
            />

            {/* Modal for Re-uploading Dataset */}
            <Modal
                title="Re-upload Dataset"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleModalSubmit}>
                    <Form.Item label="Title">
                        <Input
                            defaultValue={editingDataset?.title}
                            onChange={e => setValue('title', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="File">
                        <input type="file" onChange={e => handleFileUpload(e.target.files[0])} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SaveDataset;
