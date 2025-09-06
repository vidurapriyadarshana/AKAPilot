// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (uncomment when ready to use) */}
        {/* <Header /> */}
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}