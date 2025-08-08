

import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/30 backdrop-blur-lg border-t border-gray-800 text-gray-400 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and social icons */}
          <div className="space-y-4">
            <a href="#" className="flex items-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Testify AI
            </a>
            <p className="text-sm max-w-xs">
              Automate code reviews, generate tests, and ship high-quality code, faster.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://www.linkedin.com/in/manish-modanwal-125887232/" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="https://github.com/manish-modanwal" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h5 className="text-lg font-bold text-white mb-4">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold text-white mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Community</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h5 className="text-lg font-bold text-white mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm">
          &copy; 2025 Testify AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;