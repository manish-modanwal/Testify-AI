import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { IoSparklesOutline } from 'react-icons/io5'; 
import type { FileSummary } from '../types';

interface GeneratedOutputProps {
    allFileSummaries: FileSummary[];
    generatedCode: string;
    isGenerating: boolean;
    generationType: 'summaries' | 'code' | null;
    prLink: string | null;
    isCreatingPr: boolean;
    newFileName: string;
    selectedFileLanguage: string;
    onGenerateCodeFromSummary: (summary: FileSummary) => Promise<void>;
    onNewFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreatePullRequest: () => Promise<void>;
}

const GeneratedOutput: React.FC<GeneratedOutputProps> = ({
    allFileSummaries,
    generatedCode,
    isGenerating,
    generationType,
    prLink,
    isCreatingPr,
    newFileName,
    selectedFileLanguage,
    onGenerateCodeFromSummary,
    onNewFileNameChange,
    onCreatePullRequest,
}) => {
    const isPrButtonDisabled = isCreatingPr || !generatedCode || !newFileName;

    // Loading state for summaries 
    if (isGenerating && generationType === 'summaries') {
        return (
            <div className="flex flex-col justify-center items-center h-48 text-gray-400">
                <IoSparklesOutline className='w-12 h-12 text-blue-400 animate-pulse mb-4' />
                <p className='mt-2 text-xl'>Generating summaries...</p>
                <p className='mt-1 text-gray-500'>This may take a moment.</p>
            </div>
        );
    }
    
    // Loading state for code 
    if (isGenerating && generationType === 'code') {
        return (
            <div className="flex flex-col justify-center items-center h-48 text-gray-400">
                <IoSparklesOutline className='w-12 h-12 text-blue-400 animate-pulse mb-4' />
                <p className='mt-2 text-xl'>Generating test code...</p>
                <p className='mt-1 text-gray-500'>This may take a moment.</p>
            </div>
        );
    }

    if (prLink) {
        return (
            <div className="mt-4 p-4 border border-green-500 rounded-lg bg-green-900/30">
                <h3 className="text-xl font-semibold text-green-300 mb-2">Pull Request Created!</h3>
                <p className="text-green-300 mb-4">Your Pull Request has been successfully created on GitHub.</p>
                <a
                    href={prLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    View Pull Request on GitHub
                </a>
            </div>
        );
    }

    // The rest of your component's JSX for displaying summaries or code
    return (
        <div className="mt-4">
            {generatedCode && (
                <div className="mb-6">
                    <div className="mb-4 p-4 border border-blue-500 rounded-lg bg-blue-900/30">
                        <h4 className="text-lg font-semibold text-blue-300 mb-2">Create Pull Request</h4>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                value={newFileName}
                                onChange={onNewFileNameChange}
                                placeholder="Enter new test file name (e.g., example.test.js)"
                                className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={onCreatePullRequest}
                                className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                                disabled={isPrButtonDisabled}
                            >
                                {isCreatingPr ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating PR...
                                    </div>
                                ) : (
                                    'Create Pull Request'
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="border border-green-500 rounded-lg overflow-hidden">
                        <h3 className="text-lg font-semibold bg-green-900/50 p-3 flex justify-between items-center text-green-300">
                            Generated Test Code
                        </h3>
                        <SyntaxHighlighter
                            language={selectedFileLanguage}
                            style={atomOneDark}
                            customStyle={{ padding: '1.5rem', borderRadius: '0 0 0.5rem 0.5rem', fontSize: '0.875rem', lineHeight: '1.5', backgroundColor: '#1f2937' }}
                        >
                            {generatedCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
            
            {allFileSummaries.length > 0 && (
                <div className="mt-4 border border-blue-500 rounded-lg p-4 bg-gray-900 flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-blue-300">Test Summaries</h3>
                    {allFileSummaries.map((fileSummary, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700/50 hover:border-blue-400 transition-colors duration-200">
                            <p className='text-sm text-gray-400 mb-2'>Summary for: <span className='font-mono text-blue-200'>{fileSummary.fileName}</span></p>
                            <h4 className='text-lg font-bold text-gray-100 mb-1'>{fileSummary.title}</h4>
                            <p className='text-gray-300 text-sm mb-3'>{fileSummary.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
                                <span className="bg-gray-700 rounded-full px-3 py-1">Framework: {fileSummary.framework}</span>
                                <span className="bg-gray-700 rounded-full px-3 py-1">Complexity: {fileSummary.complexity}</span>
                            </div>
                            <button
                                onClick={() => onGenerateCodeFromSummary(fileSummary)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isGenerating}
                            >
                                Generate Code
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!generatedCode && allFileSummaries.length === 0 && !isGenerating && (
                <div className='flex justify-center items-center h-full'>
                    <p className='text-gray-400 text-lg'>Select a supported file from the left to begin.</p>
                </div>
            )}
        </div>
    );
};

export default GeneratedOutput;