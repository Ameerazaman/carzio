"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const UserRouter_1 = __importDefault(require("./Routes/UserRouter"));
const http_errors_1 = __importDefault(require("http-errors"));
const Db_1 = __importDefault(require("./Config/Db"));
const ProviderRouter_1 = __importDefault(require("./Routes/ProviderRouter"));
const AdminRouter_1 = __importDefault(require("./Routes/AdminRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Logger_1 = __importDefault(require("./Logger")); // Import the logger
const Socket_1 = __importDefault(require("./Socket"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, Db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 3000;
// Setup Socket.IO
const io = (0, Socket_1.default)(server);
console.log(io, "io");
// Use the custom logger
app.use(Logger_1.default);
// Middlewares
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: ["http://localhost:3000", "https://carzio-frondend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Routes
app.use("/api/users", UserRouter_1.default);
app.use("/api/provider", ProviderRouter_1.default);
app.use("/api/admin", AdminRouter_1.default);
// 404 Not Found Middleware
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use(errorHandler);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
