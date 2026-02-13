import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Bell,
  Home,
  Search,
  LogOut,
  Upload,
  Eye,
  Printer,
  Mail,
  ChevronRight,
  PlusCircle,
  Edit3,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';

// Mock Data based on schemas
const mockCitizenData = {
  _id: "USER123",
  name: "Rajesh Kumar Sharma",
  email: "rajesh.k@example.com",
  mobile: "9876543210",
  role: "CITIZEN",
  createdAt: "2025-01-15T10:30:00Z"
};

const mockJurisdiction = {
  village: "Rajapur",
  tehsil: "Sadar",
  district: "Lucknow"
};

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
    jurisdiction: mockJurisdiction,
    documents: [
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true },
      { documentType: "Income Proof", fileUrl: "#", isVerified: false }
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
    jurisdiction: mockJurisdiction,
    assignedTo: {
      name: "Priya Singh",
      role: "TEHSIL_CLERK"
    },
    documents: [
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true },
      { documentType: "Caste Certificate", fileUrl: "#", isVerified: true },
      { documentType: "Residence Proof", fileUrl: "#", isVerified: false }
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
    jurisdiction: mockJurisdiction,
    correctionMessage: "Address proof document is blurry. Please upload a clear copy of electricity bill or water bill showing your complete address.",
    documents: [
      { documentType: "Aadhar Card", fileUrl: "#", isVerified: true },
      { documentType: "Electricity Bill", fileUrl: "#", isVerified: false, isRejected: true }
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
    jurisdiction: mockJurisdiction,
    documents: [
      { documentType: "Hospital Birth Certificate", fileUrl: "#", isVerified: true },
      { documentType: "Parent Aadhar", fileUrl: "#", isVerified: true }
    ],
    certificateUrl: "#",
    issuedDate: "2026-02-09T16:45:00Z"
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
    jurisdiction: mockJurisdiction,
    rejectionReason: "Submitted documents do not prove 5+ years of residency in the state. Please submit older utility bills or ration card.",
    documents: [
      { documentType: "Rent Agreement", fileUrl: "#", isVerified: false },
      { documentType: "Bank Statement", fileUrl: "#", isVerified: false }
    ]
  },
  {
    _id: "APP006",
    applicationId: "eSEVA/2026/IN/00301",
    certificateType: "INCOME",
    currentStatus: "APPROVED",
    currentOfficeLevel: "DISTRICT",
    issueUrgency: "urgent",
    appliedDate: "2026-01-25T09:00:00Z",
    lastUpdated: "2026-02-03T14:15:00Z",
    expectedCompletionDate: "2026-02-01T09:00:00Z",
    jurisdiction: mockJurisdiction,
    documents: [
      { documentType: "Salary Slips", fileUrl: "#", isVerified: true },
      { documentType: "Bank Statement", fileUrl: "#", isVerified: true },
      { documentType: "Form 16", fileUrl: "#", isVerified: true }
    ],
    certificateUrl: "#",
    issuedDate: "2026-02-03T14:15:00Z"
  }
];

const mockNotifications = [
  {
    id: 1,
    type: "status",
    title: "Application Under Verification",
    message: "Your Caste Certificate application (eSEVA/2026/CASTE/00156) is being verified at Tehsil Office",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    type: "correction",
    title: "Correction Required",
    message: "Please upload clear address proof for Residence Certificate application",
    time: "1 day ago",
    read: false
  },
  {
    id: 3,
    type: "success",
    title: "Certificate Approved",
    message: "Your Birth Certificate (eSEVA/2026/BIRTH/00234) has been approved. Download now.",
    time: "3 days ago",
    read: true
  },
  {
    id: 4,
    type: "info",
    title: "Application Submitted",
    message: "Your Income Certificate application has been submitted successfully",
    time: "5 days ago",
    read: true
  }
];

const getStatusBadge = (status) => {
  const statusConfig = {
    'SUBMITTED': { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Submitted' },
    'UNDER_VERIFICATION': { color: 'bg-yellow-100 text-yellow-800', icon: RefreshCw, label: 'Under Verification' },
    'CORRECTION_REQUIRED': { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle, label: 'Correction Required' },
    'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
    'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
  };
  return statusConfig[status] || statusConfig['SUBMITTED'];
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

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Filter applications based on active tab
  const filteredApplications = mockApplications.filter(app => {
    if (activeTab === 'all') return true;
    if (activeTab === 'correction') return app.currentStatus === 'CORRECTION_REQUIRED';
    if (activeTab === 'progress') return ['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus);
    if (activeTab === 'approved') return app.currentStatus === 'APPROVED';
    if (activeTab === 'rejected') return app.currentStatus === 'REJECTED';
    return true;
  });

  // Stats calculation
  const stats = {
    total: mockApplications.length,
    inProgress: mockApplications.filter(app => ['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus)).length,
    approved: mockApplications.filter(app => app.currentStatus === 'APPROVED').length,
    correction: mockApplications.filter(app => app.currentStatus === 'CORRECTION_REQUIRED').length,
    rejected: mockApplications.filter(app => app.currentStatus === 'REJECTED').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#1e40af"/>
                <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
                <rect x="10" y="21" width="12" height="2" fill="white"/>
              </svg>
              <div>
                <div className="text-lg font-semibold text-slate-900 tracking-tight">eSeva</div>
                <div className="text-xs text-slate-500 -mt-0.5">Digital Certificate Portal</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                {mockNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {mockCitizenData.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{mockCitizenData.name}</p>
                  <p className="text-xs text-gray-500">{mockCitizenData.mobile}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 text-white mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {mockCitizenData.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-blue-100">
                  Village: {mockJurisdiction.village} | Tehsil: {mockJurisdiction.tehsil} | District: {mockJurisdiction.district}
                </p>
              </div>
              <button className="bg-white text-blue-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 flex items-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Application
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
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
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
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
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Correction</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.correction}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
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

          {/* Main Grid - Applications & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications Section - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto px-4">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        activeTab === 'all'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All Applications
                    </button>
                    <button
                      onClick={() => setActiveTab('progress')}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        activeTab === 'progress'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      In Progress ({stats.inProgress})
                    </button>
                    <button
                      onClick={() => setActiveTab('correction')}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
                        activeTab === 'correction'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Correction Required
                      {stats.correction > 0 && (
                        <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                          {stats.correction}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('approved')}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        activeTab === 'approved'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Approved ({stats.approved})
                    </button>
                  </div>
                </div>

                {/* Applications List */}
                <div className="divide-y divide-gray-200">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => {
                      const status = getStatusBadge(app.currentStatus);
                      const StatusIcon = status.icon;
                      
                      return (
                        <div 
                          key={app._id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{getCertificateIcon(app.certificateType)}</div>
                              <div>
                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900">
                                    {app.certificateType} Certificate
                                  </h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                                    <StatusIcon className="w-3 h-3 inline mr-1" />
                                    {status.label}
                                  </span>
                                  {app.issueUrgency === 'urgent' && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Urgent
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mb-1">
                                  ID: {app.applicationId}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Applied: {formatDate(app.appliedDate)}
                                </p>
                                {app.currentStatus === 'APPROVED' && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓ Issued on {formatDate(app.issuedDate)}
                                  </p>
                                )}
                                {app.currentStatus === 'CORRECTION_REQUIRED' && (
                                  <p className="text-xs text-orange-600 mt-1 flex items-start">
                                    <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-1">{app.correctionMessage}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">
                                {app.currentOfficeLevel} Office
                              </p>
                              {app.expectedCompletionDate && app.currentStatus !== 'APPROVED' && (
                                <p className="text-xs font-medium text-blue-600">
                                  Expected: {formatDate(app.expectedCompletionDate)}
                                </p>
                              )}
                              {app.currentStatus === 'CORRECTION_REQUIRED' && (
                                <button className="mt-2 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded flex items-center">
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Correct Now
                                </button>
                              )}
                              {app.currentStatus === 'APPROVED' && (
                                <button className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded flex items-center">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No applications found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications & Quick Actions - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
                    <PlusCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-blue-700">New Application</span>
                  </button>
                  <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
                    <Download className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-green-700">Download Certificate</span>
                  </button>
                  <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
                    <Search className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-orange-700">Track Application</span>
                  </button>
                  <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
                    <User className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <span className="text-xs font-medium text-purple-700">My Profile</span>
                  </button>
                </div>
              </div>

              {/* Notifications Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'correction' ? 'bg-orange-100' :
                          notification.type === 'success' ? 'bg-green-100' :
                          notification.type === 'status' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {notification.type === 'correction' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {notification.type === 'status' && <RefreshCw className="w-4 h-4 text-yellow-600" />}
                          {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>

              {/* Recently Approved */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Recently Approved
                </h3>
                <div className="space-y-3">
                  {mockApplications
                    .filter(app => app.currentStatus === 'APPROVED')
                    .slice(0, 2)
                    .map(app => (
                      <div key={app._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {app.certificateType} Certificate
                          </p>
                          <p className="text-xs text-gray-500">
                            Issued: {formatDate(app.issuedDate)}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Detail Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Application Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {selectedApplication.applicationId}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Status & Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Certificate Type</p>
                      <p className="font-medium text-gray-900">
                        {selectedApplication.certificateType} Certificate
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Current Status</p>
                      {(() => {
                        const status = getStatusBadge(selectedApplication.currentStatus);
                        const StatusIcon = status.icon;
                        return (
                          <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Timeline & Officer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Applied On</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(selectedApplication.appliedDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Current Office</p>
                      <p className="font-medium text-gray-900">
                        {selectedApplication.currentOfficeLevel} Office
                      </p>
                    </div>
                  </div>

                  {/* Assigned Officer */}
                  {selectedApplication.assignedTo && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Assigned Officer</p>
                      <p className="font-medium text-gray-900">
                        {selectedApplication.assignedTo.name} ({selectedApplication.assignedTo.role})
                      </p>
                    </div>
                  )}

                  {/* Correction Message */}
                  {selectedApplication.currentStatus === 'CORRECTION_REQUIRED' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-orange-800 mb-1">Correction Required</p>
                          <p className="text-sm text-orange-700">
                            {selectedApplication.correctionMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {selectedApplication.currentStatus === 'REJECTED' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-800 mb-1">Rejection Reason</p>
                          <p className="text-sm text-red-700">
                            {selectedApplication.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <p className="font-medium text-gray-900 mb-3">Uploaded Documents</p>
                    <div className="space-y-2">
                      {selectedApplication.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">{doc.documentType}</span>
                            {doc.isVerified && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                            {doc.isRejected && (
                              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                Rejected
                              </span>
                            )}
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    {selectedApplication.currentStatus === 'CORRECTION_REQUIRED' && (
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium flex items-center justify-center">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Correct & Resubmit
                      </button>
                    )}
                    {selectedApplication.currentStatus === 'APPROVED' && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </button>
                    )}
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-medium flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </button>
                    <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded font-medium">
                      Track Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
