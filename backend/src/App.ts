import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import http from "http";
import userRouter from "./Routes/UserRouter";
import createHttpError from "http-errors";
import connectDB from "./Config/Db";
import providerRouter from "./Routes/ProviderRouter";
import adminRouter from "./Routes/AdminRouter";
import cookieParser from "cookie-parser";
import logger from "./Logger"; // Import the logger
import setupSocket from "./Socket";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Setup Socket.IO
const io = setupSocket(server);

// Use the custom logger
app.use(logger);

// Middlewares
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000", "https://carzio-frondend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/provider", providerRouter);
app.use("/api/admin", adminRouter);

// 404 Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

// Error Handling Middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
};
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
