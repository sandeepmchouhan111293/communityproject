import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './core/Dashboard';
import DownloadLogsButton from './components/DownloadLogsButton';
import HighlightAdminPanel from './admin/HighlightAdminPanel';
import { LanguageProvider } from './i18n/LanguageContext';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { supabase } from './config/supabaseClient';

function App() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log("User signed in:", session.user);
      }
    });
  }, []);
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/highlight" element={<HighlightAdminPanel t={(key) => key} />} />
        </Routes>
        <DownloadLogsButton />
      </Router>
    </LanguageProvider>
  );
}

export default App;
