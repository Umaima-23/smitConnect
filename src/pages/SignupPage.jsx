import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    cnic: '',
    rollNo: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. Check if student exists in our "authorized" list
  const { data: isAuthorized, error: authCheckError } = await supabase
    .from('authStudents') // Agar quotes se error aaye toh sirf 'authStudents' likho
    .select('*')
    .eq('cnic', formData.cnic)
    .eq('rollNo', formData.rollNo)
    .single();

  if (authCheckError || !isAuthorized) {
    alert("Record not found! Table mein data check karein.");
    setLoading(false);
    return;
  }

  // 2. Agar mil gaya, toh Auth User banao
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (signUpError) {
    alert(signUpError.message);
  } else {
    alert("Signup Successful! Check your email.");
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">SMIT Connect</h2>
        <p className="text-center text-gray-600 mb-8">Create your student account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 outline-blue-500"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CNIC</label>
              <input
                type="text"
                placeholder="42101-XXXXXXX-X"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 outline-blue-500"
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 outline-blue-500"
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 outline-blue-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 outline-blue-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;