import { useState } from 'react';
import {
  Activity,
  Server,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Info,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  Users,
  Zap,
  HardDrive,
  Globe,
  Mail,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  FileText,
  Settings,
  Upload,
  Download as DownloadIcon,
  Copy,
  Printer,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

// Mock System Logs Data
const mockSystemLogs = [
  // Login Logs
  {
    id: 1,
    type: 'login',
    category: 'authentication',
    severity: 'info',
    user: 'admin@eseva.gov.in',
    userName: 'System Admin',
    action: 'Successful login',
    description: 'User logged in successfully from IP 192.168.1.100',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/120.0.0.0',
    timestamp: '2026-02-23T09:15:00Z',
    status: 'success',
    sessionId: 'sess_abc123',
    location: 'Lucknow, India'
  },
  {
    id: 2,
    type: 'login',
    category: 'authentication',
    severity: 'warning',
    user: 'unknown@example.com',
    userName: null,
    action: 'Failed login attempt',
    description: 'Invalid password for user gramsevak@example.com',
    ip: '192.168.1.150',
    userAgent: 'Mozilla/5.0 (iPhone) Safari/604.1',
    timestamp: '2026-02-23T09:10:00Z',
    status: 'failed',
    failureReason: 'Invalid password',
    attemptCount: 3
  },
  {
    id: 3,
    type: 'login',
    category: 'authentication',
    severity: 'critical',
    user: null,
    userName: null,
    action: 'Multiple failed attempts',
    description: '5 failed login attempts detected from IP 45.123.45.67',
    ip: '45.123.45.67',
    userAgent: 'Python/Requests',
    timestamp: '2026-02-23T08:45:00Z',
    status: 'blocked',
    failureReason: 'Brute force attempt',
    attemptCount: 5,
    actionTaken: 'IP blocked temporarily'
  },

  // API Logs
  {
    id: 4,
    type: 'api',
    category: 'performance',
    severity: 'error',
    user: 'system',
    userName: null,
    action: 'API rate limit exceeded',
    description: 'API /api/applications exceeded rate limit of 100 requests/minute',
    ip: '192.168.1.200',
    endpoint: '/api/applications',
    method: 'GET',
    statusCode: 429,
    responseTime: 245,
    timestamp: '2026-02-23T08:30:00Z',
    status: 'error'
  },
  {
    id: 5,
    type: 'api',
    category: 'performance',
    severity: 'warning',
    user: 'system',
    userName: null,
    action: 'Slow API response',
    description: 'API /api/documents responded in 2.5 seconds (threshold: 1s)',
    ip: '192.168.1.175',
    endpoint: '/api/documents',
    method: 'POST',
    statusCode: 200,
    responseTime: 2450,
    timestamp: '2026-02-23T08:15:00Z',
    status: 'warning'
  },

  // Database Logs
  {
    id: 6,
    type: 'database',
    category: 'system',
    severity: 'error',
    user: 'system',
    userName: null,
    action: 'Database connection timeout',
    description: 'Connection to MongoDB failed after 30 seconds',
    database: 'MongoDB',
    operation: 'connect',
    errorCode: 'ETIMEDOUT',
    timestamp: '2026-02-23T08:45:00Z',
    status: 'error',
    recovery: 'Auto-reconnected after 5 seconds'
  },
  {
    id: 7,
    type: 'database',
    category: 'system',
    severity: 'info',
    user: 'system',
    userName: null,
    action: 'Database backup completed',
    description: 'Automated backup of all collections completed successfully',
    database: 'MongoDB',
    operation: 'backup',
    size: '2.4 GB',
    duration: '45 seconds',
    timestamp: '2026-02-23T03:00:00Z',
    status: 'success'
  },

  // Server Logs
  {
    id: 8,
    type: 'server',
    category: 'system',
    severity: 'critical',
    user: 'system',
    userName: null,
    action: 'Server CPU spike',
    description: 'CPU usage reached 98% for 5 minutes',
    server: 'app-server-01',
    metric: 'cpu',
    value: '98%',
    threshold: '80%',
    timestamp: '2026-02-23T07:30:00Z',
    status: 'critical',
    actionTaken: 'Auto-scaling triggered'
  },
  {
    id: 9,
    type: 'server',
    category: 'system',
    severity: 'warning',
    user: 'system',
    userName: null,
    action: 'Disk space low',
    description: '/var partition is at 85% capacity',
    server: 'db-server-01',
    metric: 'disk',
    value: '85%',
    threshold: '80%',
    timestamp: '2026-02-23T06:15:00Z',
    status: 'warning'
  },

  // Application Logs
  {
    id: 10,
    type: 'application',
    category: 'business',
    severity: 'info',
    user: 'rajesh.k@example.com',
    userName: 'Rajesh Kumar',
    action: 'Application submitted',
    description: 'New income certificate application submitted (ID: eSEVA/2026/IN/00123)',
    applicationId: 'eSEVA/2026/IN/00123',
    certificateType: 'INCOME',
    timestamp: '2026-02-23T10:30:00Z',
    status: 'success'
  },
  {
    id: 11,
    type: 'application',
    category: 'business',
    severity: 'warning',
    user: 'priya.tehsil@eseva.gov.in',
    userName: 'Priya Singh',
    action: 'Application correction requested',
    description: 'Correction requested for residence certificate (ID: eSEVA/2026/RES/00189)',
    applicationId: 'eSEVA/2026/RES/00189',
    certificateType: 'RESIDENCE',
    reason: 'Address proof not clear',
    timestamp: '2026-02-23T09:45:00Z',
    status: 'warning'
  },

  // Security Logs
  {
    id: 12,
    type: 'security',
    category: 'authentication',
    severity: 'critical',
    user: 'system',
    userName: null,
    action: 'Suspicious activity detected',
    description: 'Multiple access attempts to admin endpoints from unauthorized IP',
    ip: '103.45.67.89',
    endpoint: '/api/admin/*',
    attemptCount: 15,
    timestamp: '2026-02-23T08:20:00Z',
    status: 'blocked',
    actionTaken: 'IP added to blacklist'
  },
  {
    id: 13,
    type: 'security',
    category: 'authorization',
    severity: 'warning',
    user: 'amit.district@eseva.gov.in',
    userName: 'Amit Sharma',
    action: 'Unauthorized access attempt',
    description: 'Attempted to access GRAM level application with DISTRICT privileges',
    ip: '192.168.1.185',
    resource: '/api/applications/GRAM001',
    timestamp: '2026-02-23T07:50:00Z',
    status: 'denied'
  },

  // Email/SMS Logs
  {
    id: 14,
    type: 'email',
    category: 'communication',
    severity: 'info',
    user: 'system',
    userName: null,
    action: 'Email sent',
    description: 'Application approval email sent to rajesh.k@example.com',
    recipient: 'rajesh.k@example.com',
    template: 'approval-template',
    timestamp: '2026-02-23T11:15:00Z',
    status: 'success'
  },
  {
    id: 15,
    type: 'sms',
    category: 'communication',
    severity: 'error',
    user: 'system',
    userName: null,
    action: 'SMS failed',
    description: 'Failed to send OTP to mobile 9876543210',
    recipient: '9876543210',
    provider: 'MSG91',
    error: 'Invalid mobile number',
    timestamp: '2026-02-23T10:45:00Z',
    status: 'failed'
  },

  // User Activity Logs
  {
    id: 16,
    type: 'user',
    category: 'activity',
    severity: 'info',
    user: 'admin@eseva.gov.in',
    userName: 'System Admin',
    action: 'User created',
    description: 'Created new user: Ramesh Kumar (GRAM_SEVAK)',
    targetUser: 'ramesh.gram@eseva.gov.in',
    role: 'GRAM_SEVAK',
    timestamp: '2026-02-23T10:00:00Z',
    status: 'success'
  },
  {
    id: 17,
    type: 'user',
    category: 'activity',
    severity: 'info',
    user: 'admin@eseva.gov.in',
    userName: 'System Admin',
    action: 'Password reset',
    description: 'Reset password for user: Priya Singh',
    targetUser: 'priya.tehsil@eseva.gov.in',
    timestamp: '2026-02-23T09:30:00Z',
    status: 'success'
  },

  // Backup Logs
  {
    id: 18,
    type: 'backup',
    category: 'system',
    severity: 'success',
    user: 'system',
    userName: null,
    action: 'Manual backup',
    description: 'Manual backup of entire system completed',
    size: '2.8 GB',
    duration: '3 minutes',
    location: '/backups/manual/2026-02-23',
    timestamp: '2026-02-23T02:00:00Z',
    status: 'success'
  },

  // Error Logs
  {
    id: 19,
    type: 'error',
    category: 'system',
    severity: 'critical',
    user: 'system',
    userName: null,
    action: 'Unhandled exception',
    description: 'NullReferenceException in ApplicationService.Process()',
    stackTrace: 'at ApplicationService.Process(String id) line 45',
    component: 'ApplicationService',
    timestamp: '2026-02-23T01:30:00Z',
    status: 'error'
  }
];

// Log types for filtering
const logTypes = [
  { value: 'all', label: 'All Logs', icon: Activity },
  { value: 'login', label: 'Login Logs', icon: LogIn },
  { value: 'api', label: 'API Logs', icon: Zap },
  { value: 'database', label: 'Database Logs', icon: Database },
  { value: 'server', label: 'Server Logs', icon: Server },
  { value: 'application', label: 'Application Logs', icon: FileText },
  { value: 'security', label: 'Security Logs', icon: Shield },
  { value: 'email', label: 'Email Logs', icon: Mail },
  { value: 'user', label: 'User Activity', icon: Users },
  { value: 'backup', label: 'Backup Logs', icon: HardDrive },
  { value: 'error', label: 'Error Logs', icon: AlertCircle }
];

// Severity levels
const severityLevels = [
  { value: 'all', label: 'All Severities' },
  { value: 'info', label: 'Info', color: 'text-blue-600 bg-blue-100' },
  { value: 'warning', label: 'Warning', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'error', label: 'Error', color: 'text-orange-600 bg-orange-100' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100' },
  { value: 'success', label: 'Success', color: 'text-green-600 bg-green-100' }
];

// Status colors
const getStatusColor = (status) => {
  const colors = {
    'success': 'text-green-600 bg-green-100',
    'failed': 'text-red-600 bg-red-100',
    'error': 'text-red-600 bg-red-100',
    'warning': 'text-yellow-600 bg-yellow-100',
    'critical': 'text-red-600 bg-red-100',
    'blocked': 'text-red-600 bg-red-100',
    'denied': 'text-red-600 bg-red-100',
    'info': 'text-blue-600 bg-blue-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const SystemLogs = () => {
  const [logs, setLogs] = useState(mockSystemLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [logStats, setLogStats] = useState({
    total: mockSystemLogs.length,
    errors: mockSystemLogs.filter(l => ['error', 'critical'].includes(l.severity)).length,
    warnings: mockSystemLogs.filter(l => l.severity === 'warning').length,
    logins: mockSystemLogs.filter(l => l.type === 'login').length,
    failedLogins: mockSystemLogs.filter(l => l.type === 'login' && l.status === 'failed').length,
    apiCalls: mockSystemLogs.filter(l => l.type === 'api').length
  });

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        log.user?.toLowerCase().includes(searchLower) ||
        log.userName?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.description?.toLowerCase().includes(searchLower) ||
        log.ip?.includes(searchLower) ||
        log.applicationId?.includes(searchLower);
      if (!matches) return false;
    }
    
    // Type filter
    if (selectedType !== 'all' && log.type !== selectedType) return false;
    
    // Severity filter
    if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) return false;
    
    // Date filter
    if (dateRange !== 'all') {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      switch(dateRange) {
        case 'today':
          if (logDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'yesterday':
          if (logDate.toDateString() !== yesterday.toDateString()) return false;
          break;
        case 'week':
          if (logDate < weekAgo) return false;
          break;
      }
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  };

  // Get log icon
  const getLogIcon = (type) => {
    switch(type) {
      case 'login': return LogIn;
      case 'api': return Zap;
      case 'database': return Database;
      case 'server': return Server;
      case 'application': return FileText;
      case 'security': return Shield;
      case 'email': return Mail;
      case 'user': return Users;
      case 'backup': return HardDrive;
      case 'error': return AlertCircle;
      default: return Activity;
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setShowSuccess(true);
    setSuccessMessage('Logs refreshed successfully');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle export
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Type,Severity,User,Action,Description,IP,Status\n"
      + filteredLogs.map(log => 
        `${log.timestamp},${log.type},${log.severity},${log.user},${log.action},${log.description},${log.ip},${log.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    setShowSuccess(true);
    setSuccessMessage('Logs exported successfully');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle clear logs
  const handleClearLogs = () => {
    setShowClearConfirm(false);
    setLogs([]);
    setShowSuccess(true);
    setSuccessMessage('Logs cleared successfully');
    setTimeout(() => setShowSuccess(false), 3000);
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
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor system activity and troubleshoot issues</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Logs</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{logStats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Errors</p>
              <p className="text-xl font-bold text-red-600 mt-1">{logStats.errors}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Warnings</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{logStats.warnings}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Logins</p>
              <p className="text-xl font-bold text-green-600 mt-1">{logStats.logins}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <LogIn className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Failed Logins</p>
              <p className="text-xl font-bold text-red-600 mt-1">{logStats.failedLogins}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">API Calls</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{logStats.apiCalls}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, action, IP, application ID..."
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
            {logTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {severityLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="all">All Time</option>
          </select>

          <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Auto-refresh toggle */}
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm text-gray-600">Auto-refresh every 30 seconds</span>
          </label>
          <span className="text-xs text-gray-500">
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => {
            const Icon = getLogIcon(log.type);
            const severityColor = getSeverityColor(log.severity);
            
            return (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Log Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${severityColor} mr-3`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {log.action}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${severityColor}`}>
                            {log.severity}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {log.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        {log.user && log.user !== 'system' && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {log.userName || log.user}
                          </span>
                        )}
                        {log.ip && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {log.ip}
                          </span>
                        )}
                        {log.applicationId && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {log.applicationId}
                          </span>
                        )}
                        {log.endpoint && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Zap className="w-3 h-3 mr-1" />
                            {log.endpoint}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button className="ml-2 p-1 hover:bg-gray-200 rounded">
                      {expandedLog === log.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLog === log.id && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {/* User Info */}
                      {log.user && (
                        <div>
                          <p className="text-xs text-gray-500">User</p>
                          <p className="text-sm font-medium text-gray-900">
                            {log.userName || log.user}
                          </p>
                          {log.userName && (
                            <p className="text-xs text-gray-500">{log.user}</p>
                          )}
                        </div>
                      )}

                      {/* IP Address */}
                      {log.ip && (
                        <div>
                          <p className="text-xs text-gray-500">IP Address</p>
                          <p className="text-sm font-medium text-gray-900">{log.ip}</p>
                          {log.location && (
                            <p className="text-xs text-gray-500">{log.location}</p>
                          )}
                        </div>
                      )}

                      {/* Session/Request Info */}
                      {log.sessionId && (
                        <div>
                          <p className="text-xs text-gray-500">Session ID</p>
                          <p className="text-sm font-medium text-gray-900">{log.sessionId}</p>
                        </div>
                      )}

                      {/* Response Time */}
                      {log.responseTime && (
                        <div>
                          <p className="text-xs text-gray-500">Response Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {log.responseTime}ms
                          </p>
                        </div>
                      )}

                      {/* Status Code */}
                      {log.statusCode && (
                        <div>
                          <p className="text-xs text-gray-500">Status Code</p>
                          <p className="text-sm font-medium text-gray-900">{log.statusCode}</p>
                        </div>
                      )}

                      {/* Method */}
                      {log.method && (
                        <div>
                          <p className="text-xs text-gray-500">Method</p>
                          <p className="text-sm font-medium text-gray-900">{log.method}</p>
                        </div>
                      )}

                      {/* Endpoint */}
                      {log.endpoint && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Endpoint</p>
                          <p className="text-sm font-medium text-gray-900 break-all">{log.endpoint}</p>
                        </div>
                      )}

                      {/* Database Info */}
                      {log.database && (
                        <div>
                          <p className="text-xs text-gray-500">Database</p>
                          <p className="text-sm font-medium text-gray-900">{log.database}</p>
                        </div>
                      )}

                      {/* Operation */}
                      {log.operation && (
                        <div>
                          <p className="text-xs text-gray-500">Operation</p>
                          <p className="text-sm font-medium text-gray-900">{log.operation}</p>
                        </div>
                      )}

                      {/* Server */}
                      {log.server && (
                        <div>
                          <p className="text-xs text-gray-500">Server</p>
                          <p className="text-sm font-medium text-gray-900">{log.server}</p>
                        </div>
                      )}

                      {/* Metric */}
                      {log.metric && (
                        <div>
                          <p className="text-xs text-gray-500">Metric</p>
                          <p className="text-sm font-medium text-gray-900">
                            {log.metric}: {log.value} (Threshold: {log.threshold})
                          </p>
                        </div>
                      )}

                      {/* Failure Reason */}
                      {log.failureReason && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Failure Reason</p>
                          <p className="text-sm text-red-600">{log.failureReason}</p>
                        </div>
                      )}

                      {/* Stack Trace */}
                      {log.stackTrace && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Stack Trace</p>
                          <pre className="mt-1 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-x-auto">
                            {log.stackTrace}
                          </pre>
                        </div>
                      )}

                      {/* Action Taken */}
                      {log.actionTaken && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Action Taken</p>
                          <p className="text-sm text-green-600">{log.actionTaken}</p>
                        </div>
                      )}

                      {/* User Agent */}
                      {log.userAgent && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">User Agent</p>
                          <p className="text-xs text-gray-600 break-all">{log.userAgent}</p>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    {log.additionalInfo && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Additional Information</p>
                        <p className="text-sm text-gray-700">{log.additionalInfo}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetailModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                          setShowSuccess(true);
                          setSuccessMessage('Copied to clipboard');
                          setTimeout(() => setShowSuccess(false), 2000);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedSeverity('all');
                setDateRange('today');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredLogs.length > 0 && (
        <div className="text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
            Load More Logs
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Timestamp</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedLog.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Severity</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              {/* Action & Description */}
              <div>
                <p className="text-xs text-gray-500">Action</p>
                <p className="text-sm font-medium text-gray-900">{selectedLog.action}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{selectedLog.description}</p>
              </div>

              {/* Full Details JSON */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Complete Log Data</p>
                <pre className="p-4 bg-gray-50 rounded-lg text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                    setShowSuccess(true);
                    setSuccessMessage('Copied to clipboard');
                    setTimeout(() => setShowSuccess(false), 2000);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Copy className="w-4 h-4 inline mr-2" />
                  Copy JSON
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Printer className="w-4 h-4 inline mr-2" />
                  Print
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Clear All Logs?</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                This will permanently delete all system logs. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearLogs}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Clear All Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;