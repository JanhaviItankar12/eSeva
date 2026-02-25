import { useState } from 'react';
import {
  Download,
  FileText,
  Users,
  Building2,
  FileCheck,
  Database,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Save,
  Copy,
  Printer,
  Mail,
  Archive,
  HardDrive,
  Globe,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  PlusCircle,
  Upload,
  Download as DownloadIcon,
  FileSpreadsheet,
  FileJson,
 
  
  FileCode,
  Layers,
  MapPin,
  Home,
  Briefcase,
  Award,
  CreditCard,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';

// Mock export history data
const mockExportHistory = [
  {
    id: "EXP001",
    name: "Citizen Data Export",
    type: "citizens",
    format: "CSV",
    size: "15.2 MB",
    records: 1050,
    filters: { status: "active", district: "all" },
    status: "completed",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T10:30:00Z",
    completedAt: "2026-02-23T10:31:15Z",
    fileUrl: "/exports/citizens_20260223.csv",
    checksum: "sha256:7d8f9e2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e"
  },
  {
    id: "EXP002",
    name: "Application Data Export",
    type: "applications",
    format: "Excel",
    size: "28.5 MB",
    records: 4560,
    filters: { status: "approved", dateFrom: "2026-01-01", dateTo: "2026-02-23" },
    status: "completed",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T09:15:00Z",
    completedAt: "2026-02-23T09:17:30Z",
    fileUrl: "/exports/applications_20260223.xlsx",
    checksum: "sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
  },
  {
    id: "EXP003",
    name: "Office Hierarchy Export",
    type: "offices",
    format: "JSON",
    size: "3.8 MB",
    records: 1342,
    filters: { level: "all", status: "active" },
    status: "completed",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T08:45:00Z",
    completedAt: "2026-02-23T08:46:00Z",
    fileUrl: "/exports/offices_20260223.json",
    checksum: "sha256:9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c"
  },
  {
    id: "EXP004",
    name: "Document Configuration Export",
    type: "documents",
    format: "JSON",
    size: "1.2 MB",
    records: 5,
    filters: { active: true },
    status: "completed",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T08:00:00Z",
    completedAt: "2026-02-23T08:00:45Z",
    fileUrl: "/exports/documents_20260223.json",
    checksum: "sha256:8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c"
  },
  {
    id: "EXP005",
    name: "System Logs Export",
    type: "logs",
    format: "CSV",
    size: "45.6 MB",
    records: 25000,
    filters: { dateFrom: "2026-02-01", dateTo: "2026-02-23", severity: "all" },
    status: "processing",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T11:00:00Z",
    progress: 65,
    fileUrl: null,
    checksum: null
  },
  {
    id: "EXP006",
    name: "Analytics Data Export",
    type: "analytics",
    format: "Excel",
    size: null,
    records: null,
    filters: { metrics: ["applications", "processing_time"], dateRange: "last_30_days" },
    status: "pending",
    createdBy: "admin@eseva.gov.in",
    createdAt: "2026-02-23T11:30:00Z",
    progress: 0,
    fileUrl: null,
    checksum: null
  }
];

// Export types
const exportTypes = [
  {
    id: "citizens",
    name: "Citizen Data",
    icon: Users,
    description: "Export citizen profiles and personal information",
    fields: ["Name", "Email", "Mobile", "Address", "Role", "Status", "Created Date"],
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "officers",
    name: "Officer Data",
    icon: Briefcase,
    description: "Export government officer details",
    fields: ["Name", "Email", "Role", "Office", "Employee ID", "Status", "Last Login"],
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "applications",
    name: "Applications",
    icon: FileCheck,
    description: "Export certificate applications",
    fields: ["Application ID", "Citizen", "Type", "Status", "Applied Date", "Current Office", "Documents"],
    color: "bg-green-100 text-green-600"
  },
  {
    id: "offices",
    name: "Office Hierarchy",
    icon: Building2,
    description: "Export district, tehsil and gram panchayat data",
    fields: ["Office Name", "Type", "Parent Office", "Status", "Created Date", "Total Officers"],
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "documents",
    name: "Document Config",
    icon: FileText,
    description: "Export certificate type configurations",
    fields: ["Certificate Type", "Required Docs", "Processing Level", "SLA Days", "Fee", "Status"],
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "logs",
    name: "System Logs",
    icon: Database,
    description: "Export system activity and error logs",
    fields: ["Timestamp", "Type", "User", "Action", "IP", "Status", "Details"],
    color: "bg-red-100 text-red-600"
  },
  {
    id: "analytics",
    name: "Analytics Data",
    icon: BarChart3,
    description: "Export performance metrics and statistics",
    fields: ["Metric", "Value", "Period", "Comparison", "Trend"],
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    id: "backups",
    name: "Backup Metadata",
    icon: Archive,
    description: "Export backup history and configuration",
    fields: ["Backup ID", "Type", "Size", "Date", "Status", "Location"],
    color: "bg-gray-100 text-gray-600"
  }
];

// Export formats
const exportFormats = [
  { id: "csv", name: "CSV", icon: FileSpreadsheet, description: "Comma Separated Values - Good for Excel" },
  { id: "excel", name: "Excel", icon: FileSpreadsheet, description: "Microsoft Excel format with multiple sheets" },
  { id: "json", name: "JSON", icon: FileJson, description: "JSON format for developers" },
  { id: "pdf", name: "PDF", icon: FileSpreadsheet, description: "PDF document for reports" }
];

// Filter options
const filterOptions = {
  status: ["active", "inactive", "pending", "approved", "rejected", "all"],
  districts: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut"],
  roles: ["CITIZEN", "GRAM_SEVAK", "SARPANCH", "TEHSIL_CLERK", "TEHSILDAR", "DISTRICT_CLERK", "COLLECTOR", "ADMIN"],
  dateRanges: ["today", "yesterday", "last_7_days", "last_30_days", "this_month", "last_month", "custom"]
};

const ExportData = () => {
  const [activeTab, setActiveTab] = useState('export'); // 'export', 'history', 'templates'
  const [selectedType, setSelectedType] = useState('citizens');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [filters, setFilters] = useState({
    status: 'all',
    district: 'all',
    role: 'all',
    dateFrom: '',
    dateTo: '',
    dateRange: 'last_30_days',
    includeHeaders: true,
    includeMetadata: false
  });
  const [exportHistory, setExportHistory] = useState(mockExportHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedExport, setSelectedExport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get current export type config
  const currentType = exportTypes.find(t => t.id === selectedType);

  // Filter export history
  const filteredHistory = exportHistory.filter(exp => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        exp.name.toLowerCase().includes(searchLower) ||
        exp.type.toLowerCase().includes(searchLower) ||
        exp.createdBy.toLowerCase().includes(searchLower)
      );
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

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(i);
    }

    const newExport = {
      id: `EXP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: `${currentType.name} Export`,
      type: selectedType,
      format: selectedFormat.toUpperCase(),
      size: `${Math.floor(Math.random() * 50) + 1}.${Math.floor(Math.random() * 9)} MB`,
      records: Math.floor(Math.random() * 5000) + 100,
      filters: { ...filters },
      status: 'completed',
      createdBy: 'admin@eseva.gov.in',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      fileUrl: `/exports/${selectedType}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`,
      checksum: `sha256:${Math.random().toString(36).substring(2, 34)}`
    };

    setExportHistory(prev => [newExport, ...prev]);
    setIsExporting(false);
    setExportProgress(0);
    setSuccessMessage('Export completed successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle delete export
  const handleDeleteExport = (exportId) => {
    setExportHistory(prev => prev.filter(e => e.id !== exportId));
    setShowDeleteConfirm(false);
    setSuccessMessage('Export deleted successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle download
  const handleDownload = (exportItem) => {
    // In real app, trigger file download
    setSuccessMessage(`Downloading ${exportItem.name}...`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Handle preview
  const handlePreview = () => {
    // Generate mock preview data
    const mockPreview = [];
    for (let i = 0; i < 5; i++) {
      const row = {};
      currentType.fields.forEach(field => {
        row[field] = `Sample ${field} ${i + 1}`;
      });
      mockPreview.push(row);
    }
    setPreviewData(mockPreview);
    setShowPreview(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
          <p className="text-sm text-gray-600 mt-1">Export system data in various formats</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <DownloadIcon className="w-4 h-4 inline mr-2" />
            New Export
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Export History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Saved Templates
          </button>
        </div>
      </div>

      {/* New Export Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Types - Left Column */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Type</h2>
            <div className="space-y-2">
              {exportTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {type.fields.length} fields available
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Configuration - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exportFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <format.icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm font-medium text-gray-900">{format.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {filterOptions.status.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Filter (for relevant data types) */}
                {['citizens', 'officers', 'applications', 'offices'].includes(selectedType) && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      value={filters.district}
                      onChange={(e) => setFilters({...filters, district: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Districts</option>
                      {filterOptions.districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Role Filter (for officers/citizens) */}
                {['officers', 'citizens'].includes(selectedType) && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      {filterOptions.roles.map(role => (
                        <option key={role} value={role}>{role.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {filterOptions.dateRanges.map(range => (
                      <option key={range} value={range}>
                        {range.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Date Range (shown when custom selected) */}
                {filters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Options */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Additional Options</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.includeHeaders}
                        onChange={(e) => setFilters({...filters, includeHeaders: e.target.checked})}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Include column headers</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.includeMetadata}
                        onChange={(e) => setFilters({...filters, includeMetadata: e.target.checked})}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Include export metadata (timestamp, filters, etc.)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Fields to Export</h2>
                <button
                  onClick={handlePreview}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview Data
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentType.fields.map(field => (
                  <span key={field} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {isExporting ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div
                        className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                        style={{ animationDuration: '1s' }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Exporting Data...</p>
                  <p className="text-sm text-gray-500 mb-4">Please don't close this window</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{exportProgress}% Complete</p>
                </div>
              ) : (
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Export {currentType.name}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export History Tab */}
      {activeTab === 'history' && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Export List */}
          <div className="space-y-4">
            {filteredHistory.map(exportItem => (
              <div key={exportItem.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      exportTypes.find(t => t.id === exportItem.type)?.color || 'bg-gray-100'
                    }`}>
                      {(() => {
                        const Icon = exportTypes.find(t => t.id === exportItem.type)?.icon || FileText;
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{exportItem.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(exportItem.status)}`}>
                          {exportItem.status}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {exportItem.format}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">ID: {exportItem.id}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Database className="w-3 h-3 mr-1" />
                          {exportItem.records?.toLocaleString() || '?'} records
                        </span>
                        {exportItem.size && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <HardDrive className="w-3 h-3 mr-1" />
                            {exportItem.size}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(exportItem.createdAt)}
                        </span>
                      </div>
                      {exportItem.status === 'processing' && (
                        <div className="mt-3 w-64">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{exportItem.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${exportItem.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {exportItem.status === 'completed' && (
                      <button
                        onClick={() => handleDownload(exportItem)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Download"
                      >
                        <DownloadIcon className="w-4 h-4 text-blue-500" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedExport(exportItem);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedExport(exportItem);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Saved Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Monthly Citizen Report</h3>
                  <p className="text-xs text-gray-500">Last used: 2 days ago</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Type: Citizen Data</p>
              <p>Format: Excel</p>
              <p>Filters: Active citizens, All districts</p>
              <p>Schedule: Monthly on 1st</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Template Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weekly Applications</h3>
                  <p className="text-xs text-gray-500">Last used: 5 days ago</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Type: Applications</p>
              <p>Format: CSV</p>
              <p>Filters: Last 7 days, All statuses</p>
              <p>Schedule: Every Monday</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Add Template Button */}
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center">
            <button className="text-center">
              <PlusCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Create New Template</p>
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Data Preview</h2>
                <p className="text-sm text-gray-500 mt-1">Sample of {currentType.name} (first 5 records)</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {currentType.fields.map(field => (
                      <th key={field} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {currentType.fields.map(field => (
                        <td key={field} className="px-4 py-3 text-sm text-gray-900">
                          {row[field]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Export Details</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedExport.id}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{selectedExport.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedExport.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="text-sm font-medium text-gray-900">{selectedExport.format}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedExport.status)}`}>
                    {selectedExport.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="text-sm font-medium text-gray-900">{selectedExport.size || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Records</p>
                  <p className="text-sm font-medium text-gray-900">{selectedExport.records?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium text-gray-900">{selectedExport.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedExport.createdAt).toLocaleString()}</p>
                </div>
                {selectedExport.completedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Completed At</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(selectedExport.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Filters */}
              {selectedExport.filters && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Filters Applied</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs text-gray-700">
                      {JSON.stringify(selectedExport.filters, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* File Info */}
              {selectedExport.fileUrl && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">File Location</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-mono text-gray-700 break-all">{selectedExport.fileUrl}</p>
                    <p className="text-xs text-gray-500 mt-2">Checksum: {selectedExport.checksum}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                {selectedExport.status === 'completed' && (
                  <button
                    onClick={() => handleDownload(selectedExport)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <DownloadIcon className="w-4 h-4 inline mr-2" />
                    Download File
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Export?</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete {selectedExport.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteExport(selectedExport.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;