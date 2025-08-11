import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'quickcourt', // The folder in your Cloudinary account to store images
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, crop: 'limit' }], // Optional image transformation
    },
});

const uploadMiddleware = multer({ storage: storage });

export default uploadMiddleware; 
