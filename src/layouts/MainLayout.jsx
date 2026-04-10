import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/Footer";

const MainLayout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Hide footer on AI Chat page
  const hideFooter = location.pathname === "/ai-chat";

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar show={sidebarOpen} onHide={closeSidebar} user={user} />

      <div className="d-flex flex-column flex-grow-1">
        <Navbar onMenuClick={toggleSidebar} user={user} onLogout={onLogout} />

        <main className="main-content flex-grow-1 p-3 p-md-4 bg-light">
          <Outlet />
        </main>

        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
