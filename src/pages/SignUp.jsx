

import React, { useState } from "react";
import { Layout, Card, Input, Checkbox, Button, Typography, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { registerStart, registerSuccess, registerFailure } from "../redux/auth/authSlice"; // Import actions
import Loading from "../components/common/Loading";

const { Title } = Typography;

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState(""); // Add state for registration error
    const [registrationModalVisible, setRegistrationModalVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email format").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase letter")  // Uppercase letter
                .matches(/\d/, "Password must contain at least one number")  // At least one digit
                .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")  // Special character
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], "Passwords must match")
                .required("Confirm password is required"),
            termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms and conditions").required("You must accept the terms and conditions"),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            dispatch(registerStart()); // Dispatch register start action
            setLoading(true);
            setRegistrationError(""); // Reset error message on new submit

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/sign-up`, values
                );

                if (response.data && response.data.success) {

                    setRegistrationModalVisible(true);
                    // Registration was successful, but user needs to verify email
                    toast.success("Registration successful. Please check your email for verification.");
                } else {
                    const backendErrorMessage = response.data.message || "Registration failed";
                    toast.error(backendErrorMessage);  // Show toast notification
                    dispatch(registerFailure(backendErrorMessage));  // Dispatch failure action
                    setRegistrationError(backendErrorMessage); // Set the error to be displayed in the UI
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || "An error occurred.";
                toast.error(errorMessage);
                setFieldError("password", errorMessage); // Set error for password field
                setLoginError(errorMessage); // Set the error to be displayed in the UI
                dispatch(loginFailure(errorMessage));
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    const handleCloseRegistrationModal = () => {
        setRegistrationModalVisible(false);
        navigate('/sign-in');
    };

    return (
        <>
            {loading && <Loading />}
            <Layout className="w-full h-screen bg-dark:text-gray-100 dark:bg-slate-900"> {/* Set background to dark */}
                <div className="flex justify-center items-center flex-col gap-10 h-full text-white">
                    <Card title={<Title className="text-3xl text-white">Sign Up</Title>} className="w-full max-w-md bg-dark-800">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <Input
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your Name"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <Input
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your Email"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <Input.Password
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your Password"
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <Input.Password
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Confirm your Password"
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <Checkbox
                                    id="termsAccepted"
                                    name="termsAccepted"
                                    checked={formik.values.termsAccepted}
                                    onChange={formik.handleChange}
                                >
                                    I agree to the Terms and Conditions
                                </Checkbox>
                                {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.termsAccepted}</p>
                                )}
                            </div>

                            <Button type="primary" htmlType="submit" block disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </form>
                    </Card>

                    <div className="mt-6 text-black">
                        Already have an account? <Link to="/sign-in" className="text-blue-500 font-bold">Sign In</Link>
                    </div>
                </div>
            </Layout>
            {/* Registration Success Modal */}
            <Modal
                title="Registration Successful"
                open={registrationModalVisible}
                onCancel={handleCloseRegistrationModal}
                footer={[
                    <Button key="close" onClick={handleCloseRegistrationModal}>
                        Close
                    </Button>
                ]}
            >
                <div className="text-center">
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                    <p>You have successfully registered!</p>
                    <p>Please check your email to verify your account.</p>
                    <p>Click the verification link in the email to complete your registration.</p>
                </div>
            </Modal>
        </>
    );
};

export default SignUp;
