import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "user")[];
  role: "admin" | "user" | null;
  loading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  role,
  loading,
}) => {
  if (loading)
    return <div className="p-10 text-center">Checking permissions...</div>;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
