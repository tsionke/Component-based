import { Link } from "react-router-dom";
import { Recycle } from "react-bootstrap-icons";

export default function Footer({ hide = false }) {
  if (hide) return null; // ← This hides the entire footer

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

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Services</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/pickup-request" className="footer-link">
                  Pickup Request
                </Link>
              </li>
              <li>
                <Link to="/my-requests" className="footer-link">
                  My Requests
                </Link>
              </li>
              <li>
                <Link to="/ai-chat" className="footer-link">
                  AI Chat Support
                </Link>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Waste Tracking
                </a>
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
