import cloudinary from 'cloudinary'; // Import the default export
import dotenv from 'dotenv';

dotenv.config();

// Destructure v2 from the default import
const { v2: cloudinaryV2 } = cloudinary;

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinaryV2;