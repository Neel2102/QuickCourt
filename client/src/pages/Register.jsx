import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from "lucide-react";
import "../CSS/Login.css";
import InfinityGlowBackground from "./InfinityGlow";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Please select a role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (res.ok) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "En Error Occured During Registration !")
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Failed to connect to the server!");
      console.error("API error:", err);
    }
  };

  return (
    <div className="auth-container-login">
      <div className="auth-background-login">
        <div className="auth-shape-login shape-1-login"></div>
        <div className="auth-shape-login shape-2-login"></div>
        <div className="auth-shape-login shape-3-login"></div>
        <InfinityGlowBackground />
      </div>

      <Navbar />

      <div className="auth-card-login register-card">
        <div className="auth-header-login">
          <div className="logo-container-login">
            <div className="logo-circle-login">
              <User size={32} />
            </div>
          </div>
          <h1 className="auth-title-login">Join QuickCourt</h1>
          <p className="auth-subtitle-login">Create your account and start playing</p>
        </div>

        <div className="auth-form-login">
          <div className="form-group-login">
            <div className={`input-wrapper-login ${errors.name ? "error" : ""}`}>
              <User className="input-icon-login" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input-login"
              />
            </div>
            {errors.name && <span className="error-message-login">{errors.name}</span>}
          </div>

          <div className="form-group-login">
            <div className={`input-wrapper-login ${errors.email ? "error" : ""}`}>
              <Mail className="input-icon-login" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input-login"
              />
            </div>
            {errors.email && <span className="error-message-login">{errors.email}</span>}
          </div>

          <div className="form-group-login">
            <div className={`input-wrapper-login ${errors.role ? "error" : ""}`}>
              <UserCircle className="input-icon-login" size={20} />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-input-login role-select-login"
              >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Venue Supplier">Venue Supplier</option>
              </select>
            </div>
            {errors.role && <span className="error-message-login">{errors.role}</span>}
          </div>

          <div className="form-group-login">
            <div className={`input-wrapper-login ${errors.password ? "error" : ""}`}>
              <Lock className="input-icon-login" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input-login"
              />
              <button
                type="button"
                className="password-toggle-login"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message-login">{errors.password}</span>
            )}
          </div>

          <div className="form-group-login">
            <div className={`input-wrapper-login ${errors.confirmPassword ? "error" : ""}`}>
              <Lock className="input-icon-login" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input-login"
              />
              <button
                type="button"
                className="password-toggle-login"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message-login">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="auth-button-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner-login">
                <div className="spinner-login"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="auth-switch-login">
          <p>
            {"Already have an account? "}
            <button
              type="button"
              className="switch-button-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


