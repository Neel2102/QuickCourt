import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";


export const getUserData = async(req,res) => {
    try {
        
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({success:false, message: 'usernot found' });
        }

        res.json({
            success:true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        })

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


// controller to update user profile details 
export const updateProfile = async (req, res) => {
    console.log("updateProfile Triggered")
    try {
        const { profilePic, bio, name } = req.body;
        console.log("🟡 Incoming Update Request");
        console.log("User ID:", req.user?._id); // check if it's defined
        const userId = req.user._id;

        console.log("🟡 Incoming Update:");
        console.log("User ID:", userId);
        console.log("Full Name:", name);
        console.log("Bio:", bio);
        console.log("Profile Pic: (base64 exists?)", !!profilePic);

        let updatedUser;

        if (!profilePic) {
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { fullName, bio },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    name,
                    bio,
                },
                { new: true }
            );
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("❌ Profile update failed:", error);
        res.json({ success: false, message: "Upload Error Occurred!" });
    }
};

