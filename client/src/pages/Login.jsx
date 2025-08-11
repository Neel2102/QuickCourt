import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "../CSS/Login.css";
import InfinityGlowBackground from "./InfinityGlow";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(true);
  const [otpError, setOtpError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);


    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (res.ok) {
        if (data.user && data.user.isAccountVerified) {
          // Store user info in localStorage
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("name", data.user.name);

          // Prefer explicit role from backend if provided
          const role = data.user.role || (data.user.isAdmin ? "Admin" : (data.user.isFacilityOwner ? "FacilityOwner" : "User"));
          localStorage.setItem("role", role);

          alert("Login successful! Welcome back.");

          if (role === "Admin") {
            navigate("/admin-dashboard");
            return;
          }
          if (role === "FacilityOwner") {
            navigate("/facility-dashboard");
            return;
          }
          navigate("/user-dashboard");
          return;
        } else {
          try {
            const otpResponse = await fetch(
              "/api/auth/send-verify-otp",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({}),
              }
            );
            const otpData = await otpResponse.json();
            if (otpData.success) {
              setUserEmail(formData.email);
              setShowEmailVerify(true);
              toast.success(`OTP sent to your email: ${formData.email}`);
            } else {
              toast.success(otpData.message || "Failed to send OTP");
            }
          } catch (otpError) {
            console.error("OTP Error:", otpError);
            toast.error("Login successful but failed to send OTP. Please try again.");
          }
        }
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Failed to connect to server.");
      console.error("API error:", err);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    setIsLoading(true);
    setOtpError("");
    try {
      const response = await fetch(
        "/api/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ otp: otpString }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Email Verified successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Error while Verifying Email")
        setOtpError(data.message || "Invalid OTP. Please try again.");
      
    }
    } catch (err) {
      setOtpError("Failed to verify OTP. Please try again.");
      toast.error(data.message || "Failed to verify OTP. Please try again");

      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpError("");
    try {
      const response = await fetch(
        "/api/auth/send-verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || "OTP resent successfully!");
        setOtp(["", "", "", "", "", ""]);
      } else {
        setOtpError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(data.message || "Failed to resend OTP. Please try again");
      console.error("Resend error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    setShowEmailVerify(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
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

      {showEmailVerify ? (
        <div className="auth-card-1-login">
          <div className="auth-header-1-login">
            <div className="logo-container-login">
              <div className="logo-circle-login">
                <Mail size={32} />
              </div>
            </div>
            <h1 className="auth-title-login">Verify Your Email</h1>
            <p className="auth-subtitle-login">We've sent a verification code to</p>
            {userEmail && <p className="email-display-login">{userEmail}</p>}
          </div>

          <div className="auth-form-login">
            <div className="form-group-login">
              <div className="otp-container-login">
                <div className="otp-input-group-login">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type={showOtp ? "text" : "password"}
                      name={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input-login"
                      maxLength={1}
                      autoFocus={index === 0}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="otp-toggle-login"
                  >
                    {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {otpError && <span className="error-message-login">{otpError}</span>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOtpSubmit}
              className="auth-button-login"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <div className="loading-spinner-login">
                  <div className="spinner-login"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="resend-container-login">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="resend-button-login"
              >
                Resend OTP
              </button>
            </div>
          </div>

          <div className="auth-switch-login">
            <p>
              <button
                type="button"
                className="switch-button-login"
                onClick={goBackToLogin}
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="auth-card-login">
          <div className="auth-header-login">
            <div className="logo-container-login">
              <div className="logo-circle-login">
                <User size={32} />
              </div>
            </div>
            <h1 className="auth-title-login">Welcome to QuickCourt!</h1>
            <p className="auth-subtitle-login">Sign in to book your perfect court</p>
          </div>

          <div className="auth-form-login">
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
              {errors.email && (
                <span className="error-message-login">{errors.email}</span>
              )}
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

            <div className="form-options-login">
              <label className="checkbox-container-login">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button
                type="button"
                className="forgot-password-login"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
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
                "Sign In"
              )}
            </button>
          </div>

          <div className="auth-switch-login">
            <p>
              {"Don't have an account? "}
              <button
                type="button"
                className="switch-button-login"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;