import { useSelector } from "react-redux";

export const isAuthenticated = () => {
  const user = useSelector((state) => state.auth.user); // Get the user from Redux state
  return !!user; // If the user exists in Redux state, they are authenticated
};
