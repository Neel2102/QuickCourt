import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, 
    port: 465, 
    auth: {
        user: "dhumil05@gmail.com",
        pass: "wfnizqyygndpqlmn",    
    }
});

export default transporter; 