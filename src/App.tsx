import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import LiveStream from "./pages/LiveStream";
import OrderOnChat from "./pages/OrderOnChat";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import Attributes from "./pages/Attributes";
import Coupons from "./pages/Coupons";
import Reports from "./pages/Reports";
import Returns from "./pages/Returns";
import Reviews from "./pages/Reviews";
import Followers from "./pages/Followers";
import Logistics from "./pages/Logistics";
import Analytics from "./pages/Analytics";
import Withdraw from "./pages/Withdraw";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AddEditProductPage from "./pages/AddEditProductPage"; // Import AddEditProductPage
// import ProductViewPage from "./pages/ProductViewPage"; // Import ProductViewPage
import { Toaster } from "react-hot-toast";
import ShippingSetup from "./pages/ShippingSetup";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
                border: "1px solid #4a4a4a",
              },
              success: {
                style: {
                  background: "#D1FAE5",
                  color: "#065F46",
                  border: "1px solid #A7F3D0",
                },
              },
              error: {
                style: {
                  background: "#FEE2E2",
                  color: "#DC2626",
                  border: "1px solid #FCA5A5",
                },
              },
            }}
          />
          <Routes>
            {/* Public routes - only accessible when not authenticated */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected routes - only accessible when authenticated and approved */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<AddEditProductPage />} />
                <Route path="orders" element={<Orders />} />
                <Route path="payments" element={<Payments />} />
                <Route path="profile" element={<Profile />} />
                <Route path="shows" element={<LiveStream />} />
                <Route path="order-on-chat" element={<OrderOnChat />} />
                <Route path="staff" element={<Staff />} />
                <Route path="settings" element={<Settings />} />
                <Route path="shipping-setup" element={<ShippingSetup />} />
                <Route path="attributes" element={<Attributes />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="reports" element={<Reports />} />
                <Route path="returns" element={<Returns />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="followers" element={<Followers />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="withdraw" element={<Withdraw />} />
                {/* <Route path="products/:id" element={<ProductViewPage />} /> */} {/* Route for viewing a single product */}
              </Route>
            </Route>

            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}
