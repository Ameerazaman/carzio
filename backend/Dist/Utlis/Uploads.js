"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const Cloudinary_1 = __importDefault(require("./Cloudinary"));
const fs = require('fs');
const events_1 = require("events");
events_1.EventEmitter.defaultMaxListeners = 20;
const uploadImageToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filesArray = Array.isArray(files) ? files : [files];
        if (!filesArray || filesArray.length === 0) {
            return { success: false, message: 'No files uploaded' };
        }
        const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!fs.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }
                const result = yield Cloudinary_1.default.uploader.upload(filePath, {
                    folder: 'uploads',
                });
                return result;
            }
            catch (error) {
                throw new Error('Upload failed: ');
            }
        });
        const uploadPromises = filesArray.map((file) => uploadToCloudinary(file.path));
        const results = yield Promise.all(uploadPromises);
        if (results.length > 0) {
            return {
                success: true,
                message: 'Image uploaded successfully',
                results: results,
            };
        }
        else {
            return { success: false, message: 'Uploading failed' };
        }
    }
    catch (error) {
        return { success: false, message: 'Uploading failed' };
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
