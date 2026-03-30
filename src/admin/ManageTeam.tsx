import React, { useEffect, useState } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Trash2, Plus } from 'lucide-react';

export default function ManageTeam() {
  const { team, fetchTeam, addTeamMember, deleteTeamMember } = useCMSStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', image_url: '', display_order: 0 });

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addTeamMember(formData);
    if (success) {
      setIsAdding(false);
      setFormData({ name: '', role: '', bio: '', image_url: '', display_order: 0 });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manage Team</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Name" className="p-2 border rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="Role" className="p-2 border rounded" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
            <input placeholder="Image URL" className="p-2 border rounded" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            <input type="number" placeholder="Display Order" className="p-2 border rounded" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: Number(e.target.value)})} />
            <textarea required placeholder="Bio" className="p-2 border rounded md:col-span-2" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id} className="border-t border-gray-100">
                <td className="p-4 font-medium flex items-center gap-3">
                  <img src={member.image_url || 'https://via.placeholder.com/40'} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                  {member.name}
                </td>
                <td className="p-4 text-gray-600">{member.role}</td>
                <td className="p-4">
                  <button onClick={() => deleteTeamMember(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
