import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, 
    port: 465, 
    auth: {
        user: "quickcourt1@gmail.com",
        pass: "kwrpfizjopghlenp",    
    }
});

export default transporter; 