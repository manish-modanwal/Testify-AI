// src/routes/githubRoutes.ts

import { Router } from 'express';
import axios from 'axios';
import { getRepositories } from '../services/githubService';

const router = Router();

// Route to get a list of all repositories for the logged-in user
router.get('/repos', async (req, res) => {
    console.log('➡️ Incoming request to /api/github/repos');

    
    const token = req.cookies.github_token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    try {
        const repos = await getRepositories(token);
        res.json(repos);
    } catch (error: any) {
        console.error('❌ Error while fetching GitHub repositories:', error.message || error);
        res.status(500).json({ error: error.message || 'Failed to fetch repositories.' });
    }
});

// New route to get the contents (files and folders) of a specific repository
router.get('/repos/:owner/:repoName/contents', async (req, res) => {
    console.log('➡️ Incoming request to /api/github/repos/:owner/:repoName/contents');
    const { owner, repoName } = req.params;
    const path = req.query.path || '';

    
    const token = req.cookies.github_token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    try {
        const githubResponse = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'User-Agent': 'Test-Case-Generator-App',
                },
            }
        );
        console.log(`✅ Fetched contents for ${owner}/${repoName}/${path}`);
        res.json(githubResponse.data);
    } catch (error: any) {
        console.error('❌ Error while fetching repository contents:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch repository contents.' });
    }
});

// Route to get the raw content of a specific file
router.get('/repos/:owner/:repoName/file', async (req, res) => {
    console.log('➡️ Incoming request to /api/github/repos/:owner/:repoName/file');
    const { owner, repoName } = req.params;
    const path = req.query.path as string;

    if (!path) {
        return res.status(400).json({ error: 'File path is required.' });
    }

   
    const token = req.cookies.github_token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    try {
        const githubResponse = await axios.get(
            `https://raw.githubusercontent.com/${owner}/${repoName}/main/${path}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(`✅ Fetched file content for ${path}`);
        res.send(githubResponse.data);
    } catch (error: any) {
        console.error('❌ Error while fetching file content:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch file content.' });
    }
});


// New route to create a new branch, commit a file, and create a pull request
router.post('/create-pr', async (req, res) => {
    console.log('➡️ Incoming request to /api/github/create-pr');
    const { owner, repoName, fileName, content } = req.body;
    
    
    const token = req.cookies.github_token;

    if (!token || !owner || !repoName || !fileName || !content) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const branchName = `feat/add-test-${Date.now()}`;
    const commitMessage = `feat: Add test file for ${fileName}`;
    const prTitle = `Add automated test for ${fileName}`;
    const prBody = `This pull request adds an automatically generated test file for \`${fileName}\`.`;

    try {
        //  Get the SHA of the latest commit on the default branch 
        const { data: { object: { sha: latestSha } } } = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/main`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Create a new branch
        await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/git/refs`,
            { ref: `refs/heads/${branchName}`, sha: latestSha },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //  Create the new file content as a blob
        const { data: { sha: blobSha } } = await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/git/blobs`,
            { content: content, encoding: 'utf-8' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //  Get the SHA of the tree of the latest commit
        const { data: { tree: baseTree } } = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/git/commits/${latestSha}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //  Create a new tree with the new file
        const { data: { sha: newTreeSha } } = await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/git/trees`,
            { base_tree: baseTree.sha, tree: [{ path: fileName, mode: '100644', type: 'blob', sha: blobSha }] },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //  Create a new commit
        const { data: { sha: newCommitSha } } = await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/git/commits`,
            { message: commitMessage, tree: newTreeSha, parents: [latestSha] },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //  Update the new branch to point to the new commit
        await axios.patch(
            `https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${branchName}`,
            { sha: newCommitSha },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Create the pull request
        const { data: prData } = await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/pulls`,
            {
                title: prTitle,
                head: branchName,
                base: 'main', // Assuming 'main' is the default branch
                body: prBody,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`✅ Pull request created for ${prData.html_url}`);
        res.json({ prUrl: prData.html_url });
    } catch (error: any) {
        console.error('❌ Error creating pull request:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create pull request.' });
    }
});

export default router;