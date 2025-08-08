import { Router } from 'express';
import axios from 'axios';
import { Octokit } from '@octokit/rest';

const router = Router();

// GitHub OAuth flow with a prompt for consent
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user,read:user&prompt=consent`;
  res.redirect(githubAuthUrl);
});

// GitHub's callback endpoint 
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  console.log('➡️ Backend /github/callback: Received request with code:', code);

  if (!code) {
    return res.status(400).send('No authorization code provided.');
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
        throw new Error('Failed to retrieve access token from GitHub.');
    }

    const octokit = new Octokit({ auth: accessToken });
    const { data: user } = await octokit.users.getAuthenticated();
    
    console.log('✅ Successfully received access token.');
    console.log('✅ Authenticated GitHub user:', user.login);

    res.cookie('github_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Authentication successful', redirectUrl: '/dashboard' });

  } catch (error: any) {
    console.error('❌ Backend /github/callback: An unexpected error occurred:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// To check authentication 
router.get('/status', (req, res) => {
    const token = req.cookies.github_token;
    if (token) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// To handle logout 
router.get('/logout', (req, res) => {
    res.clearCookie('github_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
   
    res.redirect(process.env.CLIENT_URL!);
});

export default router;