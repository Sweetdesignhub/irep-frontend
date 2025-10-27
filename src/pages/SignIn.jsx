import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/auth/authSlice"; // Import login actions
import bg from "../assets/login-bg.png";
import irep from "../assets/irep.svg";
import Loading from "../components/common/Loading";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook to dispatch actions
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      dispatch(loginStart()); // Dispatch login start action
      setLoading(true);
      setLoginError("");

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/sign-in`,
          values
        );

        if (response.data.success && response.data.accessToken) {
          const user = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.accessToken,
          };
          dispatch(loginSuccess({ user, token: response.data.accessToken }));
          toast.success("Logged In Successfully");
          navigate("/");
        } else {
          const backendErrorMessage =
            response.data.message || "Invalid credentials";
          toast.error(backendErrorMessage);
          setFieldError("password", backendErrorMessage); // Set error for password field
          setLoginError(backendErrorMessage); // Set the error to be displayed in the UI
          dispatch(loginFailure(backendErrorMessage));
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || err.message || "An error occurred.";
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

  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-row items-center justify-center gap-8 h-screen bg-white">
        <div className="w-[40%] p-6 bg-white flex flex-col justify-center items-center rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl text-center text-gray-900">Login</h2>
          <p className="text-gray-500 text-sm w-[320px] text-center mt-2 mb-8">
            Please enter your network credentials
          </p>

          {/* Formik Form */}
          <form className="w-full max-w-[420px]" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter your Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>
            {/* <div className="pb-4 text-right">
                            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600 text-[12px]">
                                Forgot Password?
                            </Link>
                        </div> */}
            <button
              type="submit"
              className="w-full p-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* <p className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/sign-up" className="text-blue-400 hover:underline">
                            Sign Up
                        </Link>
                    </p> */}
        </div>
        <div className="w-[60%] h-full py-4 px-4">
          <img
            src={bg}
            alt="Sign In"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;
