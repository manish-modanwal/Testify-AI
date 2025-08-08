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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiService_1 = require("../services/geminiService");
const router = (0, express_1.Router)();
router.post('/generate-summaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { files, language, framework } = req.body;
    if (!files || files.length === 0 || !language) {
        return res.status(400).json({ error: 'Missing required parameters: files or language.' });
    }
    try {
        const summaries = yield (0, geminiService_1.generateTestSummaries)(files, language, framework);
        res.json(summaries);
    }
    catch (error) {
        console.error('Error generating summaries:', error);
        res.status(500).json({ error: error.message || 'Failed to generate test summaries.' });
    }
}));
// Route to generate code from a specific summary
router.post('/generate-code-from-summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileContent, fileName, summary, language, framework } = req.body;
    if (!fileContent || !fileName || !summary || !language || !framework) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    try {
        const generatedCode = yield (0, geminiService_1.generateCodeFromSummary)(fileContent, fileName, summary, language, framework);
        res.json(generatedCode);
    }
    catch (error) {
        console.error('Error generating code from summary:', error);
        res.status(500).json({ error: error.message || 'Failed to generate test code from summary.' });
    }
}));
exports.default = router;
