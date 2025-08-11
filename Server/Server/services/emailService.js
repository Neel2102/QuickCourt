import nodemailer from 'nodemailer'; // Assuming this is already configured

const transporter = nodemailer.createTransport({
    // Your Nodemailer config from user.js file
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'QuickCourt - Booking Confirmed!',
        html: `
            <h1>Your booking at ${bookingDetails.venueName} is confirmed!</h1>
            <p>Court: ${bookingDetails.courtName}</p>
            <p>Date: ${bookingDetails.date}</p>
            <p>Time: ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
            <p>Total Price: ${bookingDetails.totalPrice}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent successfully.');
    } catch (error) {
        console.error('Failed to send booking confirmation email:', error);
    }
};

// You can add more functions here for other email types, such as:
// - sendOTPEmail(userEmail, otp)
// - sendBookingCancellationEmail(userEmail, bookingDetails)
// - sendAdminApprovalNotification(ownerEmail, venueName)