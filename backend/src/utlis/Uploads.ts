import cloudinary from './Cloudinary';
const fs = require('fs');
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

export const uploadImageToCloudinary = async (files: any) => {
    try {
        // Normalize `files` into an array if it's a single file
        console.log(files,"files")
        const filesArray = Array.isArray(files) ? files : [files];
console.log(filesArray,"files aray")
        if (!filesArray || filesArray.length === 0) {
            return { success: false, message: 'No files uploaded' };
        }

        console.log(filesArray, "Files to upload");

        const uploadToCloudinary = async (filePath: string) => {
            try {
                console.log(filePath, "file path");

                if (!fs.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }

                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploads',
                });
                return result;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                throw new Error('Upload failed: ' );
            }
        };

        const uploadPromises = filesArray.map((file: Express.Multer.File) =>
            uploadToCloudinary(file.path)
        );

        const results = await Promise.all(uploadPromises);

        if (results.length > 0) {
            return {
                success: true,
                message: 'Image uploaded successfully',
                results: results,
            };
        } else {
            return { success: false, message: 'Uploading failed' };
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        return { success: false, message: 'Uploading failed' };
    }
};
