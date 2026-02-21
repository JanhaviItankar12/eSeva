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
  Phone,
  Loader,
  Share2,
  Bell,
  Navigation,
  MessageCircle // WhatsApp icon
} from 'lucide-react';
import { useGetDatafortrackApplicationQuery, useGetSMSStatusQuery, useGetWhatsappStatusQuery, useSubscribeToSMSMutation, useSubscribeToWhatsappMutation, useUnsubscribeTOSMSMutation, useUnsubscribeTOWhatsappMutation } from '../../features/api/citizenApi';


// Certificate type mapping
const certificateTypeNames = {
  'BIRTH': 'Birth Certificate',
  'RESIDENCE': 'Residence Certificate',
  'INCOME': 'Income Certificate',
  'CASTE': 'Caste Certificate',
  'DOMICILE': 'Domicile Certificate'
};

const certificateIcons = {
  'BIRTH': '👶',
  'RESIDENCE': '🏠',
  'INCOME': '💰',
  'CASTE': '👤',
  'DOMICILE': '📍'
};

// Role display names
const roleNames = {
  'GRAM_SEVAK': 'Gram Sevak',
  'SARPANCH': 'Sarpanch',
  'TEHSIL_CLERK': 'Tehsil Clerk',
  'TEHSILDAR': 'Tehsildar',
  'DISTRICT_CLERK': 'District Clerk',
  'COLLECTOR': 'Collector'
};

const statusConfig = {
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
  'RE_VERIFY': {
    color: 'bg-purple-100 text-purple-800',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    icon: RefreshCw,
    label: 'Re-verify',
    progress: 40
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

const timelineStatusConfig = {
  'COMPLETED': {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  'IN_PROGRESS': {
    icon: RefreshCw,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  'PENDING': {
    icon: Clock,
    color: 'text-gray-400',
    bg: 'bg-gray-100'
  }
};

// Helper to mask mobile number
const maskMobile = (mobile) => {
  if (!mobile) return null;
  return mobile.slice(0, 2) + '*****' + mobile.slice(-3);
};

export default function TrackApplication() {
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState('');
  const [trackedAppId, setTrackedAppId] = useState(null);
  const [showTimeline, setShowTimeline] = useState(true);

  // RTK Query hooks
  const { 
    data: application, 
    isLoading, 
    error, 
    refetch 
  } = useGetDatafortrackApplicationQuery(trackedAppId, {
    skip: !trackedAppId,
  });

  // Get SMS subscription status
  const { 
    data: smsStatus, 
    isLoading: isSmsStatusLoading,
    refetch: refetchSmsStatus 
  } = useGetSMSStatusQuery(trackedAppId, {
    skip: !trackedAppId,
  });

  // Get Whatsapp subscription status
  const { 
    data: whatsappStatus, 
    isLoading: isWhatsappStatusLoading,
    refetch: refetchWhatsappStatus 
  } = useGetWhatsappStatusQuery(trackedAppId, {
    skip: !trackedAppId,
  });

  // Subscribe/Unsubscribe mutations
  const [subscribeToSMS, { isLoading: isSmsSubscribing }] = useSubscribeToSMSMutation();
  const [unsubscribeFromSMS, { isLoading: isSmsUnsubscribing }] = useUnsubscribeTOSMSMutation();

  const [subscribeToWhatsapp, { isLoading: isWhatsappSubscribing }] = useSubscribeToWhatsappMutation();
  const [unsubscribeTOWhatsapp, { isLoading: isWhatsappUnsubscribing }] = useUnsubscribeTOWhatsappMutation();

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackedAppId(searchInput.trim());
    }
  };

  // Clear current application
  const handleClear = () => {
    setTrackedAppId(null);
    setSearchInput('');
  };

  // Handle SMS subscribe
  const handleSmsSubscribe = async (applicationId) => {
    try {
      await subscribeToSMS(applicationId).unwrap();
      alert('✅ SMS updates enabled successfully!');
      refetchSmsStatus(); // Refresh status
    } catch (error) {
      alert(error.data?.message || 'Failed to subscribe to SMS');
    }
  };

  // Handle SMS unsubscribe
  const handleSmsUnsubscribe = async (applicationId) => {
    try {
      await unsubscribeFromSMS(applicationId).unwrap();
      alert('❌ SMS updates disabled');
      refetchSmsStatus(); // Refresh status
    } catch (error) {
      console.log(error.data?.message);
      alert(error.data?.message || 'Failed to unsubscribe from SMS');
    }
  };

  // Handle WhatsApp subscribe
  const handleWhatsappSubscribe = async (applicationId) => {
    try {
      await subscribeToWhatsapp(applicationId).unwrap();
      alert('✅ WhatsApp updates enabled successfully!');
      refetchWhatsappStatus(); // Refresh status
    } catch (error) {
      alert(error.data?.message || 'Failed to subscribe to WhatsApp');
    }
  };

  // Handle WhatsApp unsubscribe
  const handleWhatsappUnsubscribe = async (applicationId) => {
    try {
      await unsubscribeTOWhatsapp(applicationId).unwrap();
      alert('❌ WhatsApp updates disabled');
      refetchWhatsappStatus(); // Refresh status
    } catch (error) {
      alert(error.data?.message || 'Failed to unsubscribe from WhatsApp');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    if (diffDays === 0) return 'Due today';
    return `${Math.abs(diffDays)} days overdue`;
  };

  // Get current office display
  const getCurrentOfficeDisplay = () => {
    if (!application) return '';
    
    switch(application.currentOfficeLevel) {
      case 'GRAM': return 'Gram Panchayat Office';
      case 'TEHSIL': return 'Tehsil Office';
      case 'DISTRICT': return 'District Office';
      default: return `${application.currentOfficeLevel} Office`;
    }
  };

  // Get timeline role display
  const getRoleDisplay = (role) => {
    return roleNames[role] || role.replace('_', ' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] pt-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Track Application</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Application ID (e.g., eSEVA/2026/IN/00123)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Track Application
                </>
              )}
            </button>
          </form>

          {/* Show clear button if tracking */}
          {trackedAppId && !isLoading && !error && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Tracking: <span className="font-mono font-medium">{trackedAppId}</span>
              </p>
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-6">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Application Not Found</h3>
            <p className="text-sm text-red-600 mb-4">{error.data?.message || error.message || 'Invalid Application ID'}</p>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Another ID
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600">Fetching application details...</p>
          </div>
        )}

        {/* No Tracking State */}
        {!trackedAppId && !isLoading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Your Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your Application ID above to track its status
            </p>
            <div className="text-xs text-gray-500">
              <p>Your Application ID looks like: <span className="font-mono">eSEVA/2026/IN/00123</span></p>
              <p className="mt-1">You can find it in your application confirmation email or SMS</p>
            </div>
          </div>
        )}

        {/* Application Details */}
        {application && !isLoading && !error && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`rounded-xl border p-6 ${
              application.currentStatus === 'APPROVED' ? 'bg-green-50 border-green-200' :
              application.currentStatus === 'REJECTED' ? 'bg-red-50 border-red-200' :
              application.currentStatus === 'CORRECTION_REQUIRED' ? 'bg-orange-50 border-orange-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    application.currentStatus === 'APPROVED' ? 'bg-green-200' :
                    application.currentStatus === 'REJECTED' ? 'bg-red-200' :
                    application.currentStatus === 'CORRECTION_REQUIRED' ? 'bg-orange-200' :
                    'bg-blue-200'
                  }`}>
                    {application.currentStatus === 'APPROVED' && <CheckCircle className="w-6 h-6 text-green-700" />}
                    {application.currentStatus === 'REJECTED' && <XCircle className="w-6 h-6 text-red-700" />}
                    {application.currentStatus === 'CORRECTION_REQUIRED' && <AlertTriangle className="w-6 h-6 text-orange-700" />}
                    {application.currentStatus === 'SUBMITTED' && <Clock className="w-6 h-6 text-blue-700" />}
                    {application.currentStatus === 'UNDER_VERIFICATION' && <RefreshCw className="w-6 h-6 text-blue-700" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {certificateTypeNames[application.certificateType]}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Application ID: {application.applicationId}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.currentStatus === 'APPROVED' ? 'bg-green-200 text-green-800' :
                        application.currentStatus === 'REJECTED' ? 'bg-red-200 text-red-800' :
                        application.currentStatus === 'CORRECTION_REQUIRED' ? 'bg-orange-200 text-orange-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {statusConfig[application.currentStatus]?.label}
                      </span>
                      {application.issueUrgency === 'urgent' && (
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(application.applicationId);
                    alert('Application ID copied!');
                  }}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Live Tracking Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Tracking
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Location */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Current Office</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getCurrentOfficeDisplay()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                      Level: {application.currentOfficeLevel}
                    </p>
                  </div>

                  {/* Expected Completion */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Expected Completion</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(application.expectedCompletionDate).split(',')[0]}
                    </p>
                    <p className={`text-sm mt-1 ${
                      getDaysRemaining(application.expectedCompletionDate)?.includes('overdue')
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {getDaysRemaining(application.expectedCompletionDate)}
                    </p>
                  </div>

                  {/* Applied Date */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Applied On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(application.appliedDate).split(',')[0]}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(application.appliedDate).split(',')[1]}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      {statusConfig[application.currentStatus]?.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        application.currentStatus === 'APPROVED' ? 'bg-green-500' :
                        application.currentStatus === 'REJECTED' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${statusConfig[application.currentStatus]?.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jurisdiction Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                Jurisdiction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Village</p>
                  <p className="text-sm font-medium text-gray-900">
                    {application.jurisdiction?.village}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tehsil</p>
                  <p className="text-sm font-medium text-gray-900">
                    {application.jurisdiction?.tehsil}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">District</p>
                  <p className="text-sm font-medium text-gray-900">
                    {application.jurisdiction?.district}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div 
                className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTimeline(!showTimeline)}
              >
                <h3 className="text-md font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" />
                  Approval Timeline
                </h3>
                <ChevronRight className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  showTimeline ? 'rotate-90' : ''
                }`} />
              </div>

              {showTimeline && (
                <div className="p-6">
                  <div className="space-y-4">
                    {application.approvalTimeline?.map((step, index) => {
                      const StepIcon = timelineStatusConfig[step.status]?.icon || Clock;
                      
                      return (
                        <div key={index} className="flex items-start">
                          <div className="relative flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              timelineStatusConfig[step.status]?.bg || 'bg-gray-100'
                            }`}>
                              <StepIcon className={`w-4 h-4 ${
                                timelineStatusConfig[step.status]?.color || 'text-gray-500'
                              }`} />
                            </div>
                            {index < application.approvalTimeline.length - 1 && (
                              <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {getRoleDisplay(step.level)}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                step.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                step.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {step.status}
                              </span>
                            </div>
                            
                            {step.updatedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(step.updatedAt)}
                              </p>
                            )}
                            
                            {step.remark && (
                              <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                {step.remark}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Documents Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                Document Status
              </h3>
              <div className="space-y-3">
                {application.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Correction Required Section */}
            {application.correctionRequired?.isRequired && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-md font-semibold text-orange-800 mb-2">
                      Correction Required
                    </h4>
                    <p className="text-sm text-orange-700 mb-4">
                      {application.correctionRequired.reason}
                    </p>
                    <button
                      onClick={() => navigate(`/citizen/correct-application/${application.applicationId}`)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Correct & Resubmit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Details */}
            {application.rejectionDetails?.isRejected && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-md font-semibold text-red-800 mb-2">
                      Application Rejected
                    </h4>
                    <p className="text-sm text-red-700">
                      {application.rejectionDetails.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Approved Section */}
            {application.currentStatus === 'APPROVED' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-md font-semibold text-green-800">
                        Certificate Approved
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your certificate is ready for download
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            )}

            
            {/* Communication Preferences Section */}
<div className="bg-white rounded-xl border border-gray-200 p-6">
  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
    <Bell className="w-5 h-5 mr-2 text-gray-500" />
    Communication Preferences
  </h3>
  
  <div className="space-y-4">
    {/* SMS Section */}
    {smsStatus && !isSmsStatusLoading && (
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className={`w-5 h-5 mr-3 ${
              smsStatus?.data?.isSubscribed ? 'text-green-600' : 'text-gray-500'
            }`} />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                SMS Updates
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Receive updates on {smsStatus?.data?.mobile || 'your mobile number'}
              </p>
            </div>
          </div>
          
          {smsStatus?.data?.isSubscribed ? (
            <button
              onClick={() => handleSmsUnsubscribe(application.applicationId)}
              disabled={isSmsUnsubscribing}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {isSmsUnsubscribing ? 'Disabling...' : 'Disable'}
            </button>
          ) : (
            <button
              onClick={() => handleSmsSubscribe(application.applicationId)}
              disabled={isSmsSubscribing}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSmsSubscribing ? 'Subscribing...' : 'Enable'}
            </button>
          )}
        </div>
      </div>
    )}

    {/* WhatsApp Section */}
    {whatsappStatus && !isWhatsappStatusLoading && (
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className={`w-5 h-5 mr-3 ${
              whatsappStatus?.data?.isSubscribed ? 'text-green-600' : 'text-gray-500'
            }`} />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                WhatsApp Updates
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Receive updates on {whatsappStatus?.data?.mobile || 'your mobile number'}
              </p>
            </div>
          </div>
          
          {whatsappStatus?.data?.isSubscribed ? (
            <button
              onClick={() => handleWhatsappUnsubscribe(application.applicationId)}
              disabled={isWhatsappUnsubscribing}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {isWhatsappUnsubscribing ? 'Disabling...' : 'Disable'}
            </button>
          ) : (
            <button
              onClick={() => handleWhatsappSubscribe(application.applicationId)}
              disabled={isWhatsappSubscribing}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isWhatsappSubscribing ? 'Subscribing...' : 'Enable'}
            </button>
          )}
        </div>
        
        {/* WhatsApp Benefits - Only show when not subscribed */}
        {!whatsappStatus?.data?.isSubscribed && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700 flex items-start">
              <MessageCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                ✨ Get instant updates on WhatsApp with real-time status notifications
              </span>
            </p>
          </div>
        )}
      </div>
    )}
  </div>
</div>
          </div>
        )}
      </div>
    </div>
  );
}