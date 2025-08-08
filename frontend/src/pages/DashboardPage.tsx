/* eslint-disable no-irregular-whitespace */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaGithub } from 'react-icons/fa';
import { VscRepo } from 'react-icons/vsc';
import { IoSparklesOutline } from 'react-icons/io5';

interface Repo {
    id: number;
    name: string;
    description: string;
    owner: {
        login: string;
    };
}

const DashboardPage = () => {
    const navigate = useNavigate();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            setLoading(true);
            try {
                // Raw URL को VITE_API_URL से बदला गया
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/github/repos`, {
                    withCredentials: true,
                });
                setRepos(response.data);
            } catch (err) {
                console.error('Error fetching repositories:', err);
                toast.error('Failed to load repositories. Please log in again.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchRepos();
    }, [navigate]);

    return (
        <div className='min-h-screen bg-gray-950 text-white font-sans pt-24 pb-16'>
            <div className='py-16 px-8 sm:px-12 mb-10 relative overflow-hidden flex flex-col items-center text-center'>
                <div className='relative z-10'>
                    <FaGithub className='text-6xl text-blue-400 mx-auto mb-4' />
                    <h1 className='text-5xl sm:text-6xl font-extrabold tracking-tight text-blue-300'>
                        <span className='text-gray-100'>Your</span> GitHub Repositories
                    </h1>
                    <p className='text-lg text-gray-400 mt-2'>Explore and manage your projects with ease.</p>
                </div>
            </div>
            <div className='bg-white/5 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-700 mx-auto max-w-7xl'>
                <h2 className='text-2xl font-bold mb-6 text-gray-100'>Repository List</h2>
                {loading ? (
                    <div className='flex flex-col justify-center items-center h-64 text-gray-400'>
                        <svg className="animate-spin h-12 w-12 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className='text-lg'>Loading repositories...</p>
                    </div>
                ) : repos.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {repos.map((repo) => (
                            <Link to={`/repo/${repo.owner.login}/${repo.name}`} key={repo.id}>
                                <div
                                    className='bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 cursor-pointer border border-gray-700 hover:border-blue-500'
                                >
                                    <div className='flex items-center mb-3'>
                                        <VscRepo className='text-blue-400 text-3xl mr-3 flex-shrink-0' />
                                        <h2 className='text-xl font-bold text-gray-100 truncate'>{repo.name}</h2>
                                    </div>
                                    <p className='text-gray-300 text-sm mb-4 line-clamp-3'>
                                        {repo.description || 'No description provided.'}
                                    </p>
                                    <div className='flex justify-between items-center text-sm text-gray-400'>
                                        <span>Owner: {repo.owner.login}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center h-64 text-gray-500 text-center p-4'>
                        <IoSparklesOutline className='w-16 h-16 text-blue-400 mb-4 animate-pulse' />
                        <p className='text-lg font-semibold'>No repositories found.</p>
                        <p className='text-sm mt-2 max-w-sm'>Please ensure you have authenticated with GitHub and have repositories available under your account.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;