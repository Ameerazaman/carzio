import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({ 
    cloud_name: 'daolqrbp2', 
    api_key: '275178154791847', 
    api_secret: 'VtY5UFLU8R3fJWMlZ7PGyOm-weE' // Click 'View API Keys' above to copy your API secret
});
export default cloudinary;
