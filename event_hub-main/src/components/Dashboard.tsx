import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Event } from '../types';
import { formatCurrency, cn } from '../utils';

interface DashboardProps {
  events: Event[];
}

export default function Dashboard({ events }: DashboardProps) {
  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'bg-blue-500', trend: '+12%', isUp: true },
    { label: 'Total Attendees', value: events.reduce((acc, e) => acc + e.attendees, 0), icon: Users, color: 'bg-purple-500', trend: '+5.4%', isUp: true },
    { label: 'Total Revenue', value: formatCurrency(events.reduce((acc, e) => acc + e.revenue, 0)), icon: DollarSign, color: 'bg-emerald-500', trend: '+18.2%', isUp: true },
    { label: 'Active Events', value: events.filter(e => e.status === 'Published').length, icon: TrendingUp, color: 'bg-orange-500', trend: '-2%', isUp: false },
  ];

  const chartData = events.map(e => ({
    name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
    attendees: e.attendees,
    revenue: e.revenue / 1000,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl text-white", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Attendance by Event</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendees" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Revenue Growth (k$)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Events List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Events</h3>
          <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Attendees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.slice(0, 5).map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-900">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {event.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      event.status === 'Published' ? "bg-green-50 text-green-700" :
                      event.status === 'Draft' ? "bg-gray-100 text-gray-700" :
                      "bg-blue-50 text-blue-700"
                    )}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {event.attendees} / {event.capacity}
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


