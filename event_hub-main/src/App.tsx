import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import EventApprovals from './components/EventApprovals';
import Profile from './components/Profile';
import MyTickets from './components/MyTickets';
import CalendarView from './components/CalendarView';
import EventDetailsModal from './components/EventDetailsModal';
import TicketModal from './components/TicketModal';
import { Event, User, UserRole, Registration } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('User');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [viewingEvent, setViewingEvent] = useState<Event | undefined>(undefined);
  const [newlyRegisteredTicket, setNewlyRegisteredTicket] = useState<Registration | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('userRole') as UserRole || 'User');
      setUserName(localStorage.getItem('userName') || 'User');
      setUserId(localStorage.getItem('userId') || '');
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserRegistrations();
    }
  }, [isAuthenticated, userId]);

  const fetchData = async () => {
    try {
      const [eventsRes, usersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/users')
      ]);
      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();
      setEvents(eventsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch(`/api/registrations/${userId}`);
      const data: Registration[] = await res.json();
      setRegisteredEventIds(data.map(r => r.event_id));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleLogin = async (email: string, role: UserRole) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const user = await res.json();
        setIsAuthenticated(true);
        setUserRole(user.role);
        setUserName(user.name);
        setUserId(user.id);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', email);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    window.location.reload();
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      const method = selectedEvent ? 'PATCH' : 'POST';
      const url = selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, organizer_id: userId })
      });
      if (res.ok) {
        fetchData();
        setIsFormOpen(false);
        setSelectedEvent(undefined);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.price > 0) {
      const confirmPayment = window.confirm(`This event costs ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(event.price)}. Proceed to payment?`);
      if (!confirmPayment) return;
      
      // Simulate payment delay
      const btn = document.activeElement as HTMLButtonElement;
      if (btn) btn.disabled = true;
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Payment successful! Processing registration...');
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, user_id: userId })
      });
      if (res.ok) {
        const regData = await res.json();
        await fetchUserRegistrations();
        fetchData();
        
        // Find the full registration object to show the ticket
        const fullRegRes = await fetch(`/api/registrations/${userId}`);
        const allRegs: Registration[] = await fullRegRes.json();
        const currentReg = allRegs.find(r => r.id === regData.id);
        
        if (currentReg) {
          setViewingEvent(undefined);
          setNewlyRegisteredTicket(currentReg);
        } else {
          alert('Registration successful! Check "My Tickets" for your QR code.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    // Simplified for demo
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleApproveEvent = async (eventId: string) => {
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Published' })
    });
    fetchData();
  };

  const handleRejectEvent = async (eventId: string) => {
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    fetchData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard events={events} />;
      case 'events':
        return (
          <EventList 
            events={userRole === 'Organizer' ? events.filter(e => e.organizer_id === userId) : events} 
            onAddEvent={() => {
              setSelectedEvent(undefined);
              setIsFormOpen(true);
            }} 
            onSelectEvent={(event) => {
              if (userRole === 'Admin' || (userRole === 'Organizer' && event.organizer_id === userId)) {
                setSelectedEvent(event);
                setIsFormOpen(true);
              }
            }}
            onViewDetails={(event) => setViewingEvent(event)}
            onRegister={handleRegister}
            userRole={userRole}
            registeredEventIds={registeredEventIds}
          />
        );
      case 'tickets':
        return <MyTickets userId={userId} />;
      case 'calendar':
        return <CalendarView events={events} onViewDetails={(event) => setViewingEvent(event)} />;
      case 'approvals':
        return <EventApprovals events={events} onApprove={handleApproveEvent} onReject={handleRejectEvent} />;
      case 'users':
        return <UserManagement users={users} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />;
      case 'profile':
        return <Profile user={{ name: userName, email: localStorage.getItem('userEmail') || '', role: userRole }} />;
      case 'reports':
        return (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">System Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-indigo-50 rounded-2xl">
                <p className="text-sm text-indigo-600 font-bold uppercase mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(events.reduce((acc, e) => acc + (e.revenue || 0), 0))}
                </p>
                <div className="mt-4 h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-3/4"></div>
                </div>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl">
                <p className="text-sm text-emerald-600 font-bold uppercase mb-2">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{events.reduce((acc, e) => acc + (e.attendees || 0), 0)}</p>
                <div className="mt-4 h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-4/5"></div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
              Download Full PDF Report
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts for new registrations</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="text-red-600 font-medium hover:underline"
                >
                  Reset All System Data
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard events={events} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      userRole={userRole}
      userName={userName}
    >
      {renderContent()}
      {isFormOpen && (
        <EventForm 
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEvent(undefined);
          }} 
          onSave={handleSaveEvent}
          initialData={selectedEvent}
        />
      )}
      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={() => setViewingEvent(undefined)}
          onRegister={handleRegister}
          isRegistered={registeredEventIds.includes(viewingEvent.id)}
          userId={userId}
          userName={userName}
          userRole={userRole}
        />
      )}
      {newlyRegisteredTicket && (
        <TicketModal 
          registration={newlyRegisteredTicket} 
          onClose={() => setNewlyRegisteredTicket(null)} 
        />
      )}
    </Layout>
  );
}
