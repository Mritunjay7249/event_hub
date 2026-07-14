import React, { useState } from 'react';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email: string, role: 'Admin' | 'Organizer' | 'User') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For demo, determine role by email
      let role: 'Admin' | 'Organizer' | 'User' = 'User';
      if (email.includes('admin')) role = 'Admin';
      else if (email.includes('organizer')) role = 'Organizer';
      
      onLogin(email, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-xl shadow-indigo-200">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EventHub Pro</h1>
          <p className="text-gray-500 mt-2">Manage your events with intelligence</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eventhub.pro"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock size={16} className="text-indigo-500" />
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 font-medium hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Create one</a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          &copy; 2024 EventHub Pro. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
