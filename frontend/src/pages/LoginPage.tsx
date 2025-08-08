/* eslint-disable no-irregular-whitespace */


import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaGithub, FaCheckCircle, FaRocket } from 'react-icons/fa';


const LoginPage = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const isCalledRef = useRef(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !isCalledRef.current) {
            console.log('➡️ LoginPage: Found code in URL, starting callback process...');
            setIsProcessing(true);
            isCalledRef.current = true;

            const handleCallback = async () => {
                try {
                    
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/auth/github/callback?code=${code}`,
                        { withCredentials: true }
                    );

                    console.log('✅ LoginPage: Received response from backend:', response.data);

                    if (response.data.redirectUrl) {
                        console.log('✅ LoginPage: Redirecting to:', response.data.redirectUrl);
                        toast.success('Login successful!');
                        navigate(response.data.redirectUrl, { replace: true });
                    } else {
                        console.log('❌ LoginPage: No redirectUrl found in response.');
                        toast.error('Authentication failed.');
                        navigate('/login');
                    }

                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                catch (error: any) {
                    console.error("❌ LoginPage: Authentication failed:", error.response?.data || error.message);
                    toast.error(error.response?.data.error || 'Authentication failed.');
                    navigate('/login');
                }
            };

            handleCallback();
        }
    }, [navigate]);

    const handleLogin = () => {
        console.log('➡️ LoginPage: Redirecting to GitHub for authorization...');
       
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-950 text-white p-4'>
            <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-6xl'>

               
                <div className='md:w-1/2 text-left md:pr-12 mb-10 md:mb-0'>
                    <h1 className='text-5xl md:text-6xl font-extrabold text-blue-400 leading-tight'>
                        Generate Test Cases. Effortlessly.
                    </h1>
                    <p className='mt-4 text-xl text-gray-300'>
                        Our AI-powered tool analyzes your code and generates comprehensive test cases directly in your GitHub repository.
                    </p>
                    <ul className='mt-6 space-y-3 text-lg text-gray-400'>
                        <li className='flex items-center'>
                            <FaCheckCircle className='text-green-500 mr-3 flex-shrink-0' />
                            Integrates directly with your GitHub account.
                        </li>
                        <li className='flex items-center'>
                            <FaCheckCircle className='text-green-500 mr-3 flex-shrink-0' />
                            Supports multiple programming languages and frameworks.
                        </li>
                        <li className='flex items-center'>
                            <FaCheckCircle className='text-green-500 mr-3 flex-shrink-0' />
                            Creates Pull Requests automatically.
                        </li>
                    </ul>
                </div>

              
                <div className='relative p-10 rounded-xl shadow-2xl text-center w-full max-w-sm overflow-hidden bg-gray-900 border border-gray-700/50 transform transition-all duration-500 hover:border-blue-500 hover:scale-105'>

                  
                    <div className="absolute inset-0 border-4 border-transparent rounded-xl pointer-events-none z-0 transition-all duration-500 group-hover:border-blue-500 opacity-0 group-hover:opacity-100"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <FaRocket className="text-5xl text-blue-500 mb-4 animate-pulse" />
                        <h2 className='text-4xl font-bold mb-3 text-white'>Join the Future of Testing</h2>
                        <p className='text-gray-400 mb-8'>
                            Log in to your GitHub account and let AI handle the heavy lifting.
                        </p>
                        {isProcessing ? (
                            <div className='flex flex-col items-center justify-center'>
                                <svg className="animate-spin h-10 w-10 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className='text-gray-400'>Processing your login...</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className='flex items-center justify-center w-full px-6 py-4 text-xl font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 group'
                            >
                                <FaGithub className='mr-3 text-2xl group-hover:text-white transition-colors duration-300' />
                                Login with GitHub
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );

};

export default LoginPage;