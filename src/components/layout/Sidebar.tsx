import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  X,
  Store,
  Video,
  MessageCircle,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Tags,
  Ticket,
  BarChart3,
  RotateCcw,
  Heart,
  Truck,
  TrendingUp,
  Wallet,
  Star,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useAuthActions } from "../../hooks/useAuthActions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Shows", href: "/shows", icon: Video },
  { name: "Products", href: "/products", icon: Package },
  { name: "Attribute & Variation", href: "/attributes", icon: Tags },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Order on Chat", href: "/order-on-chat", icon: MessageCircle },
  { name: "Logistics", href: "/logistics", icon: Truck },
  { name: "Return Request", href: "/returns", icon: RotateCcw },
  { name: "Followers", href: "/followers", icon: Heart },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Withdraw", href: "/withdraw", icon: Wallet },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
  // { name: "Payments", href: "/payments", icon: CreditCard },
  // { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSignOutModalOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                VendorHub
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="mt-8 flex-1 overflow-y-auto">
            <div className="px-4 space-y-2 pb-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
        {/* Sign Out Button at the bottom */}
        <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            onClick={() => setSignOutModalOpen(true)}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </button>
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
      </div>
    </>
  );
}
