import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './Login'; // adjust the path if Login.js is inside /pages or /components
import Signup from './Signup'; // adjust the path if Signup.js is inside /pages or /components
import Dashboard from './Dashboard';
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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
