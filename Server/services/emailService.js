import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
    const formattedDate = new Date(bookingDetails.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: userEmail,
        subject: 'QuickCourt - Booking Confirmed! 🎾',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #43b97f 0%, #2e7d5a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .booking-detail { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .booking-detail:last-child { border-bottom: none; }
                    .label { font-weight: bold; color: #555; }
                    .value { color: #333; }
                    .total { font-size: 18px; font-weight: bold; color: #43b97f; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
                    .btn { display: inline-block; background: #43b97f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
                    .btn:hover { background: #2e7d5a; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎾 QuickCourt</h1>
                        <h2>Booking Confirmed!</h2>
                        <p>Your court booking has been successfully confirmed</p>
                    </div>
                    
                    <div class="content">
                        <div class="booking-card">
                            <h3>📅 Booking Details</h3>
                            
                            <div class="booking-detail">
                                <span class="label">🏟️ Venue:</span>
                                <span class="value">${bookingDetails.venueName}</span>
                            </div>
                            
                            <div class="booking-detail">
                                <span class="label">🏸 Court:</span>
                                <span class="value">${bookingDetails.courtName}</span>
                            </div>
                            
                            <div class="booking-detail">
                                <span class="label">📅 Date:</span>
                                <span class="value">${formattedDate}</span>
                            </div>
                            
                            <div class="booking-detail">
                                <span class="label">⏰ Time:</span>
                                <span class="value">${bookingDetails.startTime} - ${bookingDetails.endTime}</span>
                            </div>
                            
                            <div class="booking-detail">
                                <span class="label">💰 Total Amount:</span>
                                <span class="value total">₹${bookingDetails.totalPrice}</span>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/user-dashboard/my-bookings" class="btn">View My Bookings</a>
                            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/venues" class="btn">Book Another Court</a>
                        </div>
                        
                        <div style="background: #e8f5e8; border: 1px solid #43b97f; border-radius: 8px; padding: 15px; margin: 20px 0;">
                            <h4 style="margin: 0 0 10px 0; color: #2e7d5a;">ℹ️ Important Information</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #2e7d5a;">
                                <li>Please arrive 10 minutes before your scheduled time</li>
                                <li>Bring your own sports equipment</li>
                                <li>Follow venue rules and regulations</li>
                                <li>Contact venue staff if you need to cancel or reschedule</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for choosing QuickCourt!</p>
                        <p>If you have any questions, please contact our support team.</p>
                        <p>© 2024 QuickCourt. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent successfully to:', userEmail);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Failed to send booking confirmation email:', error);
        return { success: false, message: error.message };
    }
};

export const sendBookingCancellationEmail = async (userEmail, bookingDetails) => {
    const formattedDate = new Date(bookingDetails.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: userEmail,
        subject: 'QuickCourt - Booking Cancelled ❌',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Cancellation</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
                    .btn { display: inline-block; background: #43b97f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎾 QuickCourt</h1>
                        <h2>Booking Cancelled</h2>
                        <p>Your court booking has been cancelled</p>
                    </div>
                    
                    <div class="content">
                        <div class="booking-card">
                            <h3>📅 Cancelled Booking Details</h3>
                            <p><strong>Venue:</strong> ${bookingDetails.venueName}</p>
                            <p><strong>Court:</strong> ${bookingDetails.courtName}</p>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                            <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
                            <p><strong>Amount:</strong> ₹${bookingDetails.totalPrice}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/venues" class="btn">Book Another Court</a>
                        </div>
                        
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
                            <h4 style="margin: 0 0 10px 0; color: #dc2626;">ℹ️ Cancellation Information</h4>
                            <p style="margin: 0; color: #dc2626;">Your booking has been successfully cancelled. Any refunds will be processed according to our cancellation policy.</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for choosing QuickCourt!</p>
                        <p>© 2024 QuickCourt. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking cancellation email sent successfully to:', userEmail);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Failed to send booking cancellation email:', error);
        return { success: false, message: error.message };
    }
};

// You can add more functions here for other email types, such as:
// - sendOTPEmail(userEmail, otp)
// - sendAdminApprovalNotification(ownerEmail, venueName)