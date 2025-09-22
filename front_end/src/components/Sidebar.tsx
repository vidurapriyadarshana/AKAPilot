import {
  Home,
  BookOpen,
  Brain,
  Clock,
  Timer,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navigationItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Subjects", icon: BookOpen, path: "/subjects" },
    { name: "Memory Cards", icon: Brain, path: "/memory-cards" },
    { name: "Study Sessions", icon: Clock, path: "/study-session" },
    { name: "Pomodoro Timer", icon: Timer, path: "/pomodoro-timer" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/signin"); // redirect to login after logout
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-slate-700 rounded-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AKAPilot</h1>
            <p className="text-sm text-gray-500">Learning Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4">
        <div className="mb-4">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">
            NAVIGATION
          </h2>

          <nav className="space-y-1">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;