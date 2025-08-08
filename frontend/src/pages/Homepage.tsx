/* eslint-disable no-irregular-whitespace */


import React, { useEffect, useState } from 'react';
import {  FaCode, FaGithub, FaLightbulb, FaCheckCircle, FaChartLine, FaRobot, FaFlask, FaRegFileCode } from 'react-icons/fa';
import { IoChevronForward } from 'react-icons/io5';
import { VscRepo, VscFileCode, VscGitPullRequest } from 'react-icons/vsc';


import Navbar from '../components/Navbar';


const HomePage: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);

  
  useEffect(() => {
   
    const longestLineDuration = 3000; 
    const totalDuration = longestLineDuration + 2000; 
    
    const timer = setTimeout(() => {
      setAnimationKey(prevKey => prevKey + 1);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [animationKey]);
  
  // कोड ब्लॉक की लाइन्स और उनके एनिमेशन सेटिंग्स
  const codeLines = [
    { text: `$ git add .`, duration: '1s', steps: 10 },
    { text: `$ git commit -m "feat: Add new awesome feature"`, duration: '2s', steps: 42 },
    { text: `[main 5f7a3b4] feat: Add new awesome feature`, duration: '3s', steps: 43 },
    { text: `2 files changed, 27 insertions(+)`, duration: '2s', steps: 31 },
    { text: `$ git push origin main`, duration: '2s', steps: 22 },
    { text: `To https://github.com/mybrand/project.git`, duration: '3s', steps: 45 },
    { text: `* [new branch]      main -> main`, duration: '3s', steps: 35 },
    { text: `✨ Deployed to production successfully!`, duration: '3s', steps: 40, className: 'text-green-400' },
  ];

  return (
    <div className="bg-gray-950 text-white font-sans overflow-hidden">
      
     
      <Navbar />

     
      <header className="relative w-full min-h-screen pt-40 pb-24 flex items-center justify-center text-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
         
          <div className="particle" style={{ width: '20px', height: '20px', left: '10%', animationDuration: '15s' }}></div>
          <div className="particle" style={{ width: '15px', height: '15px', left: '20%', animationDuration: '20s' }}></div>
          <div className="particle" style={{ width: '25px', height: '25px', left: '30%', animationDuration: '25s' }}></div>
          <div className="particle" style={{ width: '10px', height: '10px', left: '40%', animationDuration: '18s' }}></div>
          <div className="particle" style={{ width: '30px', height: '30px', left: '50%', animationDuration: '22s' }}></div>
          <div className="particle" style={{ width: '18px', height: '18px', left: '60%', animationDuration: '17s' }}></div>
          <div className="particle" style={{ width: '22px', height: '22px', left: '70%', animationDuration: '23s' }}></div>
          <div className="particle" style={{ width: '12px', height: '12px', left: '80%', animationDuration: '19s' }}></div>
          <div className="particle" style={{ width: '28px', height: '28px', left: '90%', animationDuration: '24s' }}></div>
        </div>
        
        <div className="relative z-10 p-8 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 animate-fade-in">
            The Future of Your <br></br> Projects
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in delay-100">
            Automate code reviews, generate tests, and ship high-quality code, faster.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-24 animate-fade-in delay-200">
            <a 
              href="#features" 
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started <IoChevronForward className="ml-2" />
            </a>
            <a 
              href="#contact" 
              className="inline-block px-8 py-3 text-gray-300 font-bold border border-gray-600 rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>

         
          <div className="grid md:grid-cols-2 gap-12 items-center text-left mt-9">
            {/* Left side content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Automate Your Workflow
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Our platform intelligently analyzes your codebase, generates boilerplate code, and suggests improvements,
                allowing you to focus on innovation and writing core logic.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-blue-400 text-xl" />
                  <span className="text-gray-300">Intelligent Code Generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaChartLine className="text-teal-400 text-xl" />
                  <span className="text-gray-300">Performance Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaLightbulb className="text-yellow-400 text-xl" />
                  <span className="text-gray-300">Smart Code Suggestions</span>
                </div>
              </div>
            </div>

           
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-700 shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
             <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <span className="text-gray-500 text-sm font-mono">github.com/mybrand/project</span>
              </div>
              <div key={animationKey} className="font-mono text-xs md:text-sm text-gray-300 whitespace-pre-wrap space-y-2">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden whitespace-nowrap border-r-2 border-transparent ${line.className || ''}`}
                    style={{
                      animation: `typing ${line.duration} steps(${line.steps}, end) forwards`,
                      animationDelay: '0s',
                      animationFillMode: 'forwards',
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      
      <section id="how-it-works" className="py-20 sm:py-24 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How Our Platform <span className="text-blue-400">Works</span>
          </h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
            Our powerful workflow automates repetitive tasks so you can focus on writing great code.
            Follow these simple steps to supercharge your development.
          </p>
          <div className="relative flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 md:space-x-8">
            
            <div className="absolute top-1/2 left-0 w-full h-1 hidden md:block transform -translate-y-1/2">
              <div className="h-full w-full relative">
                <div className="absolute inset-0 bg-gray-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-snake-line origin-left" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            
            <div className="flex-1 text-center relative z-10">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500 animate-pop-in">
                <FaGithub className="text-4xl text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Connect with GitHub</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Securely log in with your GitHub account to get started in seconds.
              </p>
            </div>

            
            <div className="flex-1 text-center relative z-10">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-500 animate-pop-in delay-200">
                <VscRepo className="text-4xl text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Select Repository</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Choose the repository you want to analyze and work with.
              </p>
            </div>

            
            <div className="flex-1 text-center relative z-10">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-teal-500 animate-pop-in delay-400">
                <VscFileCode className="text-4xl text-teal-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Analyze & Generate</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Automatically generate code summaries and unit tests for your project.
              </p>
            </div>

          
            <div className="flex-1 text-center relative z-10">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500 animate-pop-in delay-600">
                <VscGitPullRequest className="text-4xl text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">4. Review & Merge</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Review the generated changes and merge them directly into your codebase.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="features" className="py-20 sm:py-32 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Key <span className="text-blue-400">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
          
            <div className="group bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-4 hover:rotate-1 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <FaRobot className="text-4xl text-blue-400 group-hover:animate-bounce-icon" />
                <h3 className="text-2xl font-bold">AI-Powered Code Summary</h3>
              </div>
              <p className="text-gray-400 text-base mb-6">
                Get instant, accurate summaries of your code changes, making pull request reviews faster and more efficient. Our intelligent engine understands your code's context and logic.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Context-aware summaries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaChartLine className="text-yellow-500" />
                  <span>Improved review speed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaRegFileCode className="text-purple-500" />
                  <span>Multi-language support</span>
                </li>
              </ul>
            </div>
            
            
            <div className="group bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-4 hover:-rotate-1 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <FaFlask className="text-4xl text-purple-400 group-hover:animate-bounce-icon" />
                <h3 className="text-2xl font-bold">Automated Test Generation</h3>
              </div>
              <p className="text-gray-400 text-base mb-6">
                Our platform automatically generates robust unit tests for your code, ensuring quality and stability. This reduces manual testing effort and catches bugs early in the development cycle.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Comprehensive test coverage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaCode className="text-yellow-500" />
                  <span>Supports popular frameworks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaRegFileCode className="text-purple-500" />
                  <span>Reduces manual effort</span>
                </li>
              </ul>
            </div>
            
            
            <div className="group bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-4 hover:rotate-1 cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <VscGitPullRequest className="text-4xl text-teal-400 group-hover:animate-bounce-icon" />
                <h3 className="text-2xl font-bold">Pull Request Automation</h3>
              </div>
              <p className="text-gray-400 text-base mb-6">
                From code generation to pull request creation, our platform automates the entire process, saving you time and ensuring a consistent, high-quality workflow.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Automated review process</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaCode className="text-yellow-500" />
                  <span>Quick feedback loops</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaRegFileCode className="text-purple-500" />
                  <span>Direct GitHub integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;