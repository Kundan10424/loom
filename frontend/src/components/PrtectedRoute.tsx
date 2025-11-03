import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 👇 Call your backend /auth/check endpoint
        const res = await axiosInstance.get("/auth/check");
        if (res.data?.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/auth");
        }
      } catch (error) {
        // ❌ Invalid token or not logged in
        setIsAuthenticated(false);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
