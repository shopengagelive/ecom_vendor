import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";

export default function ProtectedRoute() {
  const { user, status, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user status is approved
  if (user.status && user.status !== "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg p-8 rounded-lg text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Account Status: {user.status}</h2>
          <p className="text-gray-600">
            {user.status === "PENDING" && "Your vendor account is pending approval. Please wait for admin review."}
            {user.status === "BLOCKED" && "Your vendor account has been blocked. Please contact support for assistance."}
            {user.status === "SUSPENDED" && "Your vendor account has been suspended. Please contact support for assistance."}
            {!["PENDING", "BLOCKED", "SUSPENDED"].includes(user.status) && "Your account status requires attention. Please contact support."}
          </p>
          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
