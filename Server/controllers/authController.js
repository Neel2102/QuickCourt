import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import userAuth from '../middlewares/userAuth.js';

export const register = async (req,res) => {

    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({ success: false, message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email , password: hashedPassword});

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to <ProjectName>',
            text: `Welcome to <ProjectName> website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req,res) => {

    const {email, password} = req.body;
    if(!email || !password){
        return res.json({success: false, message: 'Email and Password are requird'})
    }

    try {
        
        const user = await userModel.findOne({email});
    console.log(user);
        if(!user){
            return res.status(401).json({success:false, message: 'Invalid Email', statusCode: 401})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({success: false, message: 'Invalid Password', statusCode: 401})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        
        return res.status(200).json({success: true, message: 'Logged in Successfully', user: {name: user.name, id: user._id}, token, statusCode: 200});
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message, statusCode: 500});
    }

} 

export const logout = async (req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: "Logged Out"})

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async (req,res) => {
    try {

        const {userId} = req.body || {};

        if (!userId) {
            return res.json({success: false, message: "User ID is required"});
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already Verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpexpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify Your account using this OTP.`
        };

        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Verification OTP sent on your E-Mail'});
        
    } catch (error) {
        return res.json({success:false , message: error.message});
    }
}

export const verifyEmail = async (req,res) => {
    
    const {userId, otp} = req.body;

    if (!userId || !otp){
        return res.json({success: false, message: "Missing Details"});
    }
    
    try {
        
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if (user.verifyOtpexpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        user.isAccountVerified = true;

        user.verifyOtp = '';
        user.verifyOtpexpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Email Verified Successfully"});

    } catch (error) {
        return res.json({success:false , message: error.message});
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        res.json ({success:false , message: error.message});
    }
}

//ResetPassword

export const sendResetOtp = async (req, res) => {
    
    const{email} = req.body;

    if(!email){
        return res.json({success: false, message: "Email is requird"})
    }

    try {
        
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 *60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}.
    Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOption);

        return res.json({success: true,  message: 'OTP sent to your E-mail'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if( !email || !otp || !newPassword){
        return res.json({success: false, message: "All fields are required"})
    }

    try {

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;


        await user.save();

        return res.json({success:true, message: "Password has been reset Successfully"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}
