

import dotenv from 'dotenv';
import path from 'path';


console.log('Attempting to load .env from:', path.resolve(__dirname, './.env'));


const result = dotenv.config();


if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully.');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
}