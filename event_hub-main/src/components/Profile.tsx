import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Save, Key } from 'lucide-react';
import { UserRole } from '../types';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export default function Profile({ user }: ProfileProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 rounded-3xl bg-indigo-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-100">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-indigo-600 font-medium text-sm mb-6">{user.role}</p>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 px-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Account Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium text-gray-900">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium text-indigo-600">{user.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Verification</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h4>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-indigo-500" />
                    Full Name
                  </label>
                  <input
                    disabled={!isEditing}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-indigo-500" />
                    Email Address
                  </label>
                  <input
                    disabled={!isEditing}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              
              {isEditing && (
                <button 
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Security</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <Key size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password regularly</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  Update
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
