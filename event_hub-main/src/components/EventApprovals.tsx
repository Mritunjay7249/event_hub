import React from 'react';
import { CheckCircle, XCircle, Eye, Calendar, MapPin, User } from 'lucide-react';
import { Event } from '../types';
import { cn, formatDate } from '../utils';

interface EventApprovalsProps {
  events: Event[];
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
}

export default function EventApprovals({ events, onApprove, onReject }: EventApprovalsProps) {
  const pendingEvents = events.filter(e => e.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Approvals</h1>
        <p className="text-gray-500">Review and approve new event submissions from organizers.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingEvents.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-full md:w-32 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
              <img src={event.image} alt="" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase">
                  {event.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-400" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-400" />
                  {event.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-indigo-400" />
                  Organizer ID: {event.organizer_id}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-1">{event.description}</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button 
                onClick={() => onApprove(event.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button 
                onClick={() => onReject(event.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        ))}

        {pendingEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-gray-500">There are no pending events to review at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
