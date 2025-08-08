// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RepoDetailsPage from './pages/RepoDetailsPage'; 
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Toaster />
     
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/repo/:owner/:repoName" element={<RepoDetailsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;