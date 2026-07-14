import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  MoreVertical,
  Plus,
  DollarSign,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Event } from '../types';
import { cn, formatDate, formatCurrency } from '../utils';

interface EventListProps {
  events: Event[];
  onAddEvent: () => void;
  onSelectEvent: (event: Event) => void;
  onViewDetails: (event: Event) => void;
  onRegister: (eventId: string) => void;
  userRole: string;
  registeredEventIds: string[];
}

export default function EventList({ events, onAddEvent, onSelectEvent, onViewDetails, onRegister, userRole, registeredEventIds }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Published' | 'Draft' | 'Completed' | 'Pending'>('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || e.status === filter;
    const matchesPrice = priceFilter === 'All' || (priceFilter === 'Free' ? e.price === 0 : e.price > 0);
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesPrice && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500">Discover and manage incredible events.</p>
        </div>
        {(userRole === 'Admin' || userRole === 'Organizer') && (
          <button 
            onClick={onAddEvent}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            Create Event
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search events by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {(['All', 'Free', 'Paid'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    priceFilter === p ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isRegistered = registeredEventIds.includes(event.id);
          const isFull = event.attendees >= event.capacity;

          return (
            <div 
              key={event.id} 
              onClick={() => onViewDetails(event)}
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm",
                    event.status === 'Published' ? "bg-emerald-500/90 text-white" :
                    event.status === 'Draft' ? "bg-gray-500/90 text-white" :
                    "bg-orange-500/90 text-white"
                  )}>
                    {event.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-indigo-600 shadow-lg">
                    {event.category}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Price</p>
                    <p className="text-lg font-bold text-white">
                      {event.price === 0 ? 'FREE' : formatCurrency(event.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {event.title}
                  </h3>
                  {(userRole === 'Admin' || (userRole === 'Organizer' && event.organizer_id === 'u2')) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                  )}
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                  {event.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <CalendarIcon size={14} className="text-indigo-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MapPin size={14} className="text-indigo-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Users size={14} className="text-indigo-500" />
                      <span>{event.attendees} / {event.capacity}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          isFull ? "bg-red-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${Math.min((event.attendees / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {userRole === 'User' && (
                    <button 
                      disabled={isRegistered || isFull}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegister(event.id);
                      }}
                      className={cn(
                        "w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        isRegistered 
                          ? "bg-emerald-50 text-emerald-600 cursor-default" 
                          : isFull 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.98]"
                      )}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 size={18} />
                          Registered
                        </>
                      ) : isFull ? (
                        'Sold Out'
                      ) : (
                        event.price > 0 ? `Pay ${formatCurrency(event.price)} & Register` : 'Register for Free'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No events found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
