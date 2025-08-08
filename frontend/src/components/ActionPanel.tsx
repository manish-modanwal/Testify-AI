
import React from 'react';

interface ActionPanelProps {
    hasSelectedFiles: boolean;
    hasMultipleLanguages: boolean;
    selectedFilesCount: number;
    supportedFrameworks: string[];
    selectedFramework: string;
    isGenerating: boolean;
    generationType: 'summaries' | 'code' | null;
    onFrameworkChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onGenerateSummaries: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
    hasSelectedFiles,
    hasMultipleLanguages,
    selectedFilesCount,
    supportedFrameworks,
    selectedFramework,
    isGenerating,
    generationType,
    onFrameworkChange,
    onGenerateSummaries,
}) => {
    const isButtonDisabled = isGenerating || !hasSelectedFiles || hasMultipleLanguages || !selectedFramework;

    return (
        <div className="border-b border-gray-700/50 pb-4 mb-6">
            <h2 className='text-xl font-semibold mb-4 text-gray-200'>
                {hasSelectedFiles ? `${selectedFilesCount} File(s) Selected` : 'Select Files from Left Panel'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {hasMultipleLanguages ? (
                    <span className='text-red-400 text-sm p-2 bg-red-900/30 rounded-lg'>Please select files of the same language.</span>
                ) : (
                    <>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="framework-select" className="text-gray-400 text-sm">Framework:</label>
                            <select
                                id="framework-select"
                                value={selectedFramework}
                                onChange={onFrameworkChange}
                                className={`p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${!supportedFrameworks.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!supportedFrameworks.length}
                            >
                                {supportedFrameworks.length > 0 ? (
                                    supportedFrameworks.map(framework => (
                                        <option key={framework} value={framework}>
                                            {framework.toUpperCase()}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Select Framework</option>
                                )}
                            </select>
                        </div>
                        <button
                            onClick={onGenerateSummaries}
                            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]'
                            disabled={isButtonDisabled}
                        >
                            {isGenerating && generationType === 'summaries' ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </div>
                            ) : (
                                `Generate Test Summaries`
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActionPanel;