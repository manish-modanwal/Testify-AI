import React from 'react';
import { VscFolder, VscArrowLeft, VscFileCode } from 'react-icons/vsc';

interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    sha: string;
    url: string;
}

interface RepoExplorerProps {
    owner: string;
    repoName: string;
    currentPath: string;
    files: FileItem[];
    loading: boolean;
    fetchingFile: string | null;
    selectedFilesPaths: string[];
    onBackClick: () => void;
    onFileSelect: (item: FileItem) => void;
}

const RepoExplorer: React.FC<RepoExplorerProps> = ({
    owner,
    repoName,
    currentPath,
    files,
    loading,
    fetchingFile,
    selectedFilesPaths,
    onBackClick,
    onFileSelect,
}) => {
    return (
        <div className='bg-gray-900 p-6 rounded-xl shadow-2xl md:w-1/3 w-full flex-shrink-0 border border-blue-500 flex flex-col '>
            {/* Header with Navigation */}
            <div className='flex items-center mb-6 pb-4 border-b border-gray-800'>
                <button
                    onClick={onBackClick}
                    className='flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1'
                >
                    <VscArrowLeft className='mr-2 text-xl' />
                    <span className='font-medium'>{currentPath ? `Back` : `Back to Repos`}</span>
                </button>
            </div>

            {/* Repo Title and Path */}
            <h1 className='text-3xl font-extrabold mb-1 text-blue-400 truncate'>
                {repoName}
            </h1>
            <p className="text-gray-400 mb-4 text-sm font-mono truncate">
                {currentPath ? `${owner}/${repoName}/${currentPath}` : `${owner}/${repoName}`}
            </p>

            <h2 className='text-lg font-semibold mb-4 text-gray-300 border-b border-gray-800 pb-2'>File Explorer</h2>

            {/* File List */}
            {loading ? (
                <div className='flex flex-col justify-center items-center h-48 text-gray-400'>
                    <svg className="animate-spin h-8 w-8 text-blue-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading contents...
                </div>
            ) : (
                <ul className='space-y-1 overflow-y-auto pr-1 flex-grow'>
                    {files.map((file) => (
                        <li
                            key={file.sha}
                            className={`flex items-center p-3 rounded-md hover:bg-gray-800 transition-all duration-200 cursor-pointer
                                ${selectedFilesPaths.includes(file.path) ? 'bg-blue-900/40 border-l-4 border-blue-500 font-bold' : ''}`}
                            onClick={() => onFileSelect(file)}
                        >
                            {file.type === 'dir' ? (
                                <VscFolder className='text-blue-400 text-xl mr-3 flex-shrink-0' />
                            ) : (
                                <div className='flex items-center flex-shrink-0 mr-3'>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilesPaths.includes(file.path)}
                                        readOnly
                                        className="form-checkbox h-5 w-5 text-blue-600 bg-gray-900 border-gray-600 rounded-md cursor-pointer"
                                    />
                                    {fetchingFile === file.path ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 ml-3"></div>
                                    ) : (
                                        <VscFileCode className='text-gray-400 text-xl ml-3' />
                                    )}
                                </div>
                            )}
                            <span className='text-gray-200 font-medium break-all'>{file.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RepoExplorer;