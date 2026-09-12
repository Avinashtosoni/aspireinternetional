import React, { useEffect, useState } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { 
  Save, Building, CreditCard, Mail, MessageSquare, 
  Eye, EyeOff, ShieldCheck, QrCode, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

type SettingsTab = 'general' | 'payment' | 'smtp' | 'messaging';

export default function ManageSettings() {
  const { settings, fetchSettings, updateSetting } = useCMSStore();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

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

  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage('');
    
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
      setMessage(`Successfully updated ${successCount} setting(s)!`);
      setTimeout(() => setMessage(''), 3500);
    } else {
      setMessage('No changes to save.');
      setTimeout(() => setMessage(''), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System & Integration Settings</h2>
          <p className="text-xs text-gray-500 mt-1">Configure school profile, payment gateways, SMTP email, and WhatsApp/SMS APIs.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md text-sm"
        >
          <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-100 bg-gray-50/70 px-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building size={16} /> School Profile & Leadership
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'payment'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <CreditCard size={16} /> Payment Gateway (Razorpay & UPI)
        </button>

        <button
          onClick={() => setActiveTab('smtp')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'smtp'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Mail size={16} /> Email & SMTP Server
        </button>

        <button
          onClick={() => setActiveTab('messaging')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'messaging'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare size={16} /> WhatsApp & SMS Alerts
        </button>
      </div>

      {/* Message Feedback */}
      {message && (
        <div className="m-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {/* ========================================================================= */}
        {/* TAB 1: General Profile & Leadership */}
        {/* ========================================================================= */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* Contact Info */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Building className="text-indigo-600" size={18} /> Official School Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">School Email Address</label>
                  <input
                    type="email"
                    value={localSettings['school_email'] || ''}
                    onChange={(e) => handleChange('school_email', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">School Phone Number</label>
                  <input
                    type="text"
                    value={localSettings['school_phone'] || ''}
                    onChange={(e) => handleChange('school_phone', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">School Campus Address</label>
                  <input
                    type="text"
                    value={localSettings['school_address'] || ''}
                    onChange={(e) => handleChange('school_address', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Social Media */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={localSettings['facebook_url'] || ''}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={localSettings['instagram_url'] || ''}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Twitter / X URL</label>
                  <input
                    type="url"
                    value={localSettings['twitter_url'] || ''}
                    onChange={(e) => handleChange('twitter_url', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Leadership Details */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">Principal & Leadership</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Principal's Full Name</label>
                  <input
                    type="text"
                    value={localSettings['principal_name'] || ''}
                    onChange={(e) => handleChange('principal_name', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Principal's Photo URL</label>
                  <input
                    type="url"
                    value={localSettings['principal_image_url'] || ''}
                    onChange={(e) => handleChange('principal_image_url', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Principal's Official Welcome Message</label>
                  <textarea
                    rows={3}
                    value={localSettings['principal_message'] || ''}
                    onChange={(e) => handleChange('principal_message', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Payment Gateway (Razorpay & UPI) */}
        {/* ========================================================================= */}
        {activeTab === 'payment' && (
          <div className="space-y-8">
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="text-indigo-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-indigo-900 leading-relaxed">
                <strong>Centralized Payment Gateway:</strong> Configure your Razorpay credentials and School UPI ID here. Any form configured with "Application Fee" will automatically use these settings for collecting online payments.
              </div>
            </div>

            {/* Razorpay Setup */}
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-indigo-600" size={18} /> Razorpay Gateway (Cards, UPI, Netbanking)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <select
                    value={localSettings['razorpay_enabled'] || 'true'}
                    onChange={(e) => handleChange('razorpay_enabled', e.target.value)}
                    className="text-xs font-bold p-1.5 border rounded-lg bg-white"
                  >
                    <option value="true">Enabled (Active)</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Razorpay Key ID *</label>
                  <input
                    type="text"
                    placeholder="rzp_test_..."
                    value={localSettings['razorpay_key_id'] || ''}
                    onChange={(e) => handleChange('razorpay_key_id', e.target.value)}
                    className="w-full p-2.5 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Razorpay Key Secret</label>
                  <div className="relative">
                    <input
                      type={showSecrets['razorpay_key_secret'] ? 'text' : 'password'}
                      placeholder="••••••••••••••••••••••••"
                      value={localSettings['razorpay_key_secret'] || ''}
                      onChange={(e) => handleChange('razorpay_key_secret', e.target.value)}
                      className="w-full p-2.5 pr-10 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret('razorpay_key_secret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showSecrets['razorpay_key_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* School UPI QR Code Setup */}
            <section className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <QrCode className="text-indigo-600" size={18} /> Direct School UPI ID & QR Code
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">School UPI ID (VPA)</label>
                    <input
                      type="text"
                      placeholder="aspireuniversal@upi"
                      value={localSettings['school_upi_id'] || ''}
                      onChange={(e) => handleChange('school_upi_id', e.target.value)}
                      className="w-full p-2.5 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">Parents can pay directly to this VPA on GPay/PhonePe/Paytm.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">UPI QR Code Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={localSettings['school_upi_qr_url'] || ''}
                      onChange={(e) => handleChange('school_upi_qr_url', e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-4">
                  <img
                    src={localSettings['school_upi_qr_url'] || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=aspireuniversal@upi'}
                    alt="School UPI QR Preview"
                    className="w-24 h-24 rounded-xl border p-1 bg-white object-contain shrink-0 shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">QR Code Preview</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      This QR code will be displayed to parents choosing the "UPI QR Transfer" option during admission submission.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: Email & SMTP Configuration */}
        {/* ========================================================================= */}
        {activeTab === 'smtp' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3">
              <Mail className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>Automated Email Receipts:</strong> Configure your school's official SMTP server (Gmail, Google Workspace, Outlook, or Amazon SES) to send automated confirmation emails and PDF receipts directly to parents.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">SMTP Host</label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={localSettings['smtp_host'] || ''}
                  onChange={(e) => handleChange('smtp_host', e.target.value)}
                  className="w-full p-2.5 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">SMTP Port</label>
                <input
                  type="text"
                  placeholder="587 (TLS) or 465 (SSL)"
                  value={localSettings['smtp_port'] || '587'}
                  onChange={(e) => handleChange('smtp_port', e.target.value)}
                  className="w-full p-2.5 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">SMTP Username / Email</label>
                <input
                  type="email"
                  placeholder="info@aspireuniversalinternational.com"
                  value={localSettings['smtp_user'] || ''}
                  onChange={(e) => handleChange('smtp_user', e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">SMTP Password / App Password</label>
                <div className="relative">
                  <input
                    type={showSecrets['smtp_password'] ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={localSettings['smtp_password'] || ''}
                    onChange={(e) => handleChange('smtp_password', e.target.value)}
                    className="w-full p-2.5 pr-10 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowSecret('smtp_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showSecrets['smtp_password'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Sender Name (From Name)</label>
                <input
                  type="text"
                  placeholder="Aspire Universal International School"
                  value={localSettings['smtp_from_name'] || ''}
                  onChange={(e) => handleChange('smtp_from_name', e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Sender Email (From Email)</label>
                <input
                  type="email"
                  placeholder="admissions@aspireuniversalinternational.com"
                  value={localSettings['smtp_from_email'] || ''}
                  onChange={(e) => handleChange('smtp_from_email', e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WhatsApp & SMS Gateways */}
        {/* ========================================================================= */}
        {activeTab === 'messaging' && (
          <div className="space-y-8">
            {/* WhatsApp API */}
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="text-emerald-600" size={18} /> WhatsApp Business API Integration
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <select
                    value={localSettings['whatsapp_enabled'] || 'true'}
                    onChange={(e) => handleChange('whatsapp_enabled', e.target.value)}
                    className="text-xs font-bold p-1.5 border rounded-lg bg-white"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp Provider</label>
                  <select
                    value={localSettings['whatsapp_provider'] || 'Meta Cloud API'}
                    onChange={(e) => handleChange('whatsapp_provider', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Meta Cloud API">Meta Cloud API (Official)</option>
                    <option value="Twilio">Twilio WhatsApp</option>
                    <option value="Gupshup">Gupshup Enterprise</option>
                    <option value="Interakt">Interakt / Wati</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Official School WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+91 9431867366"
                    value={localSettings['whatsapp_phone'] || ''}
                    onChange={(e) => handleChange('whatsapp_phone', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp API Access Token</label>
                  <div className="relative">
                    <input
                      type={showSecrets['whatsapp_api_token'] ? 'text' : 'password'}
                      placeholder="EAA..."
                      value={localSettings['whatsapp_api_token'] || ''}
                      onChange={(e) => handleChange('whatsapp_api_token', e.target.value)}
                      className="w-full p-2.5 pr-10 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret('whatsapp_api_token')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showSecrets['whatsapp_api_token'] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SMS Gateway */}
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="text-indigo-600" size={18} /> SMS Gateway (DLT / OTP Alerts)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status:</span>
                  <select
                    value={localSettings['sms_enabled'] || 'true'}
                    onChange={(e) => handleChange('sms_enabled', e.target.value)}
                    className="text-xs font-bold p-1.5 border rounded-lg bg-white"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">SMS Provider</label>
                  <select
                    value={localSettings['sms_provider'] || 'Fast2SMS'}
                    onChange={(e) => handleChange('sms_provider', e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Fast2SMS">Fast2SMS</option>
                    <option value="MSG91">MSG91</option>
                    <option value="Textlocal">Textlocal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Sender ID (DLT Header)</label>
                  <input
                    type="text"
                    placeholder="ASPIRE"
                    value={localSettings['sms_sender_id'] || ''}
                    onChange={(e) => handleChange('sms_sender_id', e.target.value)}
                    className="w-full p-2.5 uppercase font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">API Key / Auth Token</label>
                  <div className="relative">
                    <input
                      type={showSecrets['sms_api_key'] ? 'text' : 'password'}
                      placeholder="••••••••••••••••"
                      value={localSettings['sms_api_key'] || ''}
                      onChange={(e) => handleChange('sms_api_key', e.target.value)}
                      className="w-full p-2.5 pr-10 font-mono border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret('sms_api_key')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showSecrets['sms_api_key'] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
