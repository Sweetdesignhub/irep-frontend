import React, { useState } from "react";
import { Tooltip, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion


const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
};

const InfoButton = ({ text }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    // Framer Motion variants for hover effect
    const buttonVariants = {
        hover: {
            scale: 1.1, // Scale up on hover
            // backgroundColor: "#1ecbe1", // Change background color on hover (blue-600)
            color: "#1ecbe1", // Change background color on hover (blue-600)
            transition: { duration: 0.2 },
        },
        initial: {
            scale: 1,
            color: "#42E2B8", // Initial background color (gray-500)
        },
    };

    return (
        <div className="flex items-center justify-center">
            {/* Tooltip wrapping the button */}
            <Tooltip title={text}>
                <motion.button
                    className="flex items-center justify-center w-8 h-8 text-white bg-white rounded-full shadow-md"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={showModal}
                >
                    <InfoCircleOutlined className="text-lg" />
                </motion.button>
            </Tooltip>

            {/* Modal */}
            <AnimatePresence>
                {isModalVisible && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 w-11/12 max-w-md z-[1001]"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <InfoCircleOutlined className="text-blue-600 text-xl" />
                                <span className="text-xl font-semibold">Information</span>
                            </div>
                            <p className="text-gray-700">{text}</p>
                            <div className="flex justify-end mt-6">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                                    onClick={handleCancel}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfoButton;