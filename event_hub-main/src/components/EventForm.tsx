import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  Calendar as CalendarIcon, 
  MapPin, 
  Type, 
  Users, 
  Tag,
  Image as ImageIcon,
  Briefcase
} from 'lucide-react';
import { Event } from '../types';
import { generateEventDescription } from '../services/geminiService';
import { cn } from '../utils';

interface EventFormProps {
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  initialData?: Event;
}

export default function EventForm({ onClose, onSave, initialData }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<Event>>(initialData || {
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Conference',
    status: 'Draft',
    capacity: 100,
    attendees: 0,
    revenue: 0,
    image: 'https://picsum.photos/seed/event/800/400',
    needs_volunteers: initialData?.needs_volunteers || false,
    needs_workers: initialData?.needs_workers || false,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.location) {
      alert('Please enter a title and location first.');
      return;
    }
    setIsGenerating(true);
    const description = await generateEventDescription(
      formData.title, 
      formData.category || 'Event', 
      formData.location
    );
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Type size={16} className="text-indigo-500" />
                  Event Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Tech Conference"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-500" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarIcon size={16} className="text-indigo-500" />
                  Date & Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" />
                  Location
                </label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-xs font-medium text-indigo-600 flex items-center gap-1.5 hover:text-indigo-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  AI Generate
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about the event..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" />
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-500" />
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0 for Free"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon size={16} className="text-indigo-500" />
                Image URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-amber-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900">Volunteers</p>
                    <p className="text-[10px] text-amber-700">Need help for free?</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.needs_volunteers}
                  onChange={e => setFormData({ ...formData, needs_volunteers: e.target.checked })}
                  className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-rose-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-900">Workers</p>
                    <p className="text-[10px] text-rose-700">Paid staff needed?</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.needs_workers}
                  onChange={e => setFormData({ ...formData, needs_workers: e.target.checked })}
                  className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
