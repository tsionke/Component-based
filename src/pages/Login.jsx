import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Card from "../components/ui/Card";
import "../styles/Login.css";

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    // Validation
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
      );

      if (response.data.success) {
        console.log("Login success:", response.data.user);

        // Save user to localStorage (important for protection)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Call onSuccess if parent (App.jsx) needs to update global state
        if (onSuccess) {
          onSuccess(response.data.user);
        }

        // ALWAYS go to /home after successful login (no more guest/landing)
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setGeneralError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card>
        <h1 className="login-title">Kuralewo</h1>
        <p className="login-description">
          Login to continue managing waste efficiently
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {generalError && (
            <div className="alert alert-danger text-center mb-3">
              {generalError}
            </div>
          )}

          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" text="Login" loading={loading} />

          <p className="login-footer">
            Don’t have an account?{" "}
            <Link to="/signup" className="login-link">
              Sign Up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
