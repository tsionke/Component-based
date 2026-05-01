import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import AIChat from "./pages/AIChat";
import Profile from "./pages/Profile";
import MyRequests from "./pages/MyRequests";
import Notifications from "./pages/Notifications";
import PickupRequest from "./components/PickupRequest";
import RequestSuccess from "./pages/RequestSuccess";
import Payment from "./pages/Payment";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ====================== PUBLIC ROUTES ====================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Login & Signup */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Signup onSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* ====================== PROTECTED ROUTES ====================== */}
        <Route
          element={
            user ? (
              <MainLayout user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pickup-request" element={<PickupRequest />} />
          <Route path="/request-success" element={<RequestSuccess />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* 404 - Page Not Found */}
        <Route
          path="*"
          element={<h2 className="text-center py-5">404 - Page Not Found</h2>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
