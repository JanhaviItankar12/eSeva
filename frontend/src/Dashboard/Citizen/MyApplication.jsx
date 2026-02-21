import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Building2,
  User,
  RefreshCw,
  Info,
  Upload,
  Edit3
} from 'lucide-react';
import { useGetAllApplicationQuery } from '../../features/api/citizenApi';
 

// Status Configuration
const statusConfig = {
  'SUBMITTED': {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-200',
    bgLight: 'bg-blue-50',
    icon: Clock,
    progress: 20
  },
  'UNDER_VERIFICATION': {
    label: 'Under Verification',
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-200',
    bgLight: 'bg-yellow-50',
    icon: RefreshCw,
    progress: 60
  },
  'CORRECTION_REQUIRED': {
    label: 'Correction Required',
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-200',
    bgLight: 'bg-orange-50',
    icon: AlertTriangle,
    progress: 30
  },
  'APPROVED': {
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-200',
    bgLight: 'bg-green-50',
    icon: CheckCircle,
    progress: 100
  },
  'REJECTED': {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-200',
    bgLight: 'bg-red-50',
    icon: XCircle,
    progress: 0
  }
};

// Certificate Icons and Names
const certificateIcons = {
  'BIRTH': '👶',
  'RESIDENCE': '🏠',
  'INCOME': '💰',
  'CASTE': '👤',
  'DOMICILE': '📍'
};

const certificateNames = {
  'BIRTH': 'Birth Certificate',
  'RESIDENCE': 'Residence Certificate',
  'INCOME': 'Income Certificate',
  'CASTE': 'Caste Certificate',
  'DOMICILE': 'Domicile Certificate'
};

export default function MyApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionApp, setCorrectionApp] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // RTK Query hook - This is the key fix
  const { data, isLoading, isError, error, refetch } = useGetAllApplicationQuery();
  
  // Get applications from data with fallback
  const applications = data?.citizenApplications || [];



  // Log for debugging
  useEffect(() => {
   
    console.log('Loading:', isLoading);
  }, [data, applications, isLoading]);

  //  Filter applications using useMemo (runs when dependencies change)
  const filteredApps = useMemo(() => {
    console.log('Filtering applications...', applications.length);
    let filtered = [...applications];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(app => {
        if (activeFilter === 'in_progress') {
          return ['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus);
        }
        if (activeFilter === 'correction') {
          return app.currentStatus === 'CORRECTION_REQUIRED';
        }
        if (activeFilter === 'approved') {
          return app.currentStatus === 'APPROVED';
        }
        if (activeFilter === 'rejected') {
          return app.currentStatus === 'REJECTED';
        }
        return true;
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.applicationId?.toLowerCase().includes(query) ||
        certificateNames[app.certificateType]?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [applications, activeFilter, searchQuery]);

  //  Stats calculation using useMemo
  const stats = useMemo(() => ({
    total: applications.length,
    inProgress: applications.filter(app => ['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus)).length,
    correction: applications.filter(app => app.currentStatus === 'CORRECTION_REQUIRED').length,
    approved: applications.filter(app => app.currentStatus === 'APPROVED').length,
    rejected: applications.filter(app => app.currentStatus === 'REJECTED').length
  }), [applications]);

  // Format date functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handlers
  const handleDownloadCertificate = (certificateUrl, applicationId) => {
    console.log('Downloading certificate:', applicationId);
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    } else {
      alert('Certificate not available yet');
    }
  };

  const handleTrackApplication = (applicationId) => {
    navigate(`/citizen/track-applications/${id}/${encodeURIComponent(applicationId)}`);
  };

  const handleCorrectionUpload = (e, documentType) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        fileName: file.name,
        documentType
      }))
    }));
  };

  const handleResubmitCorrection = async (appId) => {
    try {
      console.log('Resubmitting corrected documents for:', appId);
      // Call your API here
      // await useResubmitCorrectionMutation({ appId, documents: uploadedFiles }).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Documents resubmitted successfully!');
      setShowCorrectionModal(false);
      setCorrectionApp(null);
      setUploadedFiles({});
      
      // Refetch applications to get updated data
      refetch();
    } catch (error) {
      console.error('Resubmission failed:', error);
      alert('Failed to resubmit documents. Please try again.');
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter'] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Failed to Load Applications</h2>
            <p className="text-red-600 mb-6">
              {error?.data?.message || 'Please check your connection and try again'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Track and manage all your certificate applications
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/citizen/new-application/${id}`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              New Application
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('in_progress')}
            className={`bg-white p-5 rounded-xl border shadow-sm cursor-pointer transition-all ${
              activeFilter === 'in_progress' 
                ? 'border-yellow-500 ring-2 ring-yellow-200' 
                : 'border-gray-200 hover:border-yellow-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('correction')}
            className={`bg-white p-5 rounded-xl border shadow-sm cursor-pointer transition-all ${
              activeFilter === 'correction' 
                ? 'border-orange-500 ring-2 ring-orange-200' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Correction</p>
                <p className="text-2xl font-bold text-orange-600">{stats.correction}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('approved')}
            className={`bg-white p-5 rounded-xl border shadow-sm cursor-pointer transition-all ${
              activeFilter === 'approved' 
                ? 'border-green-500 ring-2 ring-green-200' 
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('rejected')}
            className={`bg-white p-5 rounded-xl border shadow-sm cursor-pointer transition-all ${
              activeFilter === 'rejected' 
                ? 'border-red-500 ring-2 ring-red-200' 
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Applications ({stats.total})
              </button>
              <button
                onClick={() => setActiveFilter('in_progress')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === 'in_progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setActiveFilter('correction')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === 'correction'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                Correction Required ({stats.correction})
              </button>
              <button
                onClick={() => setActiveFilter('approved')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or certificate type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full md:w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const status = statusConfig[app.currentStatus] || statusConfig['SUBMITTED'];
              const StatusIcon = status.icon;
              const isCorrection = app.currentStatus === 'CORRECTION_REQUIRED';
              const isApproved = app.currentStatus === 'APPROVED';
              const isRejected = app.currentStatus === 'REJECTED';

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Section - Certificate Info */}
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{certificateIcons[app.certificateType] || '📄'}</div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {certificateNames[app.certificateType] || app.certificateType}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </span>
                            {app.issueUrgency === 'urgent' && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Urgent
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            ID: <span className="font-mono">{app.applicationId}</span>
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              Applied: {formatDate(app.appliedDate)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              {app.jurisdiction?.village}, {app.jurisdiction?.tehsil}
                            </span>
                            <span className="flex items-center">
                              <Building2 className="w-3.5 h-3.5 mr-1" />
                              {app.currentOfficeLevel} Office
                            </span>
                          </div>

                          {/* Correction Message */}
                          {isCorrection && app.correctionMessage && (
                            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-start">
                                <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-800">
                                  <span className="font-medium">Correction Required: </span>
                                  {app.correctionMessage}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {isRejected && app.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start">
                                <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-red-800">
                                  <span className="font-medium">Rejection Reason: </span>
                                  {app.rejectionReason}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Dates & Actions */}
                      <div className="flex flex-col items-end">
                        {app.expectedCompletionDate && !isApproved && !isRejected && (
                          <div className="text-right mb-3">
                            <p className="text-xs text-gray-500">Expected by</p>
                            <p className="text-sm font-semibold text-blue-600">
                              {formatDate(app.expectedCompletionDate)}
                            </p>
                          </div>
                        )}
                        
                        {isApproved && (
                          <div className="text-right mb-3">
                            <p className="text-xs text-gray-500">Issued on</p>
                            <p className="text-sm font-semibold text-green-600">
                              {formatDate(app.issuedDate)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Cert. No: {app.certificateNumber || 'N/A'}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          {isCorrection && (
                            <button
                              onClick={() => {
                                setCorrectionApp(app);
                                setShowCorrectionModal(true);
                              }}
                              className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Correct Now
                            </button>
                          )}
                          
                          {isApproved && (
                            <button
                              onClick={() => handleDownloadCertificate(app.certificateUrl, app.applicationId)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedApp(app)}
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar - Only for in progress */}
                    {['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus) && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Application Progress</span>
                          <span className="font-medium text-gray-900">{status.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              app.currentStatus === 'SUBMITTED' ? 'bg-blue-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${status.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Last updated: {formatDateTime(app.lastUpdated)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'No applications match your search criteria'
                : "You haven't applied for any certificates yet"}
            </p>
            <button
              onClick={() => navigate(`/citizen/new-application/${id}`)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Apply for Certificate
            </button>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl">{certificateIcons[selectedApp.certificateType] || '📄'}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {certificateNames[selectedApp.certificateType] || selectedApp.certificateType}
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  Application ID: <span className="font-mono font-medium">{selectedApp.applicationId}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`px-4 py-2 rounded-lg ${statusConfig[selectedApp.currentStatus]?.bgLight || 'bg-gray-50'}`}>
                  <span className={`inline-flex items-center text-sm font-medium ${statusConfig[selectedApp.currentStatus]?.color.split(' ')[1] || 'text-gray-800'}`}>
                    {React.createElement(statusConfig[selectedApp.currentStatus]?.icon || Clock, { className: "w-4 h-4 mr-2" })}
                    {statusConfig[selectedApp.currentStatus]?.label || selectedApp.currentStatus}
                  </span>
                </div>
                {selectedApp.issueUrgency === 'urgent' && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Urgent Processing
                  </span>
                )}
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Applied On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(selectedApp.appliedDate)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(selectedApp.lastUpdated)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Current Office</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedApp.currentOfficeLevel} Office
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Jurisdiction</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedApp.jurisdiction?.village}, {selectedApp.jurisdiction?.tehsil}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedApp.jurisdiction?.district}
                  </p>
                </div>
              </div>

              {/* Assigned Officer */}
              {selectedApp.assignedTo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {selectedApp.assignedTo.name}
                      </p>
                      <p className="text-xs text-blue-700">
                        {selectedApp.assignedTo.role?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {selectedApp.documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{doc.documentType}</p>
                          <p className="text-xs text-gray-500">
                            {doc.isVerified ? (
                              <span className="text-green-600">Verified</span>
                            ) : doc.isRejected ? (
                              <span className="text-red-600">Rejected</span>
                            ) : (
                              <span className="text-yellow-600">Pending Verification</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Completion Date */}
              {selectedApp.expectedCompletionDate && !['APPROVED', 'REJECTED'].includes(selectedApp.currentStatus) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Expected Completion</p>
                        <p className="text-xs text-gray-600">Tentative date based on normal processing</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatDate(selectedApp.expectedCompletionDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedApp.currentStatus === 'CORRECTION_REQUIRED' && (
                  <button
                    onClick={() => {
                      setSelectedApp(null);
                      setCorrectionApp(selectedApp);
                      setShowCorrectionModal(true);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Correct & Resubmit
                  </button>
                )}
                {selectedApp.currentStatus === 'APPROVED' && (
                  <button
                    onClick={() => handleDownloadCertificate(selectedApp.certificateUrl, selectedApp.applicationId)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                )}
                <button
                  onClick={() => handleTrackApplication(selectedApp.applicationId)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Track Status
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && correctionApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Correct Application</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {certificateNames[correctionApp.certificateType] || correctionApp.certificateType} - {correctionApp.applicationId}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrectionApp(null);
                    setUploadedFiles({});
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Officer Message */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800 mb-1">Officer's Correction Message</p>
                    <p className="text-sm text-orange-700">{correctionApp.correctionMessage}</p>
                  </div>
                </div>
              </div>

              {/* Documents to Correct */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents Requiring Correction</h3>
                {correctionApp.documents
                  ?.filter(doc => doc.isRejected || !doc.isVerified)
                  .map((doc, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{doc.documentType}</span>
                          {doc.isRejected && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Upload New File */}
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Upload corrected document
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 relative">
                            <input
                              type="file"
                              id={`file-${idx}`}
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleCorrectionUpload(e, doc.documentType)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`file-${idx}`}
                              className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                            >
                              <Upload className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-600">Choose file</span>
                            </label>
                          </div>
                        </div>

                        {/* Uploaded File Preview */}
                        {uploadedFiles[doc.documentType]?.map(file => (
                          <div key={file.id} className="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-xs text-gray-600">{file.fileName}</span>
                            </div>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrectionApp(null);
                    setUploadedFiles({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResubmitCorrection(correctionApp._id)}
                  disabled={Object.keys(uploadedFiles).length === 0}
                  className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resubmit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}