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
const morgan_1 = __importDefault(require("morgan"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// Load configuration from environment variables
const LOG_FILE_AGE_THRESHOLD = parseInt(process.env.LOG_FILE_AGE_THRESHOLD || '20', 10); // Default: 20 days
const LOG_CLEANUP_INTERVAL = parseInt(process.env.LOG_CLEANUP_INTERVAL || '86400000', 10); // Default: 24 hours
// Log directory
const logDirectory = path_1.default.join(__dirname, 'logs');
// Ensure the log directory exists
fs_extra_1.default.ensureDirSync(logDirectory);
// Create a write stream for errors
const errorLogStream = fs_extra_1.default.createWriteStream(path_1.default.join(logDirectory, 'error.log'), { flags: 'a' });
// Morgan setup for errors only (status codes 400 and above)
const logger = (0, morgan_1.default)('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream,
});
// Cleanup function to delete logs older than the configured threshold
const deleteOldLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield fs_extra_1.default.readdir(logDirectory);
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join(logDirectory, file);
        const stats = yield fs_extra_1.default.stat(filePath);
        const now = Date.now();
        const fileAgeInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (fileAgeInDays > LOG_FILE_AGE_THRESHOLD) {
            yield fs_extra_1.default.remove(filePath);
            console.log(`Deleted old log file: ${filePath}`);
        }
    }));
});
// Run cleanup at the configured interval
setInterval(deleteOldLogs, LOG_CLEANUP_INTERVAL);
exports.default = logger;
