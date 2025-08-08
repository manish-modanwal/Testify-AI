import { Router } from 'express';
import { generateTestSummaries, generateCodeFromSummary } from '../services/geminiService';

const router = Router();


router.post('/generate-summaries', async (req, res) => {
   
    const { files, language, framework } = req.body;
    
    if (!files || files.length === 0 || !language) {
        return res.status(400).json({ error: 'Missing required parameters: files or language.' });
    }

    try {
        const summaries = await generateTestSummaries(files, language, framework);
        res.json(summaries);
    } catch (error: any) {
        console.error('Error generating summaries:', error);
        res.status(500).json({ error: error.message || 'Failed to generate test summaries.' });
    }
});

// Route to generate code from a specific summary
router.post('/generate-code-from-summary', async (req, res) => {
    const { fileContent, fileName, summary, language, framework } = req.body;

    if (!fileContent || !fileName || !summary || !language || !framework) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    try {
        const generatedCode = await generateCodeFromSummary(fileContent, fileName, summary, language, framework);
        res.json(generatedCode);
    } catch (error: any) {
        console.error('Error generating code from summary:', error);
        res.status(500).json({ error: error.message || 'Failed to generate test code from summary.' });
    }
});

export default router;