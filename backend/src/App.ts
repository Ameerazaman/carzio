import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './Routes/userRouter';
import createHttpError from 'http-errors';
import connectDB from './config/db';
import { Toaster } from 'react-hot-toast'; 
import providerRouter from './Routes/providerRouter';

dotenv.config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/provider', providerRouter);

// 404 Not Found middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        message: err.message
    });
};

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
