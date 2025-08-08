"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const repoRoutes_1 = __importDefault(require("./routes/repoRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
// ✅ FIX: .env फ़ाइल को उसी डायरेक्ट्री में ढूंढने के लिए इसे सरल करें
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/github', repoRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the AI Test Case Generator Backend!');
});
app.listen(port, () => {
    console.log(`🚀 Server is running on ${process.env.SERVER_URL || `http://localhost:${port}`}`);
});
