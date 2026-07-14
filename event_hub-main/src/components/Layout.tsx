import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  PlusCircle, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  FileText,
  UserCircle,
  Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userRole: UserRole;
  userName: string;
}

export default function Layout({ children, activeTab, setActiveTab, onLogout, userRole, userName }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Organizer', 'User'] },
    { id: 'events', label: 'Events', icon: Calendar, roles: ['Admin', 'Organizer', 'User'] },
    { id: 'calendar', label: 'Calendar', icon: FileText, roles: ['Admin', 'Organizer', 'User'] },
    { id: 'tickets', label: 'My Tickets', icon: Ticket, roles: ['User'] },
    { id: 'approvals', label: 'Approvals', icon: ShieldCheck, roles: ['Admin'] },
    { id: 'users', label: 'Manage Users', icon: Users, roles: ['Admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['Admin'] },
    { id: 'profile', label: 'My Profile', icon: UserCircle, roles: ['Admin', 'Organizer', 'User'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Organizer', 'User'] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-gray-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-indigo-600"
            >
              EventHub Pro
            </motion.span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-indigo-50 text-indigo-600 font-medium" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} className={cn(
                activeTab === item.id ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
              )} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search events, attendees..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{userName}</p>
              <p className="text-xs text-indigo-600 font-medium">{userRole}</p>
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
