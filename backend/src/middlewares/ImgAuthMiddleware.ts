

// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Define the uploads directory
// export const uploadDir = path.join(__dirname, '../Src/Uploads');

// // Create the uploads directory if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir); // Use the uploads directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
//     }
// });

// // Create a Multer instance with the storage configuration
// export const upload = multer({ storage: storage });

import { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';

// Configure Multer storage options
const storage: StorageEngine = multer.diskStorage({
 
  filename: (req:Request, file: Express.Multer.File, cb:any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer
const upload = multer({ storage });

export default upload;