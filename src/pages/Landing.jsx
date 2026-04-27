import React from "react";
import { Link } from "react-router-dom";
import { Recycle } from "react-bootstrap-icons";

// Icons used in About Us
import {
  HeartFill,
  ShieldCheck,
  PeopleFill,
  Globe,
} from "react-bootstrap-icons";

// Icons used in Contact Us
import { GeoAltFill, TelephoneFill, EnvelopeFill } from "react-bootstrap-icons";

import truckImage from "../assets/Truck.jpg";
import "../styles/LandingPage.css";

// ====================== PUBLIC FOOTER (for Landing Page) ======================
function Footer() {
  return (
    <footer className="footer bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row g-5">
          {/* Logo & About */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Recycle size={32} className="text-success" />
              <span className="fs-4 fw-bold text-white">Kuralewo</span>
            </div>
            <p className="text-light-50">
              Making Adama and Ethiopia cleaner through smart waste management,
              community participation, and sustainable solutions.
            </p>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Support</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/contact" className="footer-link">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Legal & Privacy</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="footer-link">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Services - Linked to Login for Public Users */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Services</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/login" className="footer-link">
                  Pickup Request
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  My Requests
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  AI Chat Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Waste Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & More */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Community & Events</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="footer-link">
                  Eco Events
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Volunteer Program
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Sustainability Tips
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Partner With Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary mt-5 pt-4 text-center text-light-50 small">
          <p>
            © 2026 Kuralewo. All rights reserved. | Making Ethiopia cleaner, one
            pickup at a time.
          </p>
          <p className="mt-2">Built with ❤️ for a sustainable future.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <Recycle size={36} className="text-success me-2" />
            <span className="fs-3 fw-bold text-success">Kuralewo</span>
          </Link>
          <div className="ms-auto d-flex align-items-center gap-4">
            <Link to="/" className="nav-link fw-medium text-dark">
              Home
            </Link>
            <Link to="/about" className="nav-link fw-medium text-dark">
              About
            </Link>
            <Link to="/contact" className="nav-link fw-medium text-dark">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* ====================== HERO SECTION ====================== */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Welcome to <span>Kuralewo</span>
            </h1>
            <p>The best waste management center</p>
            <div className="hero-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={truckImage}
            alt="Kuralewo Waste Management Truck"
            className="hero-img"
          />
        </div>
      </section>

      {/* ====================== ABOUT US SECTION ====================== */}
      <section className="py-5 bg-white">
        <div className="container-fluid px-3 px-md-5 py-4">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-success">About Kuralewo</h1>
            <p
              className="lead text-muted mt-3"
              style={{ maxWidth: "720px", margin: "0 auto" }}
            >
              We are building a cleaner, smarter, and more sustainable future
              for cities — one report, one recycle point, and one community
              action at a time.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card p-4 text-center h-100 shadow-sm border-0 rounded-4">
                <div className="icon-circle mx-auto mb-3 bg-success-subtle">
                  <HeartFill size={36} className="text-success" />
                </div>
                <h5 className="fw-bold mb-3">Community First</h5>
                <p className="text-muted small">
                  Empowering residents to take ownership of their environment
                  through easy reporting and collective action.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card p-4 text-center h-100 shadow-sm border-0 rounded-4">
                <div className="icon-circle mx-auto mb-3 bg-success-subtle">
                  <ShieldCheck size={36} className="text-success" />
                </div>
                <h5 className="fw-bold mb-3">Transparency & Trust</h5>
                <p className="text-muted small">
                  Every reported issue is tracked publicly — real-time status
                  updates so you always know what's happening.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card p-4 text-center h-100 shadow-sm border-0 rounded-4">
                <div className="icon-circle mx-auto mb-3 bg-success-subtle">
                  <PeopleFill size={36} className="text-success" />
                </div>
                <h5 className="fw-bold mb-3">Collaboration</h5>
                <p className="text-muted small">
                  Connecting citizens, local governments, and recyclers to solve
                  urban waste challenges together.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card p-4 text-center h-100 shadow-sm border-0 rounded-4">
                <div className="icon-circle mx-auto mb-3 bg-success-subtle">
                  <Globe size={36} className="text-success" />
                </div>
                <h5 className="fw-bold mb-3">Sustainability</h5>
                <p className="text-muted small">
                  Reducing waste, promoting recycling, and protecting the planet
                  — step by step, city by city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FULL CONTACT US SECTION ====================== */}
      <section className="py-5 bg-light">
        <div className="container-fluid px-3 px-md-5 py-5">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-success">Contact Us</h1>
            <p className="lead text-muted mt-3">
              We're here to help. Reach out with questions, feedback, or
              partnership ideas.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="row g-4 text-center text-md-start">
                  {/* Address */}
                  <div className="col-md-4">
                    <div className="d-flex flex-column align-items-center align-items-md-start gap-3">
                      <div className="rounded-circle bg-success-subtle p-3">
                        <GeoAltFill size={32} className="text-success" />
                      </div>
                      <div>
                        <h5 className="fw-bold">Our Address</h5>
                        <p className="text-muted mb-1">
                          Kuralewo Headquarters
                          <br />
                          Main Street, Kebele 05
                          <br />
                          Adama, Oromia, Ethiopia
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-4">
                    <div className="d-flex flex-column align-items-center align-items-md-start gap-3">
                      <div className="rounded-circle bg-success-subtle p-3">
                        <TelephoneFill size={32} className="text-success" />
                      </div>
                      <div>
                        <h5 className="fw-bold">Phone</h5>
                        <p className="text-muted mb-1">
                          +251 911 234 567
                          <br />
                          Mon–Fri: 8:30 AM – 5:30 PM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-4">
                    <div className="d-flex flex-column align-items-center align-items-md-start gap-3">
                      <div className="rounded-circle bg-success-subtle p-3">
                        <EnvelopeFill size={32} className="text-success" />
                      </div>
                      <div>
                        <h5 className="fw-bold">Email</h5>
                        <p className="text-muted mb-1">
                          hello@kuralewo.et
                          <br />
                          support@kuralewo.et
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== NEW FOOTER ====================== */}
      <Footer />
    </div>
  );
}
