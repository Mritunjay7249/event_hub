import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Briefcase } from 'lucide-react';
import { Event } from '../types';
import { cn } from '../utils';

interface CalendarViewProps {
  events: Event[];
  onViewDetails: (event: Event) => void;
}

export default function CalendarView({ events, onViewDetails }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Calendar</h1>
          <p className="text-gray-500">Track events and opportunities across the month.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Events
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 bg-amber-50">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Volunteers
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            Workers
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              const hasVolunteers = dayEvents.some(e => e.needs_volunteers);
              const hasWorkers = dayEvents.some(e => e.needs_workers);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "h-24 p-2 rounded-2xl border transition-all flex flex-col items-center justify-between relative group",
                    !isCurrentMonth ? "bg-gray-50/50 border-transparent opacity-40" : "bg-white border-gray-50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50",
                    isSelected && "border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/30"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    isSelected ? "text-indigo-600" : "text-gray-700"
                  )}>
                    {format(day, 'd')}
                  </span>

                  <div className="flex gap-1">
                    {hasEvents && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />}
                    {hasVolunteers && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />}
                    {hasWorkers && <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />}
                  </div>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
              </h3>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                {selectedDayEvents.length} Items
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedDayEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => onViewDetails(event)}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 group hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {event.title}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-50">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-indigo-400" />
                      {format(parseISO(event.date), 'p')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-indigo-400" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {event.needs_volunteers && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold">
                        <Users size={12} />
                        VOLUNTEERS NEEDED
                      </div>
                    )}
                    {event.needs_workers && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold">
                        <Briefcase size={12} />
                        WORKERS NEEDED
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {selectedDayEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">No events scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <h4 className="text-lg font-bold leading-tight">Want to organize an event?</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Create your own event and find volunteers or workers directly through the platform.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
