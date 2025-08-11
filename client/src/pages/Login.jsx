import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../CSS/Login.css"

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

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
                    confirmPassword: formData.confirmPassword
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
                        // After successful login, send OTP verification
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
                                // Store email for the verification page
                                localStorage.setItem('userEmail', formData.email);
                                alert(`OTP sent to your email: ${formData.email}`);
                                navigate('/email-verify');
                            } else {
                                console.error('OTP Error Response:', otpData);
                                alert(otpData.message || 'Failed to send OTP');
                            }
                        } catch (otpError) {
                            console.error('OTP Error:', otpError);
                            alert('Login successful but failed to send OTP. Please try again.');
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
            confirmPassword: ''
        });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-shape shape-1"></div>
                <div className="auth-shape shape-2"></div>
                <div className="auth-shape shape-3"></div>
            </div>
            
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-container">
                        <div className="logo-circle">
                            <User size={32} />
                        </div>
                    </div>
                    <h1 className="auth-title">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin 
                            ? 'Please sign in to your account' 
                            : 'Join us and start your journey'
                        }
                    </p>
                </div>

                <div className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    )}

                    {isLogin && (
                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <button 
                                type="button" 
                                className="forgot-password"
                                onClick={() => navigate('/reset-password')}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </div>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <div className="social-login">
                    <button className="social-button google">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="auth-switch">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button" 
                            className="switch-button"
                            onClick={toggleMode}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;