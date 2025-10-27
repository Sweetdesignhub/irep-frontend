import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import "./FileUploadNode.css";

const FileUploadNode = ({ id, data }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle drag over event
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // Handle drag leave event
    const handleDragLeave = () => {
        setIsDragging(false);
    };

    // Handle file drop event
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            console.log("File uploaded:", uploadedFile);
        }
    };

    // Handle file selection via input
    const handleChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            console.log("File uploaded:", uploadedFile);
        }
    };

    // Handle file submission
    const handleSubmit = () => {
        if (file && data.onSubmitFile) {
            data.onSubmitFile(file);
            console.log("File submitted:", file);
        } else {
            console.log("No file selected to submit.");
        }
    };

    return (
        <div className={`file-upload-container ${isDragging ? 'dragging' : ''}`}>
            <p className='file-upload-title'>
                Would you like to upload product details for automatic analysis?
            </p>

            {/* Drag & Drop Area */}
            <div
                className='drag-drop-area'
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div>{file ? `File: ${file.name}` : 'Drag & drop a file here'}</div>
            </div>

            {/* File Input */}
            <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleChange}
                id={`file-upload-${id}`}
            />
            <label
                htmlFor={`file-upload-${id}`}
                className='file-upload-label'
            >
                Or click to select a file
            </label>

            {/* Submit Button */}
            <div className='submit-btn-container'>
                <button
                    onClick={handleSubmit}
                    disabled={!file}
                    className={`submit-btn ${!file ? 'disabled' : ''}`}
                >
                    Submit File
                </button>
            </div>

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
};

export default FileUploadNode;
