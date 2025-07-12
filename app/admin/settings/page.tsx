'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Database,
  Key,
  Mail,
  Shield,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Settings {
  general: {
    siteName: string;
    siteUrl: string;
    contactEmail: string;
    timezone: string;
    language: string;
  };
  analytics: {
    googleAnalyticsId: string;
    vercelAnalyticsEnabled: boolean;
    trackingEnabled: boolean;
  };
  email: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  integrations: {
    googleMapsApiKey: string;
    censusApiKey: string;
    perplexityApiKey: string;
    coreAgentsApiKey: string;
  };
  security: {
    adminPassword: string;
    sessionTimeout: number;
    requireHttps: boolean;
    enableRateLimit: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    leadNotifications: boolean;
    systemNotifications: boolean;
    dailyReports: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Houston Development Intelligence',
      siteUrl: 'https://houston-development-intelligence.vercel.app',
      contactEmail: 'contact@houstonlandguy.com',
      timezone: 'America/Chicago',
      language: 'en'
    },
    analytics: {
      googleAnalyticsId: 'G-XXXXXXXXXX',
      vercelAnalyticsEnabled: true,
      trackingEnabled: true
    },
    email: {
      provider: 'resend',
      apiKey: '••••••••••••••••',
      fromEmail: 'noreply@houstonlandguy.com',
      fromName: 'Houston Land Group'
    },
    integrations: {
      googleMapsApiKey: '••••••••••••••••',
      censusApiKey: '••••••••••••••••',
      perplexityApiKey: '••••••••••••••••',
      coreAgentsApiKey: '••••••••••••••••'
    },
    security: {
      adminPassword: '••••••••',
      sessionTimeout: 60,
      requireHttps: true,
      enableRateLimit: true
    },
    notifications: {
      emailNotifications: true,
      leadNotifications: true,
      systemNotifications: true,
      dailyReports: true
    }
  });

  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'analytics', name: 'Analytics', icon: Globe },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'integrations', name: 'Integrations', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const handleSettingChange = (category: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // In production, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testConnection = async (service: string) => {
    toast.loading(`Testing ${service} connection...`);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss();
    toast.success(`${service} connection successful!`);
  };

  const exportSettings = () => {
    const exportData = JSON.stringify(settings, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'houston-dev-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex gap-2">
            <button
              onClick={exportSettings}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasChanges && !isSaving
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="America/Chicago">Central Time (Chicago)</option>
                      <option value="America/New_York">Eastern Time (New York)</option>
                      <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                      <option value="America/Denver">Mountain Time (Denver)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Settings */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Analytics & Tracking</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics Measurement ID
                    </label>
                    <input
                      type="text"
                      value={settings.analytics.googleAnalyticsId}
                      onChange={(e) => handleSettingChange('analytics', 'googleAnalyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Find this in your Google Analytics property settings
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Vercel Analytics</h4>
                      <p className="text-sm text-gray-500">Enable Vercel Web Vitals tracking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analytics.vercelAnalyticsEnabled}
                        onChange={(e) => handleSettingChange('analytics', 'vercelAnalyticsEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">User Tracking</h4>
                      <p className="text-sm text-gray-500">Track user interactions and conversions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analytics.trackingEnabled}
                        onChange={(e) => handleSettingChange('analytics', 'trackingEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Email Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Provider
                    </label>
                    <select
                      value={settings.email.provider}
                      onChange={(e) => handleSettingChange('email', 'provider', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="resend">Resend</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="smtp">SMTP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.emailApiKey ? 'text' : 'password'}
                        value={settings.email.apiKey}
                        onChange={(e) => handleSettingChange('email', 'apiKey', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('emailApiKey')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.emailApiKey ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => testConnection('Email')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Test Email Connection
                  </button>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">API Integrations</h2>
                <div className="space-y-6">
                  {Object.entries(settings.integrations).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[key] ? 'text' : 'password'}
                          value={value}
                          onChange={(e) => handleSettingChange('integrations', key, e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(key)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords[key] ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.adminPassword ? 'text' : 'password'}
                        value={settings.security.adminPassword}
                        onChange={(e) => handleSettingChange('security', 'adminPassword', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('adminPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.adminPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="480"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Require HTTPS</h4>
                      <p className="text-sm text-gray-500">Force secure connections</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requireHttps}
                        onChange={(e) => handleSettingChange('security', 'requireHttps', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Rate Limiting</h4>
                      <p className="text-sm text-gray-500">Prevent API abuse</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.enableRateLimit}
                        onChange={(e) => handleSettingChange('security', 'enableRateLimit', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive email notifications for important events'}
                          {key === 'leadNotifications' && 'Get notified when new leads are captured'}
                          {key === 'systemNotifications' && 'System status and error notifications'}
                          {key === 'dailyReports' && 'Daily summary reports via email'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}