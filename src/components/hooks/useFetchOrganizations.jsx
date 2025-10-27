import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrganizations } from "../../redux/organizationSlice/organizationSlice";
import { setLoading } from "../../redux/secretKeysSlice/secretKeysSlice";
import { logout } from "../../redux/auth/authSlice";

const useFetchOrganizations = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (!token) {
            dispatch(logout()); // Trigger logout if no token exists
            return;
        }

        const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

        const fetchOrganizations = async () => {
            dispatch(setLoading(true));

            try {
                // Validate token
                await axios.post(`${host}/auth/validate-token`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Fetch organizations
                const response = await axios.get(`${host}/org`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                dispatch(setOrganizations(response.data.data));
            } catch (error) {
                console.error("Error fetching organizations or token validation failed:", error);

                if (error.response && error.response.status === 401) {
                    dispatch(logout()); // Auto logout on invalid token
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchOrganizations();
    }, [token, dispatch]);
};

export default useFetchOrganizations;
