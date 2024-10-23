import cloudinary from './Cloudinary';
const fs = require('fs');
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;
export const uploadImageToCloudinary = async (files: any) => {
    try {
        if (!files || !Array.isArray(files)) {
            return { success: false, message: 'No files uploaded' };
        }

        console.log(files, "img")
        const uploadToCloudinary = async (filePath: string) => {
            try {
                console.log(filePath, "file path");
                
                // Check if the file exists
                if (!fs.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }
        
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploads',
                });
                return result;
            } catch (error) {
                console.error('Cloudinary upload error:', error); 
                if (error instanceof Error) {
                    throw new Error('Upload failed: ' + error.message);
                }
                throw new Error('Unknown error during upload');
            }
        };
        // Upload all files to Cloudinary
        const uploadPromises = files.map((file: Express.Multer.File) =>
            uploadToCloudinary(file.path)
        );

        const results = await Promise.all(uploadPromises);

        if (results) {
            return {
                success: true,
                message: 'Image uploaded successfully',
                results: results,
            };
        } else {
            return { success: false, message: 'Uploading failed' };
        }
    } catch (error) {
        // Type assertion here as well
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error occurred during image upload');
        }
        return { success: false, message: 'Uploading failed' };
    }
};
