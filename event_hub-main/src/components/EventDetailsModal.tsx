import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Tag, 
  DollarSign,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { Event } from '../types';
import { cn, formatDate, formatCurrency } from '../utils';
import ReviewSection from './ReviewSection';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
  userId: string;
  userName: string;
  userRole: string;
}

export default function EventDetailsModal({ 
  event, 
  onClose, 
  onRegister, 
  isRegistered, 
  userId, 
  userName,
  userRole
}: EventDetailsModalProps) {
  const isFull = event.attendees >= event.capacity;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] relative">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="lg:w-1/2 relative h-64 lg:h-auto">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-600 mb-4 inline-block">
              {event.category}
            </span>
            <h2 className="text-3xl font-bold leading-tight mb-2">{event.title}</h2>
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={16} />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col overflow-hidden">
          <div className="p-8 lg:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">About this Event</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {event.description}
              </p>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <MapPin size={16} className="text-indigo-500" />
                  {event.location}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <DollarSign size={16} className="text-indigo-500" />
                  {event.price === 0 ? 'FREE' : formatCurrency(event.price)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <Users size={16} className="text-indigo-500" />
                  {event.capacity - event.attendees} spots left
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    event.status === 'Published' ? "bg-emerald-500" : "bg-orange-500"
                  )} />
                  {event.status}
                </div>
              </div>
            </section>

            {(event.needs_volunteers || event.needs_workers) && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Opportunities</h3>
                <div className="flex flex-wrap gap-3">
                  {event.needs_volunteers && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                      <Users size={14} />
                      VOLUNTEERS NEEDED
                    </div>
                  )}
                  {event.needs_workers && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                      <Briefcase size={14} />
                      WORKERS NEEDED
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className="pt-8 border-t border-gray-100">
              <ReviewSection eventId={event.id} userId={userId} userName={userName} />
            </div>
          </div>

          {userRole === 'User' && (
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <button 
                disabled={isRegistered || isFull}
                onClick={() => onRegister(event.id)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-xl",
                  isRegistered 
                    ? "bg-emerald-100 text-emerald-700 cursor-default shadow-emerald-100" 
                    : isFull 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]"
                )}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 size={20} />
                    You are Registered
                  </>
                ) : isFull ? (
                  'Event is Full'
                ) : (
                  <>
                    {event.price > 0 ? `Pay ${formatCurrency(event.price)} & Register` : 'Register for Free'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
