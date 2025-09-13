
import React, { useState, useEffect } from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabaseClient';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { session, isSessionLoading } = useData();
  // FIX: Changed to use namespaced import.
  const navigate = ReactRouterDOM.useNavigate();

  useEffect(() => {
    if (!isSessionLoading && session) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, isSessionLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // FIX: Use `signInWithPassword` which is the correct method for Supabase v2.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };
  
  if (isSessionLoading || session) {
    return (
        <div className="fixed inset-0 bg-coffee-light flex items-center justify-center z-[100]">
            <p className="text-coffee-dark text-lg font-display tracking-widest">Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-coffee-light text-coffee-dark font-sans p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block" aria-hidden="true">
             <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-display text-coffee-dark mt-4">Admin Login</h1>
          <p className="text-gray-600">Access the Navjivan Restaurant control panel.</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-2">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-100 text-coffee-dark border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-brown" required placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-600 block mb-2">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-100 text-coffee-dark border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-brown" required placeholder="Enter password" />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button type="submit" className="w-full py-3 px-4 font-bold text-white bg-coffee-brown rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          {/* FIX: Changed to use namespaced import. */}
          <ReactRouterDOM.Link to="/" className="text-sm text-coffee-brown hover:underline">
            ← Back to Main Site
          </ReactRouterDOM.Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;