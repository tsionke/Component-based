import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FeatureCard from "./FeatureCard"; // Make sure this path is correct
import { MegaphoneFill, Recycle, BellFill } from "react-bootstrap-icons";
import "../styles/index.css";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container py-2">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="welcome-card text-center mb-4">
                <h1 className="display-4 fw-bold text-success mb-4">
                  Welcome to City Kuralewo!
                </h1>
                <p className="lead text-muted">
                  The best designed center to become uppercaring in its
                  formation.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <FeatureCard
                    icon={MegaphoneFill}
                    title="Pickup Request"
                    description="Send a pickup request and our driver will come to your location."
                    buttonText="Request"
                    buttonVariant="success"
                    linkTo="/pickup-request"
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <FeatureCard
                    icon={Recycle}
                    title="My Requests"
                    description="View your pickup requests status and history."
                    buttonText="View Requests"
                    buttonVariant="outline-primary"
                    linkTo="/my-requests"
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <FeatureCard
                    icon={BellFill}
                    title="Stay Updated"
                    description="Keep up to date on all the latest support status."
                    buttonText="View Updates"
                    buttonVariant="outline-warning"
                    linkTo="/updates" // Change later if needed
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
