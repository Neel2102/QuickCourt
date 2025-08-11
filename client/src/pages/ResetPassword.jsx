import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "../CSS/ResetPassword.css"
import Navbar from "../components/Navbar";
import InfinityGlowBackground from "./InfinityGlow";

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
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

    const validateEmail = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtp = () => {
        const newErrors = {};
        if (!formData.otp.trim()) {
            newErrors.otp = 'OTP is required';
        } else if (formData.otp.length !== 6) {
            newErrors.otp = 'OTP must be 6 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (validateEmail()) {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:4000/api/auth/send-reset-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: formData.email })
                });

                const data = await res.json();
                setIsLoading(false);

                if (data.success) {
                    setStep(2);
                    alert(data.message);
                } else {
                    alert(data.message || 'Failed to send OTP');
                }
            } catch (err) {
                setIsLoading(false);
                alert('Failed to connect to server.');
                console.error('API error:', err);
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (validateOtp()) {
            setStep(3);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (validatePassword()) {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:4000/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        otp: formData.otp,
                        newPassword: formData.newPassword
                    })
                });

                const data = await res.json();
                setIsLoading(false);

                if (data.success) {
                    alert(data.message);
                    navigate('/login');
                } else {
                    alert(data.message || 'Failed to reset password');
                }
            } catch (err) {
                setIsLoading(false);
                alert('Failed to connect to server.');
                console.error('API error:', err);
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setFormData(prev => ({ ...prev, otp: '' }));
        } else if (step === 3) {
            setStep(2);
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        }
        setErrors({});
    };

    const renderStep1 = () => (
        <>
            <div className="resetpassword-header-resetpass">
                <div className="logo-container-resetpass">
                    <div className="logo-circle-resetpass">
                        <Mail size={32} />
                    </div>
                </div>
                <h1 className="resetpassword-title-resetpass">Reset Password</h1>
                <p className="resetpassword-subtitle-resetpass">
                    Enter your email address to receive a password reset OTP
                </p>
            </div>

            <div className="resetpassword-form-resetpass">
                <div className="form-group-resetpass">
                    <div className={`input-wrapper-resetpass ${errors.email ? 'error-resetpass' : ''}`}>
                        <Mail className="input-icon-resetpass" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input-resetpass"
                        />
                    </div>
                    {errors.email && <span className="error-message-resetpass">{errors.email}</span>}
                </div>

                <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    className="resetpassword-button-resetpass"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="loading-spinner-resetpass">
                            <div className="spinner-resetpass"></div>
                            <span>Sending OTP...</span>
                        </div>
                    ) : (
                        'Send OTP'
                    )}
                </button>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="resetpassword-header-resetpass">
                <button className="back-button-resetpass" onClick={handleBack}>
                    <ArrowLeft size={20} />
                </button>
                <div className="logo-container-resetpass">
                    <div className="logo-circle-resetpass">
                        <Lock size={32} />
                    </div>
                </div>
                <h1 className="resetpassword-title-resetpass">Enter OTP</h1>
                <p className="resetpassword-subtitle-resetpass">
                    We've sent a 6-digit OTP to {formData.email}
                </p>
            </div>

            <div className="resetpassword-form-resetpass">
                <div className="form-group-resetpass">
                    <div className={`input-wrapper-resetpass ${errors.otp ? 'error-resetpass' : ''}`}>
                        <Lock className="input-icon-resetpass" size={20} />
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit OTP"
                            value={formData.otp}
                            onChange={handleInputChange}
                            className="form-input-resetpass"
                            maxLength={6}
                        />
                    </div>
                    {errors.otp && <span className="error-message-resetpass">{errors.otp}</span>}
                </div>

                <button 
                    type="button" 
                    onClick={handleVerifyOtp} 
                    className="resetpassword-button-resetpass"
                    disabled={isLoading}
                >
                    Verify OTP
                </button>
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <div className="resetpassword-header-resetpass">
                <button className="back-button-resetpass" onClick={handleBack}>
                    <ArrowLeft size={20} />
                </button>
                <div className="logo-container-resetpass">
                    <div className="logo-circle-resetpass">
                        <Lock size={32} />
                    </div>
                </div>
                <h1 className="resetpassword-title-resetpass">Set New Password</h1>
                <p className="resetpassword-subtitle-resetpass">
                    Create a new password for your account
                </p>
            </div>

            <div className="resetpassword-form-resetpass">
                <div className="form-group-resetpass">
                    <div className={`input-wrapper-resetpass ${errors.newPassword ? 'error-resetpass' : ''}`}>
                        <Lock className="input-icon-resetpass" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="form-input-resetpass"
                        />
                        <button
                            type="button"
                            className="password-toggle-resetpass"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.newPassword && <span className="error-message-resetpass">{errors.newPassword}</span>}
                </div>

                <div className="form-group-resetpass">
                    <div className={`input-wrapper-resetpass ${errors.confirmPassword ? 'error-resetpass' : ''}`}>
                        <Lock className="input-icon-resetpass" size={20} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="form-input-resetpass"
                        />
                        <button
                            type="button"
                            className="password-toggle-resetpass"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="error-message-resetpass">{errors.confirmPassword}</span>}
                </div>

                <button 
                    type="button" 
                    onClick={handleResetPassword} 
                    className="resetpassword-button-resetpass"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="loading-spinner-resetpass">
                            <div className="spinner-resetpass"></div>
                            <span>Resetting Password...</span>
                        </div>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </div>
        </>
    );

    return (

        <div className="resetpassword-container-resetpass">
            <Navbar/>

            <div className="resetpassword-background-resetpass">
                <div className="resetpassword-shape-resetpass shape-1-reset-resetpass"></div>
                <div className="resetpassword-shape-resetpass shape-2-reset-resetpass"></div>
                <div className="resetpassword-shape-resetpass shape-3-reset-resetpass"></div>
                <InfinityGlowBackground/>
            </div>
            
            <div className="resetpassword-card-resetpass">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                <div className="resetpassword-switch-resetpass">
                    <p>
                        Remember your password? 
                        <button 
                            type="button" 
                            className="switch-button-resetpass"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;