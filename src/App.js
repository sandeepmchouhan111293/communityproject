import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import DownloadLogsButton from './DownloadLogsButton';
import { LanguageProvider } from './LanguageContext';
import Login from './Login';
import Signup from './Signup';
import { supabase } from './supabaseClient';

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
        </Routes>
        <DownloadLogsButton />
      </Router>
    </LanguageProvider>
  );
}

export default App;
