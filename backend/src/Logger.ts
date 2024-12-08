import morgan from 'morgan';
import fs from 'fs-extra';
import path from 'path';

// Load configuration from environment variables
const LOG_FILE_AGE_THRESHOLD = parseInt(process.env.LOG_FILE_AGE_THRESHOLD || '20', 10); // Default: 20 days
const LOG_CLEANUP_INTERVAL = parseInt(process.env.LOG_CLEANUP_INTERVAL || '86400000', 10); // Default: 24 hours

// Log directory
const logDirectory = path.join(__dirname, 'logs');

// Ensure the log directory exists
fs.ensureDirSync(logDirectory);

// Create a write stream for errors
const errorLogStream = fs.createWriteStream(path.join(logDirectory, 'error.log'), { flags: 'a' });

// Morgan setup for errors only (status codes 400 and above)
const logger = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: errorLogStream,
});

// Cleanup function to delete logs older than the configured threshold
const deleteOldLogs = async () => {
  const files = await fs.readdir(logDirectory);

  files.forEach(async (file: string) => { // Explicitly type 'file' as a string
    const filePath = path.join(logDirectory, file);
    const stats = await fs.stat(filePath);
    const now = Date.now();
    const fileAgeInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (fileAgeInDays > LOG_FILE_AGE_THRESHOLD) {
      await fs.remove(filePath);
      console.log(`Deleted old log file: ${filePath}`);
    }
  });
};

// Run cleanup at the configured interval
setInterval(deleteOldLogs, LOG_CLEANUP_INTERVAL);

export default logger;
