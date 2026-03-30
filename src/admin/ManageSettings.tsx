import React, { useEffect, useState } from 'react';
import { useCMSStore, Setting } from '../store/cmsStore';
import { Save } from 'lucide-react';

export default function ManageSettings() {
  const { settings, fetchSettings, updateSetting } = useCMSStore();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage('');
    
    // Save all keys that have been modified
    let successCount = 0;
    const keys = Object.keys(localSettings);
    
    for (const key of keys) {
      if (localSettings[key] !== settings[key]) {
        const ok = await updateSetting(key, localSettings[key]);
        if (ok) successCount++;
      }
    }
    
    setSaving(false);
    if (successCount > 0) {
      setMessage(`Successfully updated ${successCount} settings!`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('No changes needed to save.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const contactFields = [
    { key: 'school_email', label: 'School Email Address', type: 'email' },
    { key: 'school_phone', label: 'School Phone Number', type: 'text' },
    { key: 'school_address', label: 'School Full Address', type: 'text' },
  ];

  const socialFields = [
    { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'twitter_url', label: 'Twitter/X URL', type: 'url' }
  ];

  const welcomeFields = [
    { key: 'welcome_title', label: 'Welcome Section Title', type: 'text' },
    { key: 'director_name', label: 'Director Name', type: 'text' },
    { key: 'director_image_url', label: 'Director Image URL', type: 'text' },
    { key: 'welcome_message_1', label: 'Welcome Message (Paragraph 1)', type: 'textarea' },
    { key: 'welcome_message_2', label: 'Welcome Message (Paragraph 2)', type: 'textarea' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100-200px)]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
        <h2 className="text-xl font-bold text-gray-800">School Settings & Content</h2>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="p-8 space-y-12">
        {message && (
          <div className="p-4 rounded-lg bg-green-50 text-green-700 font-medium border border-green-100">
            {message}
          </div>
        )}

        {/* Contact Info */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactFields.map(field => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                <input 
                  type={field.type}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50/50"
                  value={localSettings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialFields.map(field => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                <input 
                  type={field.type}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50/50"
                  value={localSettings[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Welcome Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
            Home: Welcome & Director Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {welcomeFields.slice(0, 3).map(field => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                  <input 
                    type={field.type}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50/50"
                    value={localSettings[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {welcomeFields.slice(3).map(field => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                  <textarea 
                    rows={5}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50/50 resize-none"
                    value={localSettings[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-4">
          <div className="bg-yellow-400 text-white p-2 rounded-lg">
            <Save size={20} />
          </div>
          <div>
            <h4 className="font-bold text-yellow-800">Update Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">Changes made here will instantly reflect on the public website. Ensure the information and image URLs are valid before saving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
