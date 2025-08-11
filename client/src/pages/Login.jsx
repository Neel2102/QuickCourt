import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, UserCircle } from "lucide-react";
import "../CSS/Login.css"
import InfinityGlowBackground from "./InfinityGlow";
import Navbar from "../components/Navbar";

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailVerify, setShowEmailVerify] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOtp, setShowOtp] = useState(true);
    const [otpError, setOtpError] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User' // Default role
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && !formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'; 
        }

        if (!isLogin && !formData.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            const endpoint = isLogin
                ? 'http://localhost:4000/api/auth/login'
                : 'http://localhost:4000/api/auth/register';

            const payload = isLogin
                ? {
                    email: formData.email,
                    password: formData.password
                }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    role: formData.role
                };

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Add this to include cookies
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                
                // Turn off loading state immediately after getting response
                setIsLoading(false);
                
                if (res.ok) {
                    if (isLogin) {
                        // Check if user is already verified
                        if (data.user && data.user.isAccountVerified) {
                            // User is already verified, redirect to dashboard
                            console.log('User is already verified, redirecting to dashboard...');
                            alert('Login successful! Welcome back.');
                            navigate('/dashboard');
                        } else {
                            // User is not verified, send OTP verification
                            console.log('Login successful, sending OTP...');
                            try {
                                const otpResponse = await fetch('http://localhost:4000/api/auth/send-verify-otp', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include', // This will include cookies
                                    body: JSON.stringify({})
                                });

                                const otpData = await otpResponse.json();
                                
                                if (otpData.success) {
                                    // Show email verification form in the same page
                                    setUserEmail(formData.email);
                                    setShowEmailVerify(true);
                                    alert(`OTP sent to your email: ${formData.email}`);
                                } else {
                                    console.error('OTP Error Response:', otpData);
                                    alert(otpData.message || 'Failed to send OTP');
                                }
                            } catch (otpError) {
                                console.error('OTP Error:', otpError);
                                alert('Login successful but failed to send OTP. Please try again.');
                            }
                        }
                    } else {
                        alert(data.message || "Registered Successfully");
                    }
                } else {
                    alert(data.message || 'An error occurred.');
                }
            } catch (err) {
                // Turn off loading state on error as well
                setIsLoading(false);
                alert('Failed to connect to server.');
                console.error('API error:', err);
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'User'
        });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    // OTP handling functions
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setOtpError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setOtpError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    otp: otpString
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Email verified successfully!');
                navigate('/dashboard');
            } else {
                setOtpError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setOtpError('Failed to verify OTP. Please try again.');
            console.error('Verification error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setOtpError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/send-verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (data.success) {
                alert(`New OTP sent to your email: ${userEmail}`);
                setOtp(['', '', '', '', '', '']); // Clear OTP fields
            } else {
                setOtpError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setOtpError('Failed to send OTP. Please try again.');
            console.error('Resend error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const goBackToLogin = () => {
        setShowEmailVerify(false);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
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
                // Email Verification Form
                <div className="auth-card-1-login">
                    <div className="auth-header-1-login">
                        <div className="logo-container-login">
                            <div className="logo-circle-login">
                                <Mail size={32} />
                            </div>
                        </div>
                        <h1 className="auth-title-login">
                            Verify Your Email
                        </h1>
                        <p className="auth-subtitle-login">
                            We've sent a verification code to
                        </p>
                        {userEmail && (
                            <p className="email-display-login">
                                {userEmail}
                            </p>
                        )}
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
                            disabled={isLoading || otp.join('').length !== 6}
                        >
                            {isLoading ? (
                                <div className="loading-spinner-login">
                                    <div className="spinner-login"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                'Verify Email'
                            )}
                        </button>

                        <div className="resend-container-login">
                            Didn't receive the code?{' '}
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
                // Login/Register Form
                <div className="auth-card-login">
                <div className="auth-header-login">
                    <div className="logo-container-login">
                        <div className="logo-circle-login">
                            <User size={32} />
                        </div>
                    </div>
                    <h1 className="auth-title-login">
                        {isLogin ? 'Welcome to QuickCourt!' : 'Join QuickCourt'}
                    </h1>
                    <p className="auth-subtitle-login">
                        {isLogin 
                            ? 'Sign in to book your perfect court' 
                            : 'Create your account and start playing'
                        }
                    </p>
                </div>

                <div className="auth-form-login">
                    {!isLogin && (
                        <div className="form-group-login">
                            <div className={`input-wrapper-login ${errors.name ? 'error' : ''}`}>
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
                    )}

                    <div className="form-group-login">
                        <div className={`input-wrapper-login ${errors.email ? 'error' : ''}`}>
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

                    {!isLogin && (
                        <div className="form-group-login">
                            <div className={`input-wrapper-login ${errors.role ? 'error' : ''}`}>
                                <UserCircle className="input-icon-login" size={20} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="form-input-login role-select-login"
                                >
                                    <option value="">Select Role</option>
                                    <option value="User">User</option>
                                    <option value="VenueOwner">Venue Owner</option>
                                </select>
                            </div>
                            {errors.role && <span className="error-message-login">{errors.role}</span>}
                        </div>
                    )}

                    <div className="form-group-login">
                        <div className={`input-wrapper-login ${errors.password ? 'error' : ''}`}>
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
                        {errors.password && <span className="error-message-login">{errors.password}</span>}
                    </div>

                    {!isLogin && (
                        <div className="form-group-login">
                            <div className={`input-wrapper-login ${errors.confirmPassword ? 'error' : ''}`}>
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
                            {errors.confirmPassword && <span className="error-message-login">{errors.confirmPassword}</span>}
                        </div>
                    )}

                    {isLogin && (
                        <div className="form-options-login">
                            <label className="checkbox-container-login">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <button 
                                type="button" 
                                className="forgot-password-login"
                                onClick={() => navigate('/reset-password')}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

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
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </div>

                <div className="auth-switch-login">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button" 
                            className="switch-button-login"
                            onClick={toggleMode}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
            )}
        </div>
    );
};

export default LoginRegister;