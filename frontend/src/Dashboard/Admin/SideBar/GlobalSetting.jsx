import { useState } from 'react';
import {
  Settings,
  Globe,
  Lock,
  FileText,
  Mail,
  MessageSquare,
  Clock,
  Users,
  Languages,
  Palette,
  Zap,
  Database,
  Bell,
  Wrench,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  XCircle,
  Info,
  Shield,
  HardDrive,
  Calendar,
  Phone,
  Mail as MailIcon,
  Smartphone,
  Image,
  File,
  Download,
  Upload as UploadIcon,
  Server,
  Cloud,
  Moon,
  Sun,
  Monitor,
  HelpCircle
} from 'lucide-react';
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from '../../../features/api/adminApi';

// Mock current settings
const mockSettings = {
  // System Settings
  systemName: 'eSeva Portal',
  systemUrl: 'https://eseva.gov.in',
  supportEmail: 'support@eseva.gov.in',
  supportPhone: '1800-123-4567',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  
  // Security Settings
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  accountLockDuration: 60,
  enable2FA: false,
  enableCaptcha: true,
  
  // File Upload Settings
  maxFileSize: 5,
  allowedFileTypes: ['PDF', 'JPG', 'PNG', 'JPEG'],
  maxFilesPerApplication: 10,
  enableCompression: true,
  storageLocation: 'local',
  
  // Email Settings
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUsername: 'noreply@eseva.gov.in',
  smtpPassword: '********',
  fromEmail: 'noreply@eseva.gov.in',
  fromName: 'eSeva Portal',
  enableSSL: true,
  
  // SMS Settings
  smsProvider: 'MSG91',
  smsApiKey: '********',
  smsSenderId: 'eSEVAG',
  smsTemplate: 'Your OTP for eSeva is {otp}',
  enableSMS: true,
  
  // SLA Settings
  defaultSLADays: 7,
  enableUrgent: true,
  urgentFeeMultiplier: 2,
  reminderDays: 2,
  escalationDays: 5,
  workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  
  // Registration Settings
  allowPublicRegistration: true,
  emailVerification: 'required',
  mobileVerification: 'required',
  defaultRole: 'CITIZEN',
  autoApproveCitizens: true,
  
  // Localization
  defaultLanguage: 'en',
  enableMultiLanguage: true,
  currency: 'INR',
  numberFormat: 'indian',
  
  // Appearance
  themeColor: 'blue',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  footerText: '© 2026 eSeva Portal. All rights reserved.',
  
  // Performance
  cacheDuration: 15,
  paginationLimit: 20,
  dashboardRefresh: 60,
  enableLogging: true,
  logRetention: 30,
  
  // Backup
  enableAutoBackup: true,
  backupFrequency: 'daily',
  backupTime: '02:00',
  backupRetention: 30,
  backupLocation: 'both',
  
  // Notifications
  enableEmailNotifications: true,
  enableSMSNotifications: true,
  enableInAppNotifications: true,
  notifyStatusChange: true,
  notifyApproval: true,
  notifyRejection: true,
  
  // Maintenance
  maintenanceMode: false,
  maintenanceMessage: 'System is under scheduled maintenance. Please check back later.',
  allowAdminsDuringMaintenance: true
};

const GlobalSetting = () => {

  const { data: settingsData, isLoading: isLoadingSettings } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdatingSettings }] = useUpdateSystemSettingsMutation();

  const [settings, setSettings] = useState(settingsData?.data);
  const [activeSection, setActiveSection] = useState('system');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({});

  // Settings sections with icons and descriptions
  const sections = [
    { id: 'system', name: 'System Settings', icon: Settings, description: 'Basic system configuration' },
    { id: 'security', name: 'Security', icon: Lock, description: 'Password policy and authentication' },
    { id: 'files', name: 'File Upload', icon: FileText, description: 'File size limits and formats' },
    { id: 'email', name: 'Email', icon: Mail, description: 'SMTP and email notifications' },
    { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'SMS gateway configuration' },
    { id: 'sla', name: 'SLA & Processing', icon: Clock, description: 'Service level agreements' },
    { id: 'registration', name: 'Registration', icon: Users, description: 'User signup settings' },
    { id: 'localization', name: 'Localization', icon: Languages, description: 'Language and regional settings' },
   
    { id: 'performance', name: 'Performance', icon: Zap, description: 'Caching and pagination' },
    { id: 'backup', name: 'Backup', icon: Database, description: 'Automated backup settings' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Alert preferences' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, description: 'System downtime control' }
  ];

  

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array inputs (like allowed file types)
  const handleArrayChange = (name, value, checked) => {
    setSettings(prev => {
      const current = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...current, value] };
      } else {
        return { ...prev, [name]: current.filter(item => item !== value) };
      }
    });
  };

  // Handle save settings
 const handleSave = async () => {
  try {
    setIsSaving(true);

    await updateSystemSettings(settings).unwrap();

    setSuccessMessage("Settings saved successfully!");
    setShowSuccess(true);

  } catch (error) {
    console.error(error);
  } finally {
    setIsSaving(false);
    setTimeout(() => setShowSuccess(false), 3000);
  }
};

  // Handle reset to defaults
  const handleReset = () => {
    setSettings(mockSettings);
    setShowResetConfirm(false);
    setSuccessMessage('Settings reset to defaults');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Toggle password visibility
  const togglePassword = (field) => {
    setShowPasswordFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Format section name
  const getSectionIcon = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? <section.icon className="w-5 h-5" /> : <Settings className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-slide-down">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure system-wide preferences and defaults</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Settings Categories</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                    activeSection === section.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <section.icon className={`w-5 h-5 ${
                    activeSection === section.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      activeSection === section.id ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {section.name}
                    </p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                {getSectionIcon(activeSection)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {sections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Form Fields */}
            <div className="p-6">
              {/* System Settings */}
              {activeSection === 'system' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        System Name
                      </label>
                      <input
                        type="text"
                        name="systemName"
                        value={settingsData?.data?.systemName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        System URL
                      </label>
                      <input
                        type="url"
                        name="systemUrl"
                        value={settingsData?.data?.systemUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        name="supportEmail"
                        value={settingsData?.data?.supportEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        name="supportPhone"
                        value={settingsData?.data?.supportPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={settingsData?.data?.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">EST (UTC-5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date Format
                      </label>
                      <select
                        name="dateFormat"
                        value={settingsData?.data?.dateFormat}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Password Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          name="minPasswordLength"
                          value={settingsData?.data?.minPasswordLength}
                          onChange={handleInputChange}
                          min="6"
                          max="20"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="requireUppercase"
                          checked={settingsData?.data?.requireUppercase}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require uppercase letters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="requireNumbers"
                          checked={settingsData?.data?.requireNumbers}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require numbers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="requireSpecialChars"
                          checked={settingsData?.data?.requireSpecialChars}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require special characters (!@#$%)</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Session & Login</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          name="sessionTimeout"
                          value={settingsData?.data?.sessionTimeout}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          name="maxLoginAttempts"
                          value={settingsData?.data?.maxLoginAttempts}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Account Lock Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="accountLockDuration"
                          value={settingsData?.data?.accountLockDuration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="enable2FA"
                          checked={settingsData?.data?.enable2FA}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Enable Two-Factor Authentication for officers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="enableCaptcha"
                          checked={settingsData?.data?.enableCaptcha}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Enable CAPTCHA on login</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* File Upload Settings */}
              {activeSection === 'files' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        name="maxFileSize"
                        value={settingsData?.data?.maxFileSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max Files per Application
                      </label>
                      <input
                        type="number"
                        name="maxFilesPerApplication"
                        value={settingsData?.data?.maxFilesPerApplication}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Allowed File Types
                    </label>
                    <div className="space-y-2">
                      {['PDF', 'JPG', 'PNG', 'JPEG', 'DOC', 'DOCX', 'XLS', 'XLSX'].map(format => (
                        <label key={format} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settingsData?.data?.allowedFileTypes.includes(format)}
                            onChange={(e) => handleArrayChange('allowedFileTypes', format, e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm text-gray-700">.{format.toLowerCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="enableCompression"
                        checked={settingsData?.data?.enableCompression}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Enable automatic image compression</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Storage Location
                    </label>
                    <select
                      name="storageLocation"
                      value={settingsData?.data?.storageLocation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="local">Local Server</option>
                      <option value="aws">AWS S3</option>
                      <option value="azure">Azure Blob</option>
                      <option value="gcp">Google Cloud Storage</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeSection === 'email' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        name="smtpServer"
                        value={settingsData?.data?.smtpServer}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        name="smtpPort"
                        value={settingsData?.data?.smtpPort}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        name="smtpUsername"
                        value={settingsData?.data?.smtpUsername}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMTP Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswordFields.smtpPassword ? 'text' : 'password'}
                          name="smtpPassword"
                          value={settingsData?.data?.smtpPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('smtpPassword')}
                          className="absolute right-2 top-2 text-gray-500"
                        >
                          {showPasswordFields.smtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        From Email
                      </label>
                      <input
                        type="email"
                        name="fromEmail"
                        value={settingsData?.data?.fromEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        From Name
                      </label>
                      <input
                        type="text"
                        name="fromName"
                        value={settingsData?.data?.fromName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enableSSL"
                      checked={settingsData?.data?.enableSSL}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable SSL/TLS</span>
                  </label>
                </div>
              )}

              {/* SMS Settings */}
              {activeSection === 'sms' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMS Provider
                      </label>
                      <select
                        name="smsProvider"
                        value={settingsData?.data?.smsProvider}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MSG91">MSG91</option>
                        <option value="Twilio">Twilio</option>
                        <option value="TextLocal">TextLocal</option>
                        <option value="AWS">AWS SNS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={settingsData?.data?.smsApiKey ? 'text' : 'password'}
                          name="smsApiKey"
                          value={settings.smsApiKey}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('smsApiKey')}
                          className="absolute right-2 top-2 text-gray-500"
                        >
                          {showPasswordFields.smsApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sender ID
                      </label>
                      <input
                        type="text"
                        name="smsSenderId"
                        value={settingsData?.data?.smsSenderId}
                        onChange={handleInputChange}
                        maxLength="6"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SMS Template
                      </label>
                      <input
                        type="text"
                        name="smsTemplate"
                        value={settingsData?.data?.smsTemplate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enableSMS"
                      checked={settingsData?.data?.enableSMS}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable SMS notifications</span>
                  </label>
                </div>
              )}

              {/* SLA Settings */}
              {activeSection === 'sla' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Default SLA (days)
                      </label>
                      <input
                        type="number"
                        name="defaultSLADays"
                        value={settingsData?.data?.defaultSLADays}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reminder Before (days)
                      </label>
                      <input
                        type="number"
                        name="reminderDays"
                        value={settingsData?.data?.reminderDays}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Escalation After (days)
                      </label>
                      <input
                        type="number"
                        name="escalationDays"
                        value={settingsData?.data?.escalationDays}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { id: 'mon', label: 'Monday' },
                        { id: 'tue', label: 'Tuesday' },
                        { id: 'wed', label: 'Wednesday' },
                        { id: 'thu', label: 'Thursday' },
                        { id: 'fri', label: 'Friday' },
                        { id: 'sat', label: 'Saturday' },
                        { id: 'sun', label: 'Sunday' }
                      ].map(day => (
                        <label key={day.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settingsData?.data?.workingDays.includes(day.id)}
                            onChange={(e) => handleArrayChange('workingDays', day.id, e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="enableUrgent"
                        checked={settingsData?.data?.enableUrgent}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Enable urgent processing option</span>
                    </label>
                  </div>

                  {settings.enableUrgent && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Urgent Fee Multiplier
                      </label>
                      <input
                        type="number"
                        name="urgentFeeMultiplier"
                        value={settingsData?.data?.urgentFeeMultiplier}
                        onChange={handleInputChange}
                        step="0.5"
                        min="1"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Registration Settings */}
              {activeSection === 'registration' && (
                <div className="space-y-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="allowPublicRegistration"
                      checked={settingsData?.data?.allowPublicRegistration}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Allow public registration</span>
                  </label>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Verification
                    </label>
                    <select
                      name="emailVerification"
                      value={settingsData?.data?.emailVerification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="required">Required</option>
                      <option value="optional">Optional</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Verification
                    </label>
                    <select
                      name="mobileVerification"
                      value={settingsData?.data?.mobileVerification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="required">Required</option>
                      <option value="optional">Optional</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Default Role for New Users
                    </label>
                    <select
                      name="defaultRole"
                      value={settingsData?.data?.defaultRole}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CITIZEN">Citizen</option>
                     
                    </select>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="autoApproveCitizens"
                      checked={settingsData?.data?.autoApproveCitizens}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Auto-approve citizen registrations</span>
                  </label>
                </div>
              )}

              {/* Localization Settings */}
              {activeSection === 'localization' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Default Language
                      </label>
                      <select
                        name="defaultLanguage"
                        value={settingsData?.data?.defaultLanguage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                       
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={settingsData?.data?.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                     
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Number Format
                      </label>
                      <select
                        name="numberFormat"
                        value={settingsData?.data?.numberFormat}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="indian">Indian (1,00,000)</option>
                        <option value="western">Western (100,000)</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}

             

              {/* Performance Settings */}
              {activeSection === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cache Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="cacheDuration"
                        value={settingsData?.data?.cacheDuration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Pagination Limit
                      </label>
                      <input
                        type="number"
                        name="paginationLimit"
                        value={settingsData?.data?.paginationLimit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Dashboard Refresh (seconds)
                      </label>
                      <input
                        type="number"
                        name="dashboardRefresh"
                        value={settingsData?.data?.dashboardRefresh}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Log Retention (days)
                      </label>
                      <input
                        type="number"
                        name="logRetention"
                        value={settingsData?.data?.logRetention}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enableLogging"
                      checked={settingsData?.data?.enableLogging}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable system logging</span>
                  </label>
                </div>
              )}

              {/* Backup Settings */}
              {activeSection === 'backup' && (
                <div className="space-y-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enableAutoBackup"
                      checked={settingsData?.data?.enableAutoBackup}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable automatic backups</span>
                  </label>

                  {settings.enableAutoBackup && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Backup Frequency
                          </label>
                          <select
                            name="backupFrequency"
                            value={settingsData?.data?.backupFrequency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Backup Time
                          </label>
                          <input
                            type="time"
                            name="backupTime"
                            value={settingsData?.data?.backupTime}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Retention (days)
                          </label>
                          <input
                            type="number"
                            name="backupRetention"
                            value={settingsData?.data?.backupRetention}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Backup Location
                          </label>
                          <select
                            name="backupLocation"
                            value={settingsData?.data?.backupLocation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="local">Local Only</option>
                            <option value="cloud">Cloud Only</option>
                            <option value="both">Both Local and Cloud</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-900">Channel Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="enableEmailNotifications"
                        checked={settingsData?.data?.enableEmailNotifications}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="enableSMSNotifications"
                        checked={settingsData?.data?.enableSMSNotifications}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="enableInAppNotifications"
                        checked={settingsData?.data?.enableInAppNotifications}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">In-app notifications</span>
                    </label>
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 pt-4">Notify On</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="notifyStatusChange"
                        checked={settingsData?.data?.notifyStatusChange}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Application status change</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="notifyApproval"
                        checked={settingsData?.data?.notifyApproval}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Certificate approval</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="notifyRejection"
                        checked={settingsData?.data?.notifyRejection}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Application rejection</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Maintenance Settings */}
              {activeSection === 'maintenance' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Maintenance Mode Warning</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Enabling maintenance mode will make the portal inaccessible to all users except admins.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settingsData?.data?.maintenanceMode}
                      onChange={handleInputChange}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Enable Maintenance Mode</span>
                  </label>

                  {settingsData?.data?.maintenanceMode && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Maintenance Message
                        </label>
                        <textarea
                          name="maintenanceMessage"
                          value={settingsData?.data?.maintenanceMessage}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="allowAdminsDuringMaintenance"
                          checked={settingsData?.data?.allowAdminsDuringMaintenance}
                          onChange={handleInputChange}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Allow admin access during maintenance</span>
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Reset to Defaults?</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                This will reset all settings to their default values. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSetting;