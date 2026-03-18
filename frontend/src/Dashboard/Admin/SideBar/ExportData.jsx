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
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  useExportDataMutation,
  useGetExportHistoryQuery,
  useDeleteExportMutation,
  useDownloadExportMutation,
  useGetExportPreviewQuery,
  useCreateExportTemplateMutation,
  useGetExportTemplatesQuery,
  useDeleteExportTemplateMutation
} from '../../../features/api/adminApi'; // Adjust the import path as needed

// Export types (keep this as is)
const exportTypes = [
  {
    id: "citizens",
    name: "Citizen Data",
    icon: Users,
    description: "Export citizen profiles and personal information",
    fields: ["Name", "Email", "Mobile", "Address", "Role", "isActive", "CreatedAt"],
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "officers",
    name: "Officer Data",
    icon: Briefcase,
    description: "Export government officer details",
    fields: ["Name", "Email", "Role", "Office", "Employee ID", "isActive", "lastLogin"],
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "applications",
    name: "Applications",
    icon: FileCheck,
    description: "Export certificate applications",
    fields: ["applicationId", "citizenId", "createdAt", "currentStatus", "currentOfficeLevel", "certificateType"],
    color: "bg-green-100 text-green-600"
  },
  {
    id: "offices",
    name: "Office Hierarchy",
    icon: Building2,
    description: "Export district, tehsil and gram panchayat data",
    fields: ["officeName", "officeLevel", "parentOffice", "pincode", "createdAt", "isActive"],
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "certificates",
    name: "Certificates Config",
    icon: FileText,
    description: "Export certificate type configurations",
    fields: ["name", "type", "description", "authority", "processingLevel", "fee"],
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "logs",
    name: "System Logs",
    icon: Database,
    description: "Export system activity and error logs",
    fields: ["type", "category", "action", "ip", "status", "method"],
    color: "bg-red-100 text-red-600"
  },
  {
    id: "notification",
    name: "Notification Data",
    icon: BarChart3,
    description: "Export all system notifications",
    fields: ["userId", "applicationId", "message", "type", "sentAt"],
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    id: "backups",
    name: "Backup Metadata",
    icon: Archive,
    description: "Export backup history and configuration",
    fields: ["type", "size", "createdBy", "status", "location"],
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
  const [activeTab, setActiveTab] = useState('export');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedExport, setSelectedExport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // RTK Query hooks
  const [exportData, { isLoading: isExporting }] = useExportDataMutation();
  const [deleteExport, { isLoading: isDeleting }] = useDeleteExportMutation();
  const [downloadExport, { isLoading: isDownloading }] = useDownloadExportMutation();
  const [createTemplate, { isLoading: isCreatingTemplate }] = useCreateExportTemplateMutation();
  
  const { 
    data: exportHistory = [], 
    refetch: refetchHistory,
    isLoading: isLoadingHistory 
  } = useGetExportHistoryQuery({
    search: searchTerm,
    type: selectedType,
    limit: 50
  });

  
  
  const { 
    data: templates = [], 
    refetch: refetchTemplates,
    isLoading: isLoadingTemplates 
  } = useGetExportTemplatesQuery();
  
  const [deleteTemplate] = useDeleteExportTemplateMutation();

  // Get current export type config
  const currentType = exportTypes.find(t => t.id === selectedType);

  // Filter export history
 const filteredHistory = exportHistory?.data?.filter((exp) => {
  if (!searchTerm?.trim()) return true;

  const searchLower = searchTerm.toLowerCase();

  return (
    (exp.name || "").toLowerCase().includes(searchLower) ||
    (exp.type || "").toLowerCase().includes(searchLower) ||
    (exp.createdBy || "").toLowerCase().includes(searchLower)
  );
}) || [];

  // Format date
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

  // Handle export with API
  const handleExport = async () => {
    try {
      const exportData = {
        type: selectedType,
        format: selectedFormat,
        filters: {
          ...filters,
          dateFrom: filters.dateRange === 'custom' ? filters.dateFrom : undefined,
          dateTo: filters.dateRange === 'custom' ? filters.dateTo : undefined,
        },
        options: {
          includeHeaders: filters.includeHeaders,
          includeMetadata: filters.includeMetadata
        }
      };

      const response = await exportData(exportData).unwrap();
      
      setSuccessMessage('Export started successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Refresh export history
      refetchHistory();
    } catch (error) {
      setSuccessMessage('Export failed: ' + (error.data?.message || 'Unknown error'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle delete export
  const handleDeleteExport = async (exportId) => {
    try {
      await deleteExport(exportId).unwrap();
      setShowDeleteConfirm(false);
      setSuccessMessage('Export deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refetchHistory();
    } catch (error) {
      setSuccessMessage('Delete failed: ' + (error.data?.message || 'Unknown error'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle download
  const handleDownload = async (exportItem) => {
    try {
      const response = await downloadExport(exportItem.id).unwrap();
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportItem.name}.${exportItem.format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccessMessage(`Downloading ${exportItem.name}...`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setSuccessMessage('Download failed: ' + (error.data?.message || 'Unknown error'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle preview
  const handlePreview = async () => {
    try {
      // Fetch preview data from API
      const response = await fetch(`/api/admin/exports/preview?type=${selectedType}&limit=5`);
      const data = await response.json();
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      // Fallback to mock data if API fails
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
    }
  };

  // Handle save template
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setSuccessMessage('Please enter a template name');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    try {
      const templateData = {
        name: templateName,
        type: selectedType,
        format: selectedFormat,
        filters: {
          ...filters,
          dateFrom: filters.dateRange === 'custom' ? filters.dateFrom : undefined,
          dateTo: filters.dateRange === 'custom' ? filters.dateTo : undefined,
        },
        options: {
          includeHeaders: filters.includeHeaders,
          includeMetadata: filters.includeMetadata
        }
      };

      await createTemplate(templateData).unwrap();
      
      setShowSaveTemplateModal(false);
      setTemplateName('');
      setSuccessMessage('Template saved successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      refetchTemplates();
    } catch (error) {
      setSuccessMessage('Failed to save template: ' + (error.data?.message || 'Unknown error'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle delete template
  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate(templateId).unwrap();
      setSuccessMessage('Template deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refetchTemplates();
    } catch (error) {
      setSuccessMessage('Failed to delete template: ' + (error.data?.message || 'Unknown error'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle apply template
  const handleApplyTemplate = (template) => {
    setSelectedType(template.type);
    setSelectedFormat(template.format);
    setFilters({
      ...filters,
      ...template.filters,
      dateRange: template.filters.dateFrom ? 'custom' : 'last_30_days'
    });
    setActiveTab('export');
  };

  // Get export progress (you might need to implement a polling mechanism for this)
  const getExportProgress = (exportItem) => {
    if (exportItem.status === 'processing') {
      return exportItem.progress || 0;
    }
    return 100;
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

            {/* Export Button and Save Template */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
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
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export {currentType.name}
                  </button>
                  
                  <button
                    onClick={() => setShowSaveTemplateModal(true)}
                    className="w-full flex items-center justify-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Template
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export History Tab */}
      {activeTab === 'history' && (
        <>
          {/* Search and Refresh */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => refetchHistory()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Export List */}
          <div className="space-y-4">
            {isLoadingHistory ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading export history...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No exports found</p>
                <button
                  onClick={() => setActiveTab('export')}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Create New Export
                </button>
              </div>
            ) : (
              filteredHistory.map(exportItem => (
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
                              <span className="font-medium">{getExportProgress(exportItem)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${getExportProgress(exportItem)}%` }}
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
                          disabled={isDownloading}
                          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
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
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-100 rounded-lg disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Saved Templates Tab */}
      {activeTab === 'templates' && (
        <>
          {isLoadingTemplates ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map(template => (
                <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        exportTypes.find(t => t.id === template.type)?.color || 'bg-blue-100'
                      }`}>
                        {(() => {
                          const Icon = exportTypes.find(t => t.id === template.type)?.icon || FileText;
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-xs text-gray-500">
                          Last used: {template.lastUsed ? formatDate(template.lastUsed) : 'Never'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Type: {exportTypes.find(t => t.id === template.type)?.name || template.type}</p>
                    <p>Format: {template.format.toUpperCase()}</p>
                    <p>Filters: {Object.keys(template.filters || {}).length} filters applied</p>
                    {template.schedule && <p>Schedule: {template.schedule}</p>}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleApplyTemplate(template)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Apply Template"
                    >
                      <Copy className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Template Button */}
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center">
                <button 
                  onClick={() => setShowSaveTemplateModal(true)}
                  className="text-center"
                >
                  <PlusCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Create New Template</p>
                </button>
              </div>
            </div>
          )}
        </>
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
                    {selectedExport.checksum && (
                      <p className="text-xs text-gray-500 mt-2">Checksum: {selectedExport.checksum}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                {selectedExport.status === 'completed' && (
                  <button
                    onClick={() => handleDownload(selectedExport)}
                    disabled={isDownloading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <DownloadIcon className="w-4 h-4 inline mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download File'}
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
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Save as Template</h2>
              <p className="text-sm text-gray-600 mb-4">
                Save the current export configuration as a template for future use.
              </p>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Monthly Citizen Report"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Configuration Summary:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Type: {currentType.name}</li>
                  <li>Format: {selectedFormat.toUpperCase()}</li>
                  <li>Filters: {Object.keys(filters).length} filters</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveTemplateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={isCreatingTemplate}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreatingTemplate ? 'Saving...' : 'Save Template'}
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