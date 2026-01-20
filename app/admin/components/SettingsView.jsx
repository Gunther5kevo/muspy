import { Settings, Bell, Shield, Database, Mail, Palette } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Admin Settings
        </h2>
        <p style={{ color: '#6B7280' }}>Configure platform settings and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Platform Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>Platform Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Maintenance Mode</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Temporarily disable the platform</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>New Provider Registration</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Allow new providers to sign up</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>Notification Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Email Notifications</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Receive admin alerts via email</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Dispute Alerts</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Notify on new disputes</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>Security Settings</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors text-left"
                    style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
              Change Admin Password
            </button>
            <button className="w-full px-4 py-3 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors text-left"
                    style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-3 rounded-lg border-2 font-medium hover:bg-red-50 transition-colors text-left border-red-300 text-red-600">
              View Login History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}