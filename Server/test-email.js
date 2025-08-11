import { sendBookingConfirmationEmail } from './services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

// Test email function
const testEmail = async () => {
    console.log('Testing email service...');
    console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');
    
    try {
        const result = await sendBookingConfirmationEmail('test@example.com', {
            venueName: 'Test Venue',
            courtName: 'Test Court',
            date: new Date(),
            startTime: '10:00',
            endTime: '11:00',
            totalPrice: 500
        });
        
        console.log('Email test result:', result);
    } catch (error) {
        console.error('Email test failed:', error);
    }
};

testEmail();
