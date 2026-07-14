import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Trash2, ExternalLink, QrCode } from 'lucide-react';
import { Registration } from '../types';
import { formatDate, formatCurrency, cn } from '../utils';
import TicketModal from './TicketModal';

interface MyTicketsProps {
  userId: string;
}

export default function MyTickets({ userId }: MyTicketsProps) {
  const [tickets, setTickets] = useState<Registration[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/registrations/${userId}`);
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return;
    try {
      await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      setTickets(tickets.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error cancelling registration:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-500">View and manage your event registrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-300">
            <div className="w-full sm:w-40 h-40 sm:h-auto relative overflow-hidden">
              <img src={ticket.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{ticket.title}</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  {ticket.price === 0 ? 'FREE' : formatCurrency(ticket.price || 0)}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} className="text-indigo-400" />
                  {formatDate(ticket.date || '')}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} className="text-indigo-400" />
                  {ticket.location}
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2">
                <button 
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  <QrCode size={16} />
                  View Ticket
                </button>
                <button 
                  onClick={() => handleCancel(ticket.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Cancel Registration"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No tickets found</h3>
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketModal 
          registration={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
}
