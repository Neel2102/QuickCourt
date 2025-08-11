import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "../CSS/EmailVerify.css";

const EmailVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOtp, setShowOtp] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Get email from localStorage or sessionStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

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
                navigate('/'); // Navigate to home page after verification
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
            console.error('Verification error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');

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
                alert(`New OTP sent to your email: ${email}`);
                setOtp(['', '', '', '', '', '']); // Clear OTP fields
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error('Resend error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate('/login');
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
                            <Mail size={32} />
                        </div>
                    </div>
                    <h1 className="auth-title">
                        Verify Your Email
                    </h1>
                    <p className="auth-subtitle">
                        We've sent a verification code to
                    </p>
                    {email && (
                        <p className="email-display">
                            {email}
                        </p>
                    )}
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <div className="otp-container">
                            <div className="otp-input-group">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type={showOtp ? "text" : "password"}
                                        name={`otp-${index}`}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="otp-input"
                                        maxLength={1}
                                        autoFocus={index === 0}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setShowOtp(!showOtp)}
                                    className="otp-toggle"
                                >
                                    {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {error && <span className="error-message">{error}</span>}
                        </div>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        className="auth-button"
                        disabled={isLoading || otp.join('').length !== 6}
                    >
                        {isLoading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    <div className="resend-container">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="resend-button"
                        >
                            Resend OTP
                        </button>
                    </div>
                </div>

                <div className="auth-switch">
                    <p>
                        <button 
                            type="button" 
                            className="switch-button"
                            onClick={goBack}
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;