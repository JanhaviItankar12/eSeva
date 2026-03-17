import { useState, useEffect } from 'react';
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
  StopCircle,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightPaginate,
  ChevronsRight
} from 'lucide-react';
import { useClearLogsMutation, useGetLogsQuery } from '../../../features/api/adminApi';

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
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // UI states
  const [expandedLog, setExpandedLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [clearLogsMutation] = useClearLogsMutation();


  // Fetch logs from API
  const {
    data: logsData,
    isLoading,
    isFetching,
    refetch
  } = useGetLogsQuery({
    type: selectedType !== 'all' ? selectedType : undefined,
    severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    dateRange: dateRange,
    page: currentPage,
    limit: itemsPerPage
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedSeverity, selectedStatus, dateRange]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refetch();
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Get logs data from API response
  const logs = logsData?.data || [];
  const totalLogs = logsData?.total || 0;
  const totalPages = logsData?.pages || 1;

  // Calculate statistics from logs
  const logStats = {
    total: totalLogs,
    errors: logs.filter(l => ['error', 'critical'].includes(l.severity)).length,
    warnings: logs.filter(l => l.severity === 'warning').length,
    logins: logs.filter(l => l.type === 'login').length,
    failedLogins: logs.filter(l => l.type === 'login' && l.status === 'failed').length,
    apiCalls: logs.filter(l => l.type === 'api').length
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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
    refetch();
    showToastMessage('Logs refreshed successfully');
  };

  // Show toast message
  const showToastMessage = (message) => {
    setShowSuccess(true);
    setSuccessMessage(message);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle export
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Type,Severity,User,Action,Description,IP,Status\n"
      + logs.map(log => 
        `${log.timestamp},${log.type},${log.severity},${log.user},${log.action},${log.description},${log.ip},${log.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    showToastMessage('Logs exported successfully');
  };

  // Handle clear logs (you'll need to implement this mutation)
  const handleClearLogs = async () => {
  try {
    setShowClearConfirm(false);

    await clearLogsMutation({
      type: selectedType,
      severity: selectedSeverity
    }).unwrap();

    showToastMessage('Logs cleared successfully');
    refetch();

  } catch (error) {
    showToastMessage('Failed to clear logs');
  }
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

      {/* Loading Overlay */}
      {(isLoading || isFetching) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 shadow-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Loading logs...</span>
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
            disabled={isFetching}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="blocked">Blocked</option>
            <option value="denied">Denied</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedSeverity('all');
              setSelectedStatus('all');
              setDateRange('all');
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>

        {/* Auto-refresh toggle and results count */}
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
            Showing {logs.length} of {totalLogs} logs
          </span>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading logs...</p>
          </div>
        ) : logs.length > 0 ? (
          logs.map(log => {
            const Icon = getLogIcon(log.type);
            const severityColor = getSeverityColor(log.severity);
            
            return (
              <div
                key={log._id || log.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Log Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedLog(expandedLog === (log._id || log.id) ? null : (log._id || log.id))}
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
                      {expandedLog === (log._id || log.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLog === (log._id || log.id) && (
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
                          showToastMessage('Copied to clipboard');
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
                setSelectedStatus('all');
                setDateRange('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalLogs)}</span> of{' '}
                <span className="font-medium">{totalLogs}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1
                      ? 'cursor-not-allowed'
                      : 'hover:bg-gray-50 focus:outline-none'
                  }`}
                >
                  <span className="sr-only">First</span>
                  <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1
                      ? 'cursor-not-allowed'
                      : 'hover:bg-gray-50 focus:outline-none'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === page
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed'
                      : 'hover:bg-gray-50 focus:outline-none'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightPaginate className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed'
                      : 'hover:bg-gray-50 focus:outline-none'
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedLog._id || selectedLog.id}</p>
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
                    showToastMessage('Copied to clipboard');
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