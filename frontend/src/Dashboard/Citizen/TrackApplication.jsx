import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  Download,
  Eye,
  ChevronRight,
  ArrowLeft,
  Info,
  RefreshCw,
  AlertTriangle,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

// Mock applications data based on your schema
const mockApplications = [
  {
    _id: "APP001",
    applicationId: "eSEVA/2026/IN/00123",
    certificateType: "INCOME",
    currentStatus: "SUBMITTED",
    currentOfficeLevel: "GRAM",
    issueUrgency: "normal",
    appliedDate: "2026-02-10T09:15:00Z",
    lastUpdated: "2026-02-10T09:15:00Z",
    expectedCompletionDate: "2026-02-17T09:15:00Z",
    jurisdiction: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    documents: [
      { documentType: "Income Proof Form", fileUrl: "#", isVerified: false },
      { documentType: "Tax Document", fileUrl: "#", isVerified: false },
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true }
    ],
    timeline: [
      { status: "SUBMITTED", date: "2026-02-10T09:15:00Z", office: "Gram Panchayat", remark: "Application submitted successfully" },
      { status: "UNDER_VERIFICATION", date: "2026-02-11T10:30:00Z", office: "Gram Panchayat", remark: "Document verification initiated" }
    ]
  },
  {
    _id: "APP002",
    applicationId: "eSEVA/2026/CASTE/00156",
    certificateType: "CASTE",
    currentStatus: "UNDER_VERIFICATION",
    currentOfficeLevel: "TEHSIL",
    issueUrgency: "urgent",
    appliedDate: "2026-02-08T11:30:00Z",
    lastUpdated: "2026-02-11T14:20:00Z",
    expectedCompletionDate: "2026-02-14T11:30:00Z",
    jurisdiction: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    assignedTo: {
      name: "Priya Singh",
      role: "TEHSIL_CLERK",
      employeeId: "TC001"
    },
    documents: [
      { documentType: "Caste Certificate Form", fileUrl: "#", isVerified: true },
      { documentType: "Parent Caste Proof", fileUrl: "#", isVerified: true },
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true }
    ],
    timeline: [
      { status: "SUBMITTED", date: "2026-02-08T11:30:00Z", office: "Gram Panchayat", remark: "Application submitted" },
      { status: "UNDER_VERIFICATION", date: "2026-02-09T09:20:00Z", office: "Gram Panchayat", remark: "Verified by Gram Sevak" },
      { status: "UNDER_VERIFICATION", date: "2026-02-10T11:45:00Z", office: "Tehsil Office", remark: "Forwarded to Tehsil Clerk" }
    ]
  },
  {
    _id: "APP003",
    applicationId: "eSEVA/2026/RES/00189",
    certificateType: "RESIDENCE",
    currentStatus: "CORRECTION_REQUIRED",
    currentOfficeLevel: "GRAM",
    issueUrgency: "normal",
    appliedDate: "2026-02-05T15:45:00Z",
    lastUpdated: "2026-02-12T10:15:00Z",
    jurisdiction: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    correctionMessage: "Address proof document is blurry. Please upload a clear copy of electricity bill or water bill showing your complete address.",
    documents: [
      { documentType: "Ration Card", fileUrl: "#", isVerified: true },
      { documentType: "Electricity Bill", fileUrl: "#", isVerified: false, isRejected: true },
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true }
    ],
    timeline: [
      { status: "SUBMITTED", date: "2026-02-05T15:45:00Z", office: "Gram Panchayat", remark: "Application submitted" },
      { status: "UNDER_VERIFICATION", date: "2026-02-07T10:20:00Z", office: "Gram Panchayat", remark: "Documents under review" },
      { status: "CORRECTION_REQUIRED", date: "2026-02-12T10:15:00Z", office: "Gram Panchayat", remark: "Correction required: Address proof unclear" }
    ]
  },
  {
    _id: "APP004",
    applicationId: "eSEVA/2026/BIRTH/00234",
    certificateType: "BIRTH",
    currentStatus: "APPROVED",
    currentOfficeLevel: "DISTRICT",
    issueUrgency: "normal",
    appliedDate: "2026-02-01T13:20:00Z",
    lastUpdated: "2026-02-09T16:45:00Z",
    expectedCompletionDate: "2026-02-08T13:20:00Z",
    jurisdiction: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    documents: [
      { documentType: "Birth Report", fileUrl: "#", isVerified: true },
      { documentType: "Parent ID", fileUrl: "#", isVerified: true },
      { documentType: "Hospital Certificate", fileUrl: "#", isVerified: true }
    ],
    certificateUrl: "#",
    issuedDate: "2026-02-09T16:45:00Z",
    timeline: [
      { status: "SUBMITTED", date: "2026-02-01T13:20:00Z", office: "Gram Panchayat", remark: "Application submitted" },
      { status: "UNDER_VERIFICATION", date: "2026-02-02T10:15:00Z", office: "Gram Panchayat", remark: "Verified by Gram Sevak" },
      { status: "UNDER_VERIFICATION", date: "2026-02-04T09:30:00Z", office: "Tehsil Office", remark: "Verified by Tehsil Clerk" },
      { status: "UNDER_VERIFICATION", date: "2026-02-06T14:20:00Z", office: "District Office", remark: "Final verification by District Clerk" },
      { status: "APPROVED", date: "2026-02-09T16:45:00Z", office: "District Office", remark: "Certificate approved and issued" }
    ]
  },
  {
    _id: "APP005",
    applicationId: "eSEVA/2026/DOM/00278",
    certificateType: "DOMICILE",
    currentStatus: "REJECTED",
    currentOfficeLevel: "TEHSIL",
    issueUrgency: "normal",
    appliedDate: "2026-01-28T10:00:00Z",
    lastUpdated: "2026-02-06T11:30:00Z",
    jurisdiction: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    rejectionReason: "Submitted documents do not prove 5+ years of residency in the state. Please submit older utility bills or ration card showing address from at least 5 years ago.",
    documents: [
      { documentType: "Domicile Form", fileUrl: "#", isVerified: false },
      { documentType: "Property Proof", fileUrl: "#", isVerified: false },
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true }
    ],
    timeline: [
      { status: "SUBMITTED", date: "2026-01-28T10:00:00Z", office: "Gram Panchayat", remark: "Application submitted" },
      { status: "UNDER_VERIFICATION", date: "2026-01-30T11:20:00Z", office: "Gram Panchayat", remark: "Documents under review" },
      { status: "UNDER_VERIFICATION", date: "2026-02-02T09:45:00Z", office: "Tehsil Office", remark: "Verification at Tehsil level" },
      { status: "REJECTED", date: "2026-02-06T11:30:00Z", office: "Tehsil Office", remark: "Application rejected due to insufficient residency proof" }
    ]
  }
];

const getStatusConfig = (status) => {
  const config = {
    'SUBMITTED': {
      color: 'bg-blue-100 text-blue-800',
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      icon: Clock,
      label: 'Submitted',
      progress: 20
    },
    'UNDER_VERIFICATION': {
      color: 'bg-yellow-100 text-yellow-800',
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      icon: RefreshCw,
      label: 'Under Verification',
      progress: 50
    },
    'CORRECTION_REQUIRED': {
      color: 'bg-orange-100 text-orange-800',
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      icon: AlertTriangle,
      label: 'Correction Required',
      progress: 30
    },
    'APPROVED': {
      color: 'bg-green-100 text-green-800',
      border: 'border-green-200',
      bg: 'bg-green-50',
      icon: CheckCircle,
      label: 'Approved',
      progress: 100
    },
    'REJECTED': {
      color: 'bg-red-100 text-red-800',
      border: 'border-red-200',
      bg: 'bg-red-50',
      icon: XCircle,
      label: 'Rejected',
      progress: 0
    }
  };
  return config[status] || config['SUBMITTED'];
};

const getCertificateIcon = (type) => {
  const icons = {
    'BIRTH': '👶',
    'RESIDENCE': '🏠',
    'INCOME': '💰',
    'CASTE': '👤',
    'DOMICILE': '📍'
  };
  return icons[type] || '📄';
};

const getCertificateName = (type) => {
  const names = {
    'BIRTH': 'Birth Certificate',
    'RESIDENCE': 'Residence Certificate',
    'INCOME': 'Income Certificate',
    'CASTE': 'Caste Certificate',
    'DOMICILE': 'Domicile Certificate'
  };
  return names[type] || type;
};

export default function TrackApplication() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load applications
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApps(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredApps(applications);
      return;
    }

    const filtered = applications.filter(app => 
      app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.certificateType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApps(filtered);
  };

  // Handle filter by status
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      setFilteredApps(applications);
    } else {
      const filtered = applications.filter(app => app.currentStatus === status);
      setFilteredApps(filtered);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (expectedDate) => {
    if (!expectedDate) return null;
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} days remaining`;
    if (diffDays === 0) return 'Today';
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
                <h1 className="text-2xl font-bold text-gray-900">Track Applications</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Search and track your certificate applications
                </p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">
                  {applications.filter(a => a.currentStatus === 'SUBMITTED').length} Submitted
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">
                  {applications.filter(a => a.currentStatus === 'UNDER_VERIFICATION').length} Processing
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">
                  {applications.filter(a => a.currentStatus === 'APPROVED').length} Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Application ID or Certificate Type..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Applications</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_VERIFICATION">Under Verification</option>
                <option value="CORRECTION_REQUIRED">Correction Required</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading your applications...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Applications List */}
            {filteredApps.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {searchQuery ? 'Try a different search term' : 'You haven\'t applied for any certificates yet'}
                  </p>
                  <button
                    onClick={() => navigate('/citizen/new-application')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply for Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApps.map((app) => {
                  const status = getStatusConfig(app.currentStatus);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    >
                      {/* Header with Status */}
                      <div className={`p-4 border-b ${status.border} ${status.bg}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getCertificateIcon(app.certificateType)}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {getCertificateName(app.certificateType)}
                              </h3>
                              <p className="text-xs text-gray-600 mt-0.5">
                                ID: {app.applicationId}
                              </p>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                            <span>Progress</span>
                            <span>{status.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                app.currentStatus === 'APPROVED' ? 'bg-green-500' :
                                app.currentStatus === 'REJECTED' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${status.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(app.appliedDate).split(',')[0]}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Current Office</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {app.currentOfficeLevel} Office
                            </p>
                          </div>
                          {app.expectedCompletionDate && app.currentStatus !== 'APPROVED' && app.currentStatus !== 'REJECTED' && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 mb-1">Expected Completion</p>
                              <p className={`text-sm font-medium ${
                                getDaysRemaining(app.expectedCompletionDate)?.includes('overdue') 
                                  ? 'text-red-600' 
                                  : 'text-green-600'
                              }`}>
                                {formatDate(app.expectedCompletionDate).split(',')[0]}
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getDaysRemaining(app.expectedCompletionDate)})
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Documents Status */}
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">Documents Status</p>
                          <div className="flex flex-wrap gap-2">
                            {app.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center px-2 py-1 rounded text-xs ${
                                  doc.isVerified 
                                    ? 'bg-green-100 text-green-700'
                                    : doc.isRejected
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {doc.isVerified ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : doc.isRejected ? (
                                  <XCircle className="w-3 h-3 mr-1" />
                                ) : (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {doc.documentType}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Correction Message */}
                        {app.currentStatus === 'CORRECTION_REQUIRED' && app.correctionMessage && (
                          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                            <p className="text-xs text-orange-700 flex items-start">
                              <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{app.correctionMessage}</span>
                            </p>
                          </div>
                        )}

                        {/* Rejection Message */}
                        {app.currentStatus === 'REJECTED' && app.rejectionReason && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs text-red-700 flex items-start">
                              <XCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{app.rejectionReason}</span>
                            </p>
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="mt-4 flex justify-end">
                          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center group-hover:underline">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Application Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {selectedApp.applicationId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-lg ${
                  selectedApp.currentStatus === 'APPROVED' ? 'bg-green-50 border border-green-200' :
                  selectedApp.currentStatus === 'REJECTED' ? 'bg-red-50 border border-red-200' :
                  selectedApp.currentStatus === 'CORRECTION_REQUIRED' ? 'bg-orange-50 border border-orange-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center">
                    {selectedApp.currentStatus === 'APPROVED' && <CheckCircle className="w-5 h-5 text-green-600 mr-3" />}
                    {selectedApp.currentStatus === 'REJECTED' && <XCircle className="w-5 h-5 text-red-600 mr-3" />}
                    {selectedApp.currentStatus === 'CORRECTION_REQUIRED' && <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />}
                    {selectedApp.currentStatus === 'SUBMITTED' && <Clock className="w-5 h-5 text-blue-600 mr-3" />}
                    {selectedApp.currentStatus === 'UNDER_VERIFICATION' && <RefreshCw className="w-5 h-5 text-yellow-600 mr-3" />}
                    <div>
                      <h3 className={`font-medium ${
                        selectedApp.currentStatus === 'APPROVED' ? 'text-green-800' :
                        selectedApp.currentStatus === 'REJECTED' ? 'text-red-800' :
                        selectedApp.currentStatus === 'CORRECTION_REQUIRED' ? 'text-orange-800' :
                        'text-blue-800'
                      }`}>
                        Application {selectedApp.currentStatus === 'APPROVED' ? 'Approved' :
                                      selectedApp.currentStatus === 'REJECTED' ? 'Rejected' :
                                      selectedApp.currentStatus === 'CORRECTION_REQUIRED' ? 'Correction Required' :
                                      selectedApp.currentStatus === 'SUBMITTED' ? 'Submitted' :
                                      'Under Verification'}
                      </h3>
                      <p className={`text-sm ${
                        selectedApp.currentStatus === 'APPROVED' ? 'text-green-700' :
                        selectedApp.currentStatus === 'REJECTED' ? 'text-red-700' :
                        selectedApp.currentStatus === 'CORRECTION_REQUIRED' ? 'text-orange-700' :
                        'text-blue-700'
                      }`}>
                        Last updated: {formatDate(selectedApp.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        Application Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Certificate Type</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getCertificateName(selectedApp.certificateType)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Urgency</span>
                          <span className={`text-sm font-medium ${
                            selectedApp.issueUrgency === 'urgent' 
                              ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded'
                              : 'text-gray-900'
                          }`}>
                            {selectedApp.issueUrgency === 'urgent' ? '⚡ Urgent' : 'Normal'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Applied On</span>
                          <span className="text-sm text-gray-900">{formatDate(selectedApp.appliedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Current Office</span>
                          <span className="text-sm text-gray-900 capitalize">{selectedApp.currentOfficeLevel} Office</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Jurisdiction
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="text-xs text-gray-500 block">Village:</span>
                          {selectedApp.jurisdiction.village}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="text-xs text-gray-500 block">Tehsil:</span>
                          {selectedApp.jurisdiction.tehsil}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="text-xs text-gray-500 block">District:</span>
                          {selectedApp.jurisdiction.district}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {selectedApp.assignedTo && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Assigned Officer
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">{selectedApp.assignedTo.name}</p>
                          <p className="text-xs text-gray-600 capitalize">{selectedApp.assignedTo.role.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">ID: {selectedApp.assignedTo.employeeId}</p>
                        </div>
                      </div>
                    )}

                    {selectedApp.expectedCompletionDate && selectedApp.currentStatus !== 'APPROVED' && selectedApp.currentStatus !== 'REJECTED' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Expected Completion
                        </h4>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(selectedApp.expectedCompletionDate).split(',')[0]}
                        </p>
                        <p className={`text-sm ${
                          getDaysRemaining(selectedApp.expectedCompletionDate)?.includes('overdue') 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {getDaysRemaining(selectedApp.expectedCompletionDate)}
                        </p>
                      </div>
                    )}

                    {selectedApp.currentStatus === 'APPROVED' && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Certificate Issued
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          Issued on: {formatDate(selectedApp.issuedDate)}
                        </p>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApp.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                            <div className="flex items-center mt-1">
                              {doc.isVerified ? (
                                <span className="text-xs text-green-600 flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </span>
                              ) : doc.isRejected ? (
                                <span className="text-xs text-red-600 flex items-center">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="text-xs text-yellow-600 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h4>
                  <div className="space-y-3">
                    {selectedApp.timeline?.map((event, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="relative flex flex-col items-center mr-4">
                          <div className={`w-3 h-3 rounded-full ${
                            event.status === 'APPROVED' ? 'bg-green-500' :
                            event.status === 'REJECTED' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}></div>
                          {idx < selectedApp.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {event.status.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{event.office}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.remark}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  {selectedApp.currentStatus === 'CORRECTION_REQUIRED' && (
                    <button
                      onClick={() => {
                        setSelectedApp(null);
                        navigate(`/citizen/correct-application/${selectedApp._id}`);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Correct & Resubmit
                    </button>
                  )}
                  {selectedApp.currentStatus === 'APPROVED' && (
                    <button className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}