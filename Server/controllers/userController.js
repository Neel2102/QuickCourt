import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";


export const getUserData = async(req,res) => {
    try {
        // Accept userId from query for GET requests
        const userId = req.query.userId;

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
                { name, bio },
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

// New: get current user's profile
export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

// New: simple profile update (name, bio, optional profilePic null)
export const updateProfileSimple = async (req, res) => {
    try {
        const { name, bio, profilePic = undefined } = req.body;
        const update = {};
        if (typeof name === 'string') update.name = name;
        if (typeof bio === 'string') update.bio = bio;
        if (profilePic === null) update.profilePic = null; // allow removal
        const updated = await userModel.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
        return res.json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

// New: upload profile picture via multipart form
export const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        const upload = await cloudinary.uploader.upload(req.file.path);
        const updated = await userModel.findByIdAndUpdate(
            req.user._id,
            { profilePic: upload.secure_url },
            { new: true }
        ).select('-password');
        return res.json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to upload profile picture' });
    }
};

