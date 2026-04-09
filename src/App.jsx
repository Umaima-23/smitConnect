import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { syncAuthState } from './features/AuthSlice'; 
import { supabase } from './services/supabase';

// Saare Imports upar hone chahiye
import Login from './pages/Login';
import Signup from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import SMITHomePage from './pages/HomePage';
import Courses from './pages/Courses';
import StudentDashboard from './pages/Studentdashboard';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
    <h1 className="text-4xl font-bold text-blue-600 mb-8">Welcome to SMIT Connect</h1>
    <div className="space-x-4">
      <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
        Login
      </Link>
      <Link to="/signup" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300">
        Register as Student
      </Link>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncAuthState());

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        dispatch(syncAuthState());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
        <Route path="/" element={<SMITHomePage />} />
        <Route path="/courses" element={<Courses />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Route - Protection commented for now */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<div> <StudentDashboard/></div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;