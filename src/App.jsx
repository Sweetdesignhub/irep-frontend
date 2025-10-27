import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { Suspense, lazy, useState, useEffect } from "react";

// Lazy load pages for performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Organizations = lazy(() => import("./pages/Organization"));
const RuleManagement = lazy(() => import("./pages/RuleManagement"));
const RuleDesigner = lazy(() => import("./pages/RuleDesigner"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

import Header from "./components/header/Header";
import Loading from "./components/common/Loading";
import Teams from "./pages/Teams";
import Execute from "./pages/Execute";
import Transport from "./pages/Transport";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
    const validateToken = async () => {
      try {
        const response = await fetch(`${host}/auth/validate-token`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsValid(response.ok);
      } catch {
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) return <p>Loading...</p>; // Show loading while validating

  return isValid ? <Outlet /> : <Navigate to="/sign-in" replace />;
  // const user = useSelector(state => state.auth.user);
  // const token = useSelector(state => console.log("User is: ", state.auth.token));

  // // const user = true;
  // return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

function App() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // Exclude the header on these routes
  const noHeaderRoutes = ["/sign-in"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 dark:text-gray-100">
      <div className="flex-grow">
        {/* Only show the Header if the route is not one of the excluded ones */}
        {user && !noHeaderRoutes.includes(location.pathname) && <Header />}

        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/sign-in" element={<SignIn />} />
            {/* <Route path="/sign-up" element={<SignUp />} /> */}
            {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organization" element={<Organizations />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/execute" element={<Execute />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rule-management" element={<RuleManagement />} />
              <Route path="/rule-designer/:rid" element={<RuleDesigner />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
