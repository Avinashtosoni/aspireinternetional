import React, { useEffect, useState } from 'react';
import { useCMSStore, TeamMember } from '../store/cmsStore';
import { Trash2, Plus, Pencil, X } from 'lucide-react';

export default function ManageTeam() {
  const { team, fetchTeam, addTeamMember, updateTeamMember, deleteTeamMember } = useCMSStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', image_url: '', display_order: 0 });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) return;
    setIsSavingEdit(true);
    const ok = await updateTeamMember(editingMember.id, {
      name: editingMember.name,
      role: editingMember.role,
      bio: editingMember.bio,
      image_url: editingMember.image_url,
      display_order: editingMember.display_order,
    });
    if (ok) {
      setEditingMember(null);
    }
    setIsSavingEdit(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty/team member?')) {
      await deleteTeamMember(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manage Team</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition cursor-pointer"
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
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-medium flex items-center gap-3">
                  <img src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                  {member.name}
                </td>
                <td className="p-4 text-gray-600">{member.role}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingMember(member)} 
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit Member"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-400">
                  No team members added yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Team Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Team Member</h3>
              <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingMember.image_url || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, image_url: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingMember.display_order || 0}
                  onChange={(e) => setEditingMember({ ...editingMember, display_order: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
                <textarea
                  rows={3}
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-bold text-white transition disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
