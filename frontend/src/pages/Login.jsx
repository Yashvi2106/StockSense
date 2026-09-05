import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@stocksense.ai');
    setPassword('DemoTrader2026!');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Stock<span className="text-indigo-400">Sense</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-1 text-xs text-gray-400">Access multi-factor stock analytics and AI insights</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-800/80 border border-gray-700/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-800/80 border border-gray-700/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 mb-2">Reviewing for evaluation or portfolio testing?</p>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
