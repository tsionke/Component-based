import React, { useState, useEffect } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Protect the page - Redirect to Login if not logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login"); // Guest users cannot access Profile
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setUser({
      ...parsedUser,
      status: "Active",
      lastLogin: currentDate,
    });
  }, [navigate]);

  // Loading state
  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");

    // Success message
    const logoutMessage = document.createElement("div");
    logoutMessage.textContent = "Logged out successfully!";
    logoutMessage.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: #10b981; color: white; padding: 12px 24px; border-radius: 8px;
      z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(logoutMessage);

    setTimeout(() => {
      logoutMessage.remove();
      navigate("/"); // ← Goes to Landing Page after logout
    }, 800);
  };

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid px-3 px-md-5 py-5">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="btn btn-light mb-4 d-flex align-items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Profile Card */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {/* Profile Header / Avatar */}
              <div
                className="text-center pt-5 pb-4"
                style={{ background: "white" }}
              >
                <div
                  className="mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "110px",
                    height: "110px",
                    backgroundColor: "#e0f2e9",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      backgroundColor: "#10b981",
                      borderRadius: "50%",
                    }}
                  >
                    <span style={{ fontSize: "42px", color: "white" }}>👤</span>
                  </div>
                </div>
                <h3 className="mt-4 mb-1 fw-bold">{user.name}</h3>
                <p className="text-muted mb-0">{user.email}</p>
              </div>

              {/* Status & Last Login */}
              <div
                className="card-body p-4 text-center"
                style={{ background: "white" }}
              >
                <div className="py-4 border-top border-bottom">
                  <div className="d-flex justify-content-center gap-5">
                    <div>
                      <span className="text-muted d-block small">Status</span>
                      <span className="text-success fw-semibold fs-5">
                        {user.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted d-block small">
                        Last Login
                      </span>
                      <span className="fw-semibold fs-5">{user.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-4 pt-2 pb-5" style={{ background: "white" }}>
                <button
                  onClick={handleLogout}
                  className="btn w-100 text-white fw-semibold py-3"
                  style={{
                    backgroundColor: "#ef4444",
                    borderRadius: "12px",
                    fontSize: "16px",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
