import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Users, Building, MessageSquare, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { team, facilities, enquiries, fetchTeam, fetchFacilities, fetchEnquiries } = useCMSStore();

  useEffect(() => {
    fetchTeam();
    fetchFacilities();
    fetchEnquiries();
  }, []);

  const unreadEnquiries = enquiries.filter(e => e.status === 'unread').length;

  const statCards = [
    { label: 'Total Enquiries', value: enquiries.length, icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Unread Enquiries', value: unreadEnquiries, icon: MessageSquare, color: 'bg-red-500' },
    { label: 'Team Members', value: team.length, icon: Users, color: 'bg-indigo-500' },
    { label: 'Facilities', value: facilities.length, icon: Building, color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`${stat.color} p-4 rounded-lg text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Enquiries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Source</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.slice(0, 5).map((enq) => (
                <tr key={enq.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">{new Date(enq.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      enq.message.includes('[Subject:') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {enq.message.includes('[Subject:') ? 'Contact' : 'Admission'}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{enq.name}</td>
                  <td className="p-4 text-sm text-gray-600">{enq.phone}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs">{enq.message.replace(/\[Subject:.*?\] /, '').slice(0, 50)}...</td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      enq.status === 'unread' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No enquiries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
