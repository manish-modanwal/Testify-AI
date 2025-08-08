import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/authRoutes';
import repoRoutes from './routes/repoRoutes';
import aiRoutes from './routes/aiRoutes';

// ✅ FIX: .env फ़ाइल को उसी डायरेक्ट्री में ढूंढने के लिए इसे सरल करें
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cookieParser());

app.use(cors({
     origin: 'https://testify-ai-sage.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/github', repoRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the AI Test Case Generator Backend!');
});

app.listen(port, () => {
 
    console.log(`🚀 Server is running on ${process.env.SERVER_URL || `http://localhost:${port}`}`);
});