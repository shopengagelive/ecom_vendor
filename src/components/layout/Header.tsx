import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useAuthActions } from "../../hooks/useAuthActions";
import { useAppSelector } from "../../store";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    try {
      setSignOutModalOpen(false);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      navigate("/login");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest";

    // Use firstName and lastName if available, otherwise fallback to displayName
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.displayName) {
      return user.displayName;
    }

    return user.email || "User";
  };

  const getUserRole = () => {
    if (!user) return "Guest";
    return user.role || "User";
  };

  const getUserStatus = () => {
    if (!user) return "";
    return user.status ? `(${user.status})` : "";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={onSidebarToggle}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Profile Dropdown */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500">
                  {getUserRole()} {getUserStatus()}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </HeadlessMenu.Button>

            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-10">
              <div className="py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                  )}
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => setSignOutModalOpen(true)}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </HeadlessMenu>
        </div>
      </div>
      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        title="Sign Out Confirmation"
        size="sm"
      >
        <div className="space-y-6">
          <p>Are you sure you want to sign out?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setSignOutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
