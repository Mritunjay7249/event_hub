import React, { useState } from 'react';
import { User, Shield, ShieldAlert, Trash2, Search, Filter } from 'lucide-react';
import { User as UserType } from '../types';
import { cn } from '../utils';

interface UserManagementProps {
  users: UserType[];
  onUpdateUser: (userId: string, updates: Partial<UserType>) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserManagement({ users, onUpdateUser, onDeleteUser }: UserManagementProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system users, roles, and access status.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      user.role === 'Admin' ? "bg-purple-50 text-purple-700" :
                      user.role === 'Organizer' ? "bg-blue-50 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      user.status === 'Active' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onUpdateUser(user.id, { status: user.status === 'Active' ? 'Blocked' : 'Active' })}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          user.status === 'Active' ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"
                        )}
                        title={user.status === 'Active' ? "Block User" : "Unblock User"}
                      >
                        {user.status === 'Active' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                      </button>
                      <button 
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
