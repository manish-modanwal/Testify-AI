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
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const rest_1 = require("@octokit/rest");
const router = (0, express_1.Router)();
// GitHub OAuth flow with a prompt for consent
router.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user,read:user&prompt=consent`;
    res.redirect(githubAuthUrl);
});
// GitHub's callback endpoint 
router.get('/github/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { code } = req.query;
    console.log('➡️ Backend /github/callback: Received request with code:', code);
    if (!code) {
        return res.status(400).send('No authorization code provided.');
    }
    try {
        const tokenResponse = yield axios_1.default.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: {
                Accept: 'application/json',
            },
        });
        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            throw new Error('Failed to retrieve access token from GitHub.');
        }
        const octokit = new rest_1.Octokit({ auth: accessToken });
        const { data: user } = yield octokit.users.getAuthenticated();
        console.log('✅ Successfully received access token.');
        console.log('✅ Authenticated GitHub user:', user.login);
        res.cookie('github_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: 'Authentication successful', redirectUrl: '/dashboard' });
    }
    catch (error) {
        console.error('❌ Backend /github/callback: An unexpected error occurred:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ error: 'Authentication failed.' });
    }
}));
// To check authentication 
router.get('/status', (req, res) => {
    const token = req.cookies.github_token;
    if (token) {
        res.json({ isLoggedIn: true });
    }
    else {
        res.json({ isLoggedIn: false });
    }
});
// To handle logout 
router.get('/logout', (req, res) => {
    res.clearCookie('github_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.redirect(process.env.CLIENT_URL);
});
exports.default = router;
