import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, X, Download, Share2 } from 'lucide-react';
import { Registration } from '../types';
import { formatDate, formatCurrency } from '../utils';

interface TicketModalProps {
  registration: Registration;
  onClose: () => void;
}

export default function TicketModal({ registration, onClose }: TicketModalProps) {
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(registration.title || '')}&dates=${new Date(registration.date || '').toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(registration.date || '').toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=EventHub+Pro+Ticket&location=${encodeURIComponent(registration.location || '')}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="h-40 bg-indigo-600 relative">
          <img 
            src={registration.image} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute bottom-6 left-8 right-8">
            <h2 className="text-2xl font-bold text-white leading-tight">{registration.title}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Calendar size={14} className="text-indigo-500" />
                {formatDate(registration.date || '')}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <MapPin size={14} className="text-indigo-500" />
                {registration.location}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <QRCodeSVG 
              value={registration.qr_code_data} 
              size={180}
              level="H"
              includeMargin={true}
              className="mb-4"
            />
            <p className="text-xs font-mono text-gray-500 tracking-widest">{registration.qr_code_data}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket Price</p>
              <p className="text-lg font-bold text-indigo-600">
                {registration.price === 0 ? 'FREE' : formatCurrency(registration.price || 0)}
              </p>
            </div>
            <div className="flex gap-2">
              <a 
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"
                title="Add to Google Calendar"
              >
                <Calendar size={20} />
              </a>
              <button className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-4 text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Scan at entrance for check-in</p>
        </div>
      </div>
    </div>
  );
}
