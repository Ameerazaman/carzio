import cloudinary from './Cloudinary';
const fs = require('fs');
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

export const uploadImageToCloudinary = async (files: any) => {
    try {
      
        const filesArray = Array.isArray(files) ? files : [files];

        if (!filesArray || filesArray.length === 0) {
            return { success: false, message: 'No files uploaded' };
        }
        const uploadToCloudinary = async (filePath: string) => {
            try {

                if (!fs.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }

                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploads',
                });
                return result;
            } catch (error) {
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
      
        return { success: false, message: 'Uploading failed' };
    }
};
