import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Info,
  MapPin,
  Calendar,
  Filter,
  TrendingUp,
  Award,
  FileCheck,
  Hourglass,
  ArrowLeft
} from 'lucide-react';
import { useCitizenInfoQuery, useGetAllApplicationQuery } from '../../features/api/citizenApi';

// Mock Data based on your schemas
const mockCitizenData = {
  _id: "USER123",
  name: "Rajesh Kumar Sharma",
  email: "rajesh.k@example.com",
  mobile: "9876543210",
  role: "CITIZEN",
  address: {
    village: "Rajapur",
    tehsil: "Sadar",
    district: "Lucknow"
  },
  createdAt: "2025-01-15T10:30:00Z"
};



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

const getCertificateColor = (type) => {
  const colors = {
    'BIRTH': 'bg-pink-100 text-pink-600',
    'RESIDENCE': 'bg-green-100 text-green-600',
    'INCOME': 'bg-purple-100 text-purple-600',
    'CASTE': 'bg-orange-100 text-orange-600',
    'DOMICILE': 'bg-indigo-100 text-indigo-600'
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useGetAllApplicationQuery();
  const applicationsData = data?.citizenApplications || [];

  const { data: citizenData } = useCitizenInfoQuery();
  const citizen = citizenData?.citizen;

  const [applications, setApplications] = useState(applicationsData);
  const [notifications] = useState(mockNotifications);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    approved: 0,
    correction: 0,
    rejected: 0
  });

  // Calculate stats
  useEffect(() => {
    setStats({
      total: applications.length,
      inProgress: applications.filter(app => ['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus)).length,
      approved: applications.filter(app => app.currentStatus === 'APPROVED').length,
      correction: applications.filter(app => app.currentStatus === 'CORRECTION_REQUIRED').length,
      rejected: applications.filter(app => app.currentStatus === 'REJECTED').length
    });
  }, [applications]);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'inProgress') {
        if (!['SUBMITTED', 'UNDER_VERIFICATION'].includes(app.currentStatus)) return false;
      } else if (app.currentStatus !== filterStatus) {
        return false;
      }
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.applicationId.toLowerCase().includes(searchLower) ||
        app.certificateType.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (expectedDate) => {
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] pt-0">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {citizen.name.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {citizen.address.village}, {citizen.address.tehsil}, {citizen.address.district}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => navigate('/citizen/new-application')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Application
              </button>
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Hourglass className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Correction</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.correction}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications Section - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header with filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_VERIFICATION">Under Verification</option>
                      <option value="CORRECTION_REQUIRED">Correction Required</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div className="divide-y divide-gray-200">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => {
                    const status = getStatusBadge(app.currentStatus);
                    const StatusIcon = status.icon;
                    const certificateColor = getCertificateColor(app.certificateType);

                    return (
                      <div
                        key={app._id}
                        onClick={() => setSelectedApplication(app)}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 ${certificateColor} rounded-lg flex items-center justify-center text-xl`}>
                              {getCertificateIcon(app.certificateType)}
                            </div>
                            <div>
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <h3 className="font-medium text-gray-900">
                                  {app.certificateType} Certificate
                                </h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${status.color}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status.label}
                                </span>
                                {app.issueUrgency === 'urgent' && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-1">
                                ID: {app.applicationId}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Applied: {formatDate(app.appliedDate)}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {app.currentOfficeLevel}
                                </span>
                              </div>

                              {/* Correction Message Preview */}
                              {app.currentStatus === 'CORRECTION_REQUIRED' && app.correctionMessage && (
                                <p className="mt-2 text-xs text-orange-600 flex items-start">
                                  <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">{app.correctionMessage}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 md:mt-0 text-right">
                            {app.currentStatus === 'APPROVED' && app.expectedCompletionDate && (
                              <p className="text-xs text-green-600 mb-2">
                                ✓ Issued on {formatDate(app.issuedDate)}
                              </p>
                            )}
                            {app.currentStatus !== 'APPROVED' && app.currentStatus !== 'REJECTED' && app.expectedCompletionDate && (
                              <div className="mb-2">
                                <p className="text-xs text-gray-500">Expected by</p>
                                <p className="text-sm font-medium text-blue-600">
                                  {formatDate(app.expectedCompletionDate)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getDaysRemaining(app.expectedCompletionDate)} days remaining
                                </p>
                              </div>
                            )}

                            {/* Action Button */}
                            {app.currentStatus === 'CORRECTION_REQUIRED' && (
                              <button className="mt-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                                Correct Now
                              </button>
                            )}
                            {app.currentStatus === 'APPROVED' && (
                              <button className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-500 mb-6">Start your first application today</p>
                    <button
                      onClick={() => navigate('/citizen/new-application')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Submitted</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {applications.filter(a => a.currentStatus === 'SUBMITTED').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Under Verification</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {applications.filter(a => a.currentStatus === 'UNDER_VERIFICATION').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Correction Required</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {applications.filter(a => a.currentStatus === 'CORRECTION_REQUIRED').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Approved</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {applications.filter(a => a.currentStatus === 'APPROVED').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Rejected</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {applications.filter(a => a.currentStatus === 'REJECTED').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Approved */}
            {applications.filter(a => a.currentStatus === 'APPROVED').length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Certificates</h3>
                <div className="space-y-4">
                  {applications
                    .filter(a => a.currentStatus === 'APPROVED')
                    .slice(0, 3)
                    .map(app => (
                      <div key={app._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${getCertificateColor(app.certificateType)} rounded-lg flex items-center justify-center`}>
                            {getCertificateIcon(app.certificateType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {app.certificateType} Certificate
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(app.issuedDate)}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
                <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All Certificates
                </button>
              </div>
            )}

            {/* Notifications Panel */}
            {showNotificationPanel && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Mark all read
                  </button>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'correction' ? 'bg-orange-100' :
                            notification.type === 'success' ? 'bg-green-100' :
                              'bg-blue-100'
                          }`}>
                          {notification.type === 'correction' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {notification.type === 'status' && <RefreshCw className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
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
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate(`/citizen/new-application/${id}`)}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors"
                >
                  <PlusCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs font-medium text-blue-700">New Application</span>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                  <Download className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-xs font-medium text-green-700">Download Certificate</span>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors" onClick={() => navigate(`/citizen/track-applications/${id}`)}>
                  <Search className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs font-medium text-purple-700">Track Application</span>
                </button>
                <button
                  onClick={() => navigate(`/citizen/profile/${id}`)}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-colors"
                >
                  <User className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <span className="text-xs font-medium text-gray-700">My Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedApplication.applicationId}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Certificate Type</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <span className={`w-6 h-6 ${getCertificateColor(selectedApplication.certificateType)} rounded-lg flex items-center justify-center mr-2`}>
                      {getCertificateIcon(selectedApplication.certificateType)}
                    </span>
                    {selectedApplication.certificateType} Certificate
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Current Status</p>
                  {(() => {
                    const status = getStatusBadge(selectedApplication.currentStatus);
                    const StatusIcon = status.icon;
                    return (
                      <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${status.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {status.label}
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Applied On</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedApplication.appliedDate)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Current Office</p>
                  <p className="font-medium text-gray-900">
                    {selectedApplication.currentOfficeLevel} Office
                  </p>
                </div>
              </div>

              {/* Expected Date */}
              {selectedApplication.expectedCompletionDate && selectedApplication.currentStatus !== 'APPROVED' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Expected Completion</p>
                  <p className="font-medium text-blue-800">
                    {formatDate(selectedApplication.expectedCompletionDate)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {getDaysRemaining(selectedApplication.expectedCompletionDate)} days remaining
                  </p>
                </div>
              )}

              {/* Correction Message */}
              {selectedApplication.currentStatus === 'CORRECTION_REQUIRED' && selectedApplication.correctionMessage && (
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
              {selectedApplication.currentStatus === 'REJECTED' && selectedApplication.rejectionReason && (
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
                <h3 className="font-medium text-gray-900 mb-3">Uploaded Documents</h3>
                <div className="space-y-3">
                  {selectedApplication.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{doc.documentType}</span>
                        {doc.isVerified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                        {doc.isRejected && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedApplication.currentStatus === 'CORRECTION_REQUIRED' && (
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium flex items-center justify-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Correct & Resubmit
                  </button>
                )}
                {selectedApplication.currentStatus === 'APPROVED' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                )}
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium">
                  Track Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}