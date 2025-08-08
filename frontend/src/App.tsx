// frontend/src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RepoDetailsPage from './pages/RepoDetailsPage'; 
import HomePage from './pages/Homepage';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/repo/:owner/:repoName" element={<Layout><RepoDetailsPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;