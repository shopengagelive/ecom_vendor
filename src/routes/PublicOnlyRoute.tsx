import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";

// Redirects authenticated users away from public-only pages like login
const PublicOnlyRoute = () => {
  const { user, status, loading } = useAppSelector((s) => s.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
