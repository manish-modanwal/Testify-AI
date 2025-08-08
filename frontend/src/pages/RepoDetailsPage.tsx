/* eslint-disable no-irregular-whitespace */
import { useEffect, useState, useCallback } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import RepoExplorer from '../components/RepoExplorer';
import ActionPanel from '../components/ActionPanel';
import GeneratedOutput from '../components/GeneratedOutput';


interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    sha: string;
    url: string;
}

interface SelectedFile {
    name: string;
    path: string;
    content: string;
    language: string;
}

interface FileSummary {
    title: string;
    description: string;
    framework: string;
    complexity: string;
    filesCovered: string[];
    fileContent: string;
    fileName: string;
}

const SUPPORTED_LANGUAGES: { [key: string]: { frameworks: string[]; extensions: string[] } } = {
    'javascript/typescript': { frameworks: ['jest', 'mocha', 'cypress'], extensions: ['js', 'jsx', 'ts', 'tsx'] },
    'python': { frameworks: ['pytest', 'selenium'], extensions: ['py', 'pyw'] },
    'java': { frameworks: ['junit'], extensions: ['java'] },
    'c/c++': { frameworks: ['googletest'], extensions: ['c', 'cpp', 'cc', 'cxx'] },
    'c#': { frameworks: ['nunit', 'xunit'], extensions: ['cs'] },
    'php': { frameworks: ['phpunit'], extensions: ['php'] },
    'ruby': { frameworks: ['rspec'], extensions: ['rb'] },
    'go': { frameworks: ['testing'], extensions: ['go'] },
    'rust': { frameworks: ['cargotest'], extensions: ['rs'] },
};

const getLanguageFromFileName = (fileName: string): string | null => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;
    for (const lang in SUPPORTED_LANGUAGES) {
        if (SUPPORTED_LANGUAGES[lang].extensions.includes(extension)) {
            return lang;
        }
    }
    return null;
};


const RepoDetailsPage = () => {
    const { owner, repoName } = useParams<{ owner: string; repoName: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [currentPath, setCurrentPath] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [allFileSummaries, setAllFileSummaries] = useState<FileSummary[]>([]);
    const [supportedFrameworks, setSupportedFrameworks] = useState<string[]>([]);
    const [selectedFramework, setSelectedFramework] = useState('');
    const [generationType, setGenerationType] = useState<'summaries' | 'code' | null>(null);
    const [fetchingFile, setFetchingFile] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState('');
    const [prLink, setPrLink] = useState<string | null>(null);
    const [isCreatingPr, setIsCreatingPr] = useState(false);
    const [selectedFileLanguage, setSelectedFileLanguage] = useState('');
    
   
    const fetchRepoContents = useCallback(async (path = '') => {
        setLoading(true);
        try {
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/github/repos/${owner}/${repoName}/contents`,
                {
                    withCredentials: true,
                    params: { path: path }
                }
            );
            setFiles(response.data);
            setCurrentPath(path);
            setSelectedFiles([]);
            setSupportedFrameworks([]);
            setSelectedFramework('');
            setGeneratedCode('');
            setAllFileSummaries([]);
            setNewFileName('');
            setPrLink(null);
        } catch (err: any) {
            console.error('Error fetching repository contents:', err.response?.data?.error || err.message);
            toast.error('Failed to load repository contents.');
            if (err.response?.status === 401) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    }, [owner, repoName, navigate]); 

    const updateSupportedFrameworks = (files: SelectedFile[]) => {
        if (files.length === 0) {
            setSupportedFrameworks([]);
            setSelectedFramework('');
            setSelectedFileLanguage('');
            return;
        }
        const languages = new Set(files.map(f => f.language));
        if (languages.size > 1) {
            setSupportedFrameworks([]);
            setSelectedFramework('');
            setSelectedFileLanguage('');
            return;
        }
        const langKey = languages.values().next().value;
        if (langKey && SUPPORTED_LANGUAGES[langKey]) {
            const frameworks = SUPPORTED_LANGUAGES[langKey].frameworks;
            setSupportedFrameworks(frameworks);
            setSelectedFramework(frameworks[0] || '');
            setSelectedFileLanguage(langKey);
        } else {
            setSupportedFrameworks([]);
            setSelectedFramework('');
            setSelectedFileLanguage('');
        }
    };

    const fetchAndSelectFile = async (item: FileItem) => {
        const isSelected = selectedFiles.some(f => f.path === item.path);
        if (isSelected) {
            const newSelectedFiles = selectedFiles.filter(f => f.path !== item.path);
            setSelectedFiles(newSelectedFiles);
            updateSupportedFrameworks(newSelectedFiles);
            return;
        }
        const language = getLanguageFromFileName(item.name);
        if (!language) {
            toast.error(`Unsupported file type: ${item.name}`);
            return;
        }
        setFetchingFile(item.path);
        try {
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/github/repos/${owner}/${repoName}/file`,
                {
                    withCredentials: true,
                    params: { path: item.path }
                }
            );
            const newSelectedFile: SelectedFile = {
                name: item.name,
                path: item.path,
                content: response.data,
                language: language,
            };
            const newSelectedFiles = [...selectedFiles, newSelectedFile];
            setSelectedFiles(newSelectedFiles);
            updateSupportedFrameworks(newSelectedFiles);
            toast.success(`Selected file: ${item.name}`);
            setNewFileName('');
            setPrLink(null);
        } catch (err: any) {
            console.error('Error fetching file content:', err.response?.data?.error || err.message);
            toast.error('Failed to load file content.');
            if (err.response?.status === 401) {
                navigate('/');
            }
        } finally {
            setFetchingFile(null);
        }
    };

    const handleFileSelect = (item: FileItem) => {
        if (item.type === 'dir') {
            fetchRepoContents(item.path);
        } else {
            fetchAndSelectFile(item);
        }
    };

    const handleBackClick = () => {
        const pathParts = currentPath.split('/').filter(Boolean);
        if (pathParts.length > 0) {
            pathParts.pop();
            const newPath = pathParts.join('/');
            fetchRepoContents(newPath);
        } else {
            navigate('/dashboard');
        }
    };

    const handleGenerateSummaries = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select one or more files to generate summaries.");
            return;
        }
        const emptyFiles = selectedFiles.filter(file => !file.content.trim());
        if (emptyFiles.length > 0) {
            toast.error(`Cannot generate summary for empty file(s): ${emptyFiles.map(f => f.name).join(', ')}.`);
            return;
        }
        const language = selectedFiles[0].language;
        setIsGenerating(true);
        setGenerationType('summaries');
        setGeneratedCode('');
        setAllFileSummaries([]);
        setNewFileName('');
        setPrLink(null);
        try {
            const fileContents = selectedFiles.map(file => ({
                fileName: file.name,
                content: file.content
            }));
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/ai/generate-summaries`,
                {
                    files: fileContents,
                    language: language,
                    framework: selectedFramework,
                }
            );
            const summaries: FileSummary[] = response.data;
            if (summaries && Array.isArray(summaries)) {
                const populatedSummaries = summaries.map(sum => {
                    const originalFile = selectedFiles.find(f => f.name === sum.fileName);
                    return {
                        ...sum,
                        fileContent: originalFile?.content || '',
                        framework: selectedFramework
                    };
                });
                setAllFileSummaries(populatedSummaries);
                toast.success('Test summaries generated successfully!');
            } else {
                throw new Error('Invalid response format from API.');
            }
        } catch (err: any) {
            console.error('Error generating summaries:', err);
            const errorMessage = err.response?.data?.error || 'Failed to generate test summaries.';
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
            setGenerationType(null);
        }
    };

    const handleGenerateCodeFromSummary = async (summary: FileSummary) => {
        if (!summary || !summary.fileContent || !summary.fileName || !summary.framework) {
            toast.error("Missing data to generate code. Please ensure a file and framework are selected.");
            console.error('Error: Missing required data for code generation.', { summary });
            return;
        }
        setIsGenerating(true);
        setGenerationType('code');
        setGeneratedCode('');
        setNewFileName('');
        setPrLink(null);
        const fileToUse = selectedFiles.find(f => f.name === summary.fileName);
        if (!fileToUse) {
            toast.error(`File "${summary.fileName}" not found in selected files.`);
            setIsGenerating(false);
            setGenerationType(null);
            return;
        }
        const payload = {
            fileContent: fileToUse.content,
            fileName: fileToUse.name,
            summary: summary.description,
            language: fileToUse.language,
            framework: selectedFramework,
        };
        try {
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/ai/generate-code-from-summary`,
                payload
            );
            const rawCode = response.data;
            const cleanCode = rawCode.replace(/```(typescript|javascript|python|java|cpp|csharp|php|ruby|go|rust)\n/g, '').replace(/```/g, '').trim();
            setGeneratedCode(cleanCode);
            const [name, ext] = fileToUse.name.split('.');
            setNewFileName(`${name}.test.${ext}`);
            toast.success('Test code generated successfully!');
        } catch (err: any) {
            console.error('Error generating code from summary:', err);
            const errorMessage = err.response?.data?.error || 'Failed to generate test code from summary.';
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
            setGenerationType(null);
        }
    };

    const handleCreatePullRequest = async () => {
        if (!generatedCode || !newFileName) {
            toast.error("Generated code or a file name is missing.");
            return;
        }
        setIsCreatingPr(true);
        try {
          
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/github/create-pr`,
                {
                    owner,
                    repoName,
                    fileName: newFileName,
                    content: generatedCode,
                },
                {
                    withCredentials: true,
                }
            );
            setPrLink(response.data.prUrl);
            toast.success('Pull request created successfully!');
        } catch (err: any) {
            console.error('Error creating pull request:', err.response?.data?.error || err.message);
            const errorMessage = err.response?.data?.error || 'Failed to create pull request.';
            toast.error(errorMessage);
        } finally {
            setIsCreatingPr(false);
        }
    };
    
    
    useEffect(() => {
        fetchRepoContents();
    }, [owner, repoName, fetchRepoContents]);

    const hasSelectedFiles = selectedFiles.length > 0;
    const hasMultipleLanguages = new Set(selectedFiles.map(f => f.language)).size > 1;

    return (
        <div className='min-h-screen bg-gray-950 text-gray-200 font-sans'>
            <div className='max-w-full mx-auto pt-32 pb-12 px-12 md:px-20'>
                <div className='flex flex-col md:flex-row gap-6'>
                    <RepoExplorer
                        owner={owner!}
                        repoName={repoName!}
                        currentPath={currentPath}
                        files={files}
                        loading={loading}
                        fetchingFile={fetchingFile}
                        selectedFilesPaths={selectedFiles.map(f => f.path)}
                        onBackClick={handleBackClick}
                        onFileSelect={handleFileSelect}
                    />

                    <div className='bg-gray-850 p-6 rounded-2xl shadow-xl md:w-2/3 w-full flex-grow flex flex-col border border-gray-700/50'>
                        <ActionPanel
                            hasSelectedFiles={hasSelectedFiles}
                            hasMultipleLanguages={hasMultipleLanguages}
                            selectedFilesCount={selectedFiles.length}
                            supportedFrameworks={supportedFrameworks}
                            selectedFramework={selectedFramework}
                            isGenerating={isGenerating}
                            generationType={generationType}
                            onFrameworkChange={(e) => setSelectedFramework(e.target.value)}
                            onGenerateSummaries={handleGenerateSummaries}
                        />

                        <div className='flex-grow overflow-auto'>
                            {!hasSelectedFiles && !allFileSummaries.length && !isGenerating && !generatedCode ? (
                                <div className='flex justify-center items-center h-full'>
                                    <p className='text-gray-400 text-lg'>Select a supported file from the left to begin.</p>
                                </div>
                            ) : (
                                <GeneratedOutput
                                    allFileSummaries={allFileSummaries}
                                    generatedCode={generatedCode}
                                    isGenerating={isGenerating}
                                    generationType={generationType}
                                    prLink={prLink}
                                    isCreatingPr={isCreatingPr}
                                    newFileName={newFileName}
                                    selectedFileLanguage={selectedFiles[0]?.language || 'typescript'}
                                    
                                    onGenerateCodeFromSummary={handleGenerateCodeFromSummary}
                                    onNewFileNameChange={(e) => setNewFileName(e.target.value)}
                                    onCreatePullRequest={handleCreatePullRequest}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoDetailsPage;