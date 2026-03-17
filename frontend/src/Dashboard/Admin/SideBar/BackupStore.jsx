import { useState, useEffect } from 'react';
import {
  Database,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Settings,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Printer,
  Archive,
  Cloud,
  Server,
  Shield,
  AlertTriangle,
  Info,
  PlusCircle,
  Play,
  Pause,
  StopCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Globe,
  Mail,
  FileText,
  Users,
  Building2,
  Layers,
  Edit3,
  XCircle as XCircleIcon
} from 'lucide-react';
import { 
  useCreateBackupMutation, 
  useGetBackupsQuery, 
  useGetSchedulesQuery, 
  useGetStorageQuery,
  useRestoreBackupMutation,
  useDeleteBackupMutation,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useToggleScheduleMutation,
  useUpdateBackupSettingsMutation,
  useGetBackupSettingsQuery
} from '../../../features/api/adminApi';

// Helper function to format bytes to human readable
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Helper function to get status color
const getStatusColor = (status) => {
  const colors = {
    'completed': 'bg-green-100 text-green-800',
    'success': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'warning': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const BackupRestorePage = () => {
  // API Hooks
  const [createBackup, { isLoading: isCreatingBackup }] = useCreateBackupMutation();
  const [restoreBackup, { isLoading: isRestoringBackup }] = useRestoreBackupMutation();
  const [deleteBackup, { isLoading: isDeletingBackup }] = useDeleteBackupMutation();
  const [createSchedule, { isLoading: isCreatingSchedule }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdatingSchedule }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: isDeletingSchedule }] = useDeleteScheduleMutation();
  const [toggleSchedule, { isLoading: isTogglingSchedule }] = useToggleScheduleMutation();
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateBackupSettingsMutation();

  // Queries
  const { 
    data: backupsData, 
    isLoading: isLoadingBackups, 
    refetch: refetchBackups 
  } = useGetBackupsQuery();
  
  const { 
    data: schedulesData, 
    isLoading: isLoadingSchedules, 
    refetch: refetchSchedules 
  } = useGetSchedulesQuery();
  
  const { 
    data: storageData, 
    isLoading: isLoadingStorage, 
    refetch: refetchStorage 
  } = useGetStorageQuery();

   const { 
    data: backupSettingData, 
    isLoading: isLoadingbackupSetting, 
    refetch: refetchBackup 
  } = useGetBackupSettingsQuery();

  const BackupSettingData=backupSettingData?.backupSettingData;
  


  // Local state
  const [backups, setBackups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [storage, setStorage] = useState(null);
  const [databaseSizes, setDatabaseSizes] = useState([]);
  
  const [activeTab, setActiveTab] = useState('backups');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedBackup, setExpandedBackup] = useState(null);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [settings, setSettings] = useState({
  defaultLocation: '',
  backupRetention: '',
  maxBackupSize: 100,
  compressionLevel: 'balanced',
  encryption: true,
  verifyIntegrity: true,
  emailNotification: true,
  createRestorePoint: true,
  verifyAfterRestore: true,
  maintainDuringRestore: true,
  rto: '4',
  rpo: '4'
});

useEffect(() => {
  if (BackupSettingData) {
    setSettings({
      defaultLocation: BackupSettingData.defaultBackupLocation || '/backups',
      backupRetention: BackupSettingData.backupRetention || 7,
      maxBackupSize: BackupSettingData.maxBackupSize || 100,
      compressionLevel: BackupSettingData.compressionLevel || 'balanced',
      encryption: BackupSettingData.enableCompression ?? true,
      verifyIntegrity: BackupSettingData.verifyIntegrity ?? true,
      emailNotification: BackupSettingData.enableEmailNotifications ?? true,
      createRestorePoint: BackupSettingData.createRestorePoint ?? true,
      verifyAfterRestore: BackupSettingData.verifyAfterRestore ?? true,
      maintainDuringRestore: BackupSettingData.maintainDuringRestore ?? true,
      rto: BackupSettingData.rto || '4',
      rpo: BackupSettingData.rpo || '4'
    });
  }
}, [BackupSettingData]);
  // Update local state when API data changes
  useEffect(() => {
    if (backupsData?.data) {
      setBackups(backupsData.data);
    }
  }, [backupsData]);

  useEffect(() => {
    if (schedulesData?.data) {
      setSchedules(schedulesData.data);
    }
  }, [schedulesData]);

  useEffect(() => {
    if (storageData) {
      setStorage(storageData.storage);
      setDatabaseSizes(storageData.databases || []);
      if (storageData.settings) {
        setSettings(prev => ({ ...prev, ...storageData.settings }));
      }
    }
  }, [storageData]);

  // Filter backups
  const filteredBackups = backups.filter(backup => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        backup.name?.toLowerCase().includes(searchLower) ||
        backup.id?.toLowerCase().includes(searchLower) ||
        backup.createdBy?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    if (selectedType !== 'all' && backup.type !== selectedType) return false;
    if (selectedStatus !== 'all' && backup.status !== selectedStatus) return false;
    return true;
  });

  // Handle manual backup
  const handleManualBackup = async () => {
    try {
      setBackupProgress(0);
      
      // Simulate progress (you can remove this if your API provides progress)
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await createBackup({
        type: 'manual',
        name: `Manual Backup ${new Date().toLocaleDateString()}`
      }).unwrap();

      console.log(response);

      clearInterval(progressInterval);
      setBackupProgress(100);
      
      setTimeout(() => {
        setShowBackupModal(false);
        setBackupProgress(0);
        showToastMessage('Backup completed successfully!');
        refetchBackups();
        refetchStorage();
      }, 1000);
      
    } catch (error) {
      console.log(error);
      showToastMessage(error?.data?.message || 'Backup failed', 'error');
      setShowBackupModal(false);
      setBackupProgress(0);
    }
  };

  // Handle restore
  const handleRestore = async () => {
    try {
      setRestoreProgress(0);
      
      const progressInterval = setInterval(() => {
        setRestoreProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      await restoreBackup(selectedBackup.id).unwrap();

      clearInterval(progressInterval);
      setRestoreProgress(100);
      
      setTimeout(() => {
        setShowRestoreModal(false);
        setRestoreProgress(0);
        showToastMessage('System restored successfully!');
      }, 1000);
      
    } catch (error) {
      showToastMessage(error?.data?.message || 'Restore failed', 'error');
      setShowRestoreModal(false);
      setRestoreProgress(0);
    }
  };

  // Handle delete backup
  const handleDeleteBackup = async (backupId) => {
    try {
      await deleteBackup(backupId).unwrap();
      setShowDeleteConfirm(false);
      showToastMessage('Backup deleted successfully');
      refetchBackups();
      refetchStorage();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to delete backup', 'error');
    }
  };

  // Handle create schedule
  const handleCreateSchedule = async () => {
    try {
      await createSchedule(scheduleForm).unwrap();
      setShowScheduleModal(false);
      resetScheduleForm();
      showToastMessage('Backup schedule created successfully');
      refetchSchedules();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to create schedule', 'error');
    }
  };

  // Handle update schedule
  const handleUpdateSchedule = async () => {
    try {
      await updateSchedule({
        id: selectedSchedule.id,
        ...scheduleForm
      }).unwrap();
      setShowScheduleModal(false);
      resetScheduleForm();
      showToastMessage('Schedule updated successfully');
      refetchSchedules();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to update schedule', 'error');
    }
  };

  // Handle toggle schedule
  const handleToggleSchedule = async (scheduleId, currentStatus) => {
    try {
      await toggleSchedule({
        id: scheduleId,
        status: currentStatus === 'active' ? 'inactive' : 'active'
      }).unwrap();
      showToastMessage('Schedule status updated');
      refetchSchedules();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to update schedule', 'error');
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId).unwrap();
      showToastMessage('Schedule deleted successfully');
      refetchSchedules();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to delete schedule', 'error');
    }
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      await updateSettings(settings).unwrap();
      showToastMessage('Settings saved successfully');
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to save settings', 'error');
    }
  };

  // Show toast message
  const showToastMessage = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    type: 'full',
    frequency: 'daily',
    time: '02:00',
    day: 'sunday',
    databases: [],
    retention: '30',
    compression: true,
    encryption: true,
    notification: true,
    status: 'active'
  });

  // Reset schedule form
  const resetScheduleForm = () => {
    setScheduleForm({
      name: '',
      type: 'full',
      frequency: 'daily',
      time: '02:00',
      day: 'sunday',
      databases: [],
      retention: '30',
      compression: true,
      encryption: true,
      notification: true,
      status: 'active'
    });
    setSelectedSchedule(null);
  };

  // Open edit schedule modal
  const openEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleForm({
      name: schedule.name,
      type: schedule.type,
      frequency: schedule.frequency,
      time: schedule.time,
      day: schedule.day || 'sunday',
      databases: schedule.databases,
      retention: schedule.retention.replace(' days', ''),
      compression: schedule.compression,
      encryption: schedule.encryption,
      notification: schedule.notification,
      status: schedule.status
    });
    setShowScheduleModal(true);
  };

  const isLoading = isLoadingBackups || isLoadingSchedules || isLoadingStorage;

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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-sm text-gray-600 mt-1">Manage system backups and disaster recovery</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBackupModal(true)}
            disabled={isCreatingBackup}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Database className="w-4 h-4 mr-2" />
            {isCreatingBackup ? 'Backing up...' : 'Backup Now'}
          </button>
          <button
            onClick={() => {
              resetScheduleForm();
              setShowScheduleModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Schedule Backup
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('backups')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'backups'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Archive className="w-4 h-4 inline mr-2" />
            Backup History
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'schedules'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Backup Schedules
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'storage'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HardDrive className="w-4 h-4 inline mr-2" />
            Storage
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Backup History Tab */}
      {activeTab === 'backups' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search backups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="auto">Automatic</option>
                <option value="manual">Manual</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
                <option value="in_progress">In Progress</option>
              </select>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Backup List */}
          <div className="space-y-4">
            {isLoadingBackups ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading backups...</p>
              </div>
            ) : filteredBackups.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No backups found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or create a new backup</p>
                <button
                  onClick={() => setShowBackupModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </button>
              </div>
            ) : (
              filteredBackups.map(backup => (
                <div key={backup.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedBackup(expandedBackup === backup.id ? null : backup.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          backup.status === 'success' || backup.status === 'completed' ? 'bg-green-100' :
                          backup.status === 'failed' ? 'bg-red-100' :
                          backup.status === 'in_progress' ? 'bg-blue-100' :
                          'bg-yellow-100'
                        }`}>
                          <Database className={`w-5 h-5 ${
                            backup.status === 'success' || backup.status === 'completed' ? 'text-green-600' :
                            backup.status === 'failed' ? 'text-red-600' :
                            backup.status === 'in_progress' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">{backup.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {backup.type === 'auto' ? 'Automatic' : 'Manual'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                              {backup.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">ID: {backup.id}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center">
                              <HardDrive className="w-3 h-3 mr-1" />
                              {formatBytes(backup.size)}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {backup.duration}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(backup.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        {expandedBackup === backup.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedBackup === backup.id && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-900">{backup.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Files Backed Up</p>
                          <p className="text-sm font-medium text-gray-900">{backup.files?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compression</p>
                          <p className="text-sm font-medium text-gray-900">{backup.compression || 'gzip'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Encryption</p>
                          <p className="text-sm font-medium text-gray-900">{backup.encryption || 'AES-256'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Retention</p>
                          <p className="text-sm font-medium text-gray-900">{backup.retention || '30 days'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created By</p>
                          <p className="text-sm font-medium text-gray-900">
                            {backup.createdByName || backup.createdBy}
                          </p>
                        </div>
                        {backup.reason && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Reason</p>
                            <p className="text-sm text-gray-700">{backup.reason}</p>
                          </div>
                        )}
                        {backup.warning && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Warning</p>
                            <p className="text-sm text-yellow-600">{backup.warning}</p>
                          </div>
                        )}
                        {backup.error && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Error</p>
                            <p className="text-sm text-red-600">{backup.error}</p>
                          </div>
                        )}
                      </div>

                      {/* Databases */}
                      {backup.databases && backup.databases.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">Databases Included</p>
                          <div className="flex flex-wrap gap-2">
                            {backup.databases.map(db => (
                              <span key={db} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                {db}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Checksum */}
                      {backup.checksum && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Checksum (SHA-256)</p>
                          <p className="text-xs font-mono text-gray-700 break-all">{backup.checksum}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowRestoreModal(true);
                          }}
                          disabled={isRestoringBackup}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <RefreshCw className="w-4 h-4 inline mr-1" />
                          Restore
                        </button>
                        <button 
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                          onClick={() => {
                            // Handle download
                          }}
                        >
                          <Download className="w-4 h-4 inline mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowDeleteConfirm(true);
                          }}
                          disabled={isDeletingBackup}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          {isLoadingSchedules ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
              <p className="text-gray-500 mb-6">Create a backup schedule to automate backups</p>
              <button
                onClick={() => {
                  resetScheduleForm();
                  setShowScheduleModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Schedule
              </button>
            </div>
          ) : (
            schedules.map(schedule => (
              <div key={schedule.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${schedule.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Clock className={`w-5 h-5 ${schedule.status === 'active' ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{schedule.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          schedule.type === 'full' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {schedule.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(schedule.status)}`}>
                          {schedule.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Frequency</p>
                          <p className="text-sm font-medium text-gray-900">
                            {schedule.frequency === 'daily' ? 'Daily' : 
                             schedule.frequency === 'weekly' ? `Weekly on ${schedule.day}` :
                             `Monthly on day ${schedule.day}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium text-gray-900">{schedule.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Retention</p>
                          <p className="text-sm font-medium text-gray-900">{schedule.retention}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Run</p>
                          <p className="text-sm text-gray-900">{formatDate(schedule.lastRun)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Run</p>
                          <p className="text-sm text-gray-900">{formatDate(schedule.nextRun)}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Databases</p>
                        <div className="flex flex-wrap gap-2">
                          {schedule.databases.map(db => (
                            <span key={db} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {db}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleSchedule(schedule.id, schedule.status)}
                      disabled={isTogglingSchedule}
                      className={`p-2 rounded-lg transition-colors ${
                        schedule.status === 'active' 
                          ? 'bg-yellow-100 hover:bg-yellow-200' 
                          : 'bg-green-100 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {schedule.status === 'active' ? (
                        <Pause className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Play className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                    <button 
                      onClick={() => openEditSchedule(schedule)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      disabled={isDeletingSchedule}
                      className="p-2 hover:bg-red-100 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Storage Tab */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          {isLoadingStorage ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading storage data...</p>
            </div>
          ) : storage ? (
            <>
              {/* Storage Overview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Total Storage</p>
                    <p className="text-2xl font-bold text-gray-900">{formatBytes(storage.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Used</p>
                    <p className="text-2xl font-bold text-blue-600">{formatBytes(storage.used)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Free</p>
                    <p className="text-2xl font-bold text-green-600">{formatBytes(storage.free)}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium">{storage.usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        storage.usagePercentage > 90 ? 'bg-red-600' :
                        storage.usagePercentage > 70 ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${storage.usagePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Backups</span>
                      <span className="text-sm font-medium text-gray-900">{formatBytes(storage.backups)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Databases</span>
                      <span className="text-sm font-medium text-gray-900">{formatBytes(storage.databases)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uploaded Files</span>
                      <span className="text-sm font-medium text-gray-900">{formatBytes(storage.files)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">System Logs</span>
                      <span className="text-sm font-medium text-gray-900">{formatBytes(storage.logs)}</span>
                    </div>
                  </div>
                </div>

                {/* Database Sizes */}
                {databaseSizes.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Sizes</h2>
                    <div className="space-y-3">
                      {databaseSizes.map(db => (
                        <div key={db.name} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-900 capitalize">{db.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({db.count?.toLocaleString() || 0} records)</span>
                          </div>
                          <span className="text-sm text-gray-600">{formatBytes(db.size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cleanup Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Cleanup</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Old Backups</p>
                      <p className="text-xs text-gray-500">Backups older than 90 days</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                      Clean Up
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">System Logs</p>
                      <p className="text-xs text-gray-500">Logs older than 30 days</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                      Clean Up
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <HardDrive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No storage data available</h3>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Backup Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Default Backup Location
                  </label>
                  <input
                    type="text"
                    value={settings.defaultLocation}
                    onChange={(e) => setSettings({...settings, defaultLocation: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Backup Retention (days)
                  </label>
                  <input
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) => setSettings({...settings, backupRetention: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Backup Size (GB)
                  </label>
                  <input
                    type="number"
                    value={settings.maxBackupSize}
                    onChange={(e) => setSettings({...settings, maxBackupSize: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Compression Level
                  </label>
                  <select 
                    value={settings.compressionLevel}
                    onChange={(e) => setSettings({...settings, compressionLevel: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fast">Fast (gzip level 1)</option>
                    <option value="balanced">Balanced (gzip level 6)</option>
                    <option value="maximum">Maximum (gzip level 9)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.encryption}
                    onChange={(e) => setSettings({...settings, encryption: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Enable encryption (AES-256)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.verifyIntegrity}
                    onChange={(e) => setSettings({...settings, verifyIntegrity: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Verify backup integrity after creation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotification}
                    onChange={(e) => setSettings({...settings, emailNotification: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Send email notification on backup completion</span>
                </label>
              </div>
            </div>
          </div>

          {/* Restore Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Restore Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.createRestorePoint}
                    onChange={(e) => setSettings({...settings, createRestorePoint: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Create restore point before restore</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.verifyAfterRestore}
                    onChange={(e) => setSettings({...settings, verifyAfterRestore: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Verify database consistency after restore</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={settings.maintainDuringRestore}
                    onChange={(e) => setSettings({...settings, maintainDuringRestore: e.target.checked})}
                    className="rounded text-blue-600" 
                  />
                  <span className="text-sm text-gray-700">Maintain application during restore</span>
                </label>
              </div>
            </div>
          </div>

          {/* Disaster Recovery */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Disaster Recovery</h2>
            <p className="text-sm text-gray-600 mb-4">
              Configure automatic failover and recovery options
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Recovery Time Objective (RTO)
                </label>
                <select 
                  value={settings.rto}
                  onChange={(e) => setSettings({...settings, rto: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 hour</option>
                  <option value="4">4 hours</option>
                  <option value="8">8 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Recovery Point Objective (RPO)
                </label>
                <select 
                  value={settings.rpo}
                  onChange={(e) => setSettings({...settings, rpo: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 hour</option>
                  <option value="4">4 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isUpdatingSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isUpdatingSettings ? (
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
      )}

      {/* Manual Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Start Manual Backup</h2>
            </div>

            <div className="p-6 space-y-4">
              {isCreatingBackup || backupProgress > 0 ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div
                        className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                        style={{ animationDuration: '1s' }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Creating Backup...</p>
                  <p className="text-sm text-gray-500 mb-4">Please don't close this window</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${backupProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{backupProgress}% Complete</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800">
                          This will create a full backup of the entire system including:
                        </p>
                        <ul className="text-xs text-blue-700 mt-2 list-disc list-inside">
                          <li>All user data and profiles</li>
                          <li>All applications and documents</li>
                          <li>Office hierarchy and configurations</li>
                          <li>System settings and logs</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800 flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      Estimated time: 1-2 minutes. System performance may be affected during backup.
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowBackupModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleManualBackup}
                      disabled={isCreatingBackup}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Start Backup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Restore from Backup</h2>
            </div>

            <div className="p-6 space-y-4">
              {isRestoringBackup || restoreProgress > 0 ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                      <div
                        className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"
                        style={{ animationDuration: '1s' }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Restoring System...</p>
                  <p className="text-sm text-gray-500 mb-4">Please don't close this window</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${restoreProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{restoreProgress}% Complete</p>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 mb-2">
                          Warning: This action will overwrite current data
                        </p>
                        <p className="text-xs text-yellow-700">
                          Restoring from backup will replace all current system data with the backup from {formatDate(selectedBackup.timestamp)}.
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">Backup Details:</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">ID: {selectedBackup.id}</p>
                      <p className="text-xs text-gray-600">Date: {formatDate(selectedBackup.timestamp)}</p>
                      <p className="text-xs text-gray-600">Size: {formatBytes(selectedBackup.size)}</p>
                      {selectedBackup.databases && (
                        <p className="text-xs text-gray-600">Databases: {selectedBackup.databases.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowRestoreModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRestore}
                      disabled={isRestoringBackup}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Confirm Restore
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedSchedule ? 'Edit Backup Schedule' : 'Create Backup Schedule'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure automated backups</p>
              </div>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  resetScheduleForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircleIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm({...scheduleForm, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Daily Full Backup"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Backup Type
                  </label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({...scheduleForm, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full">Full Backup</option>
                    <option value="incremental">Incremental Backup</option>
                    <option value="differential">Differential Backup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={scheduleForm.frequency}
                    onChange={(e) => setScheduleForm({...scheduleForm, frequency: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {scheduleForm.frequency === 'weekly' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Day of Week
                    </label>
                    <select
                      value={scheduleForm.day}
                      onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                )}

                {scheduleForm.frequency === 'monthly' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Day of Month
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={scheduleForm.day}
                      onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Retention (days)
                  </label>
                  <input
                    type="number"
                    value={scheduleForm.retention}
                    onChange={(e) => setScheduleForm({...scheduleForm, retention: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Databases to Backup
                </label>
                <div className="space-y-2">
                  {['users', 'applications', 'documents', 'offices', 'logs'].map(db => (
                    <label key={db} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={scheduleForm.databases.includes(db)}
                        onChange={(e) => {
                          const newDatabases = e.target.checked
                            ? [...scheduleForm.databases, db]
                            : scheduleForm.databases.filter(d => d !== db);
                          setScheduleForm({...scheduleForm, databases: newDatabases});
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{db}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={scheduleForm.compression}
                    onChange={(e) => setScheduleForm({...scheduleForm, compression: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable compression</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={scheduleForm.encryption}
                    onChange={(e) => setScheduleForm({...scheduleForm, encryption: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable encryption (AES-256)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={scheduleForm.notification}
                    onChange={(e) => setScheduleForm({...scheduleForm, notification: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Send email notification</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetScheduleForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
                  disabled={isCreatingSchedule || isUpdatingSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreatingSchedule || isUpdatingSchedule ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                      {selectedSchedule ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    selectedSchedule ? 'Update Schedule' : 'Create Schedule'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Backup?</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete backup {selectedBackup.id}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBackup(selectedBackup.id)}
                  disabled={isDeletingBackup}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeletingBackup ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupRestorePage;