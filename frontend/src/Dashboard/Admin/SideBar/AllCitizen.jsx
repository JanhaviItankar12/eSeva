import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Download,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  FileText
} from 'lucide-react';
import { useGetAllCitizenQuery, useLockCitizenMutation, useUnlockCitizenMutation } from '../../../features/api/adminApi';

const ITEMS_PER_PAGE = 5;

const AllCitizen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLockStatus, setSelectedLockStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [lockError, setLockError] = useState('');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Fetch all citizens from backend
  const { 
    data: citizensResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAllCitizenQuery();

  // Lock/Unlock mutations
  const [lockCitizen, { isLoading: isLocking }] = useLockCitizenMutation();
  const [unlockCitizen, { isLoading: isUnlocking }] = useUnlockCitizenMutation();

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Get all citizens data
  const allCitizens = citizensResponse?.citizenData || [];

  // Function to format address based on priority: village -> tehsil -> district
  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    
    // Check in priority order
    if (address.village && address.village.trim() !== '') {
      return address.village;
    } else if (address.tehsil && address.tehsil.trim() !== '') {
      return address.tehsil;
    } else if (address.district && address.district.trim() !== '') {
      return address.district;
    } else {
      return 'No address provided';
    }
  };

  // Filter citizens based on search and filters
  const filterCitizens = (citizens) => {
    return citizens.filter(citizen => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          citizen.name?.toLowerCase().includes(searchLower) ||
          citizen.email?.toLowerCase().includes(searchLower) ||
          citizen.mobile?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const statusMatch = selectedStatus === 'active' 
          ? citizen.isActive === true 
          : citizen.isActive === false;
        if (!statusMatch) return false;
      }

      // Lock status filter
      if (selectedLockStatus !== 'all') {
        const lockMatch = selectedLockStatus === 'locked' 
          ? citizen.isLocked === true 
          : citizen.isLocked === false;
        if (!lockMatch) return false;
      }

      return true;
    });
  };

  const filteredCitizens = filterCitizens(allCitizens);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCitizens.length / ITEMS_PER_PAGE);
  const paginatedCitizens = filteredCitizens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedLockStatus]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive
      ? 'text-green-600 bg-green-100'
      : 'text-gray-600 bg-gray-100';
  };

  const getLockStatusColor = (isLocked) => {
    return isLocked
      ? 'text-red-600 bg-red-100'
      : 'text-green-600 bg-green-100';
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle lock citizen
  const handleLockCitizen = async () => {
    if (!lockReason.trim()) {
      setLockError('Please provide a reason for locking');
      return;
    }

    try {
      await lockCitizen({ 
        id: selectedCitizen._id, 
        reason: lockReason 
      }).unwrap();
      
      showToastMessage(`${selectedCitizen.name} has been locked successfully`, 'success');
      setShowLockModal(false);
      setLockReason('');
      setLockError('');
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Lock error:', error);
      showToastMessage(error?.data?.message || 'Failed to lock citizen', 'error');
    }
  };

  // Handle unlock citizen
  const handleUnlockCitizen = async (citizen) => {
    if (!window.confirm(`Are you sure you want to unlock ${citizen.name}?`)) {
      return;
    }

    try {
      await unlockCitizen(citizen._id).unwrap();
      showToastMessage(`${citizen.name} has been unlocked successfully`, 'success');
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Unlock error:', error);
      showToastMessage(error?.data?.message || 'Failed to unlock citizen', 'error');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Address', 'Status', 'Lock Status', 'Lock Reason', 'Registered On'];
    
    const csvData = filteredCitizens.map(citizen => [
      citizen.name,
      citizen.email,
      citizen.mobile,
      formatAddress(citizen.address),
      citizen.isActive ? 'Active' : 'Inactive',
      citizen.isLocked ? 'Locked' : 'Unlocked',
      citizen.lockReason || 'N/A',
      formatDate(citizen.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citizens_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToastMessage('Data exported successfully!', 'success');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading citizens data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load citizens</h3>
          <p className="text-gray-500 mb-4">{error?.data?.message || 'Something went wrong'}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-lg shadow-lg 
          flex items-center justify-between gap-4 animate-slide-down border
          ${toast.type === "success"
            ? "bg-green-100 border-green-700 text-green-800"
            : "bg-red-100 border-red-800 text-red-800"}`}
        >
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className={`text-lg font-bold hover:scale-110 transition-transform
              ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Total {allCitizens.length} citizens registered
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Citizens</p>
              <p className="text-2xl font-bold text-gray-900">{allCitizens.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {allCitizens.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">
                {allCitizens.filter(c => !c.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Locked</p>
              <p className="text-2xl font-bold text-red-600">
                {allCitizens.filter(c => c.isLocked).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unlocked</p>
              <p className="text-2xl font-bold text-green-600">
                {allCitizens.filter(c => !c.isLocked).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Unlock className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={selectedLockStatus}
            onChange={(e) => setSelectedLockStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Lock Status</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>

          {(searchTerm || selectedStatus !== 'all' || selectedLockStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedLockStatus('all');
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-2 text-sm text-gray-500">
          Showing {paginatedCitizens.length} of {filteredCitizens.length} citizens
        </div>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Citizen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lock Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCitizens.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No citizens found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedCitizens.map((citizen) => (
                <tr key={citizen._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {citizen.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{citizen.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {citizen.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {citizen.mobile}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        {formatAddress(citizen.address)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(citizen.isActive)}`}>
                      {citizen.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {citizen.isLocked ? (
                      <div className="space-y-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 block w-fit">
                          Locked
                        </span>
                        {citizen.lockReason && (
                          <div className="flex items-center text-xs text-gray-500">
                            <FileText className="w-3 h-3 mr-1" />
                            {citizen.lockReason.length > 30 
                              ? citizen.lockReason.substring(0, 30) + '...' 
                              : citizen.lockReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                        Unlocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">
                        {formatDate(citizen.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCitizen(citizen);
                          setShowViewModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {citizen.isLocked ? (
                        <button
                          onClick={() => handleUnlockCitizen(citizen)}
                          disabled={isUnlocking}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-green-600"
                          title="Unlock Citizen"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCitizen(citizen);
                            setShowLockModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                          title="Lock Citizen"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredCitizens.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCitizens.length)}
              </span>{' '}
              of <span className="font-medium">{filteredCitizens.length}</span> citizens
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Citizen Modal */}
      {showViewModal && selectedCitizen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Citizen Details</h2>
                <p className="text-sm text-gray-500 mt-1">Complete information about the citizen</p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCitizen(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCitizen.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm text-gray-900">{selectedCitizen.role}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedCitizen.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="text-sm text-gray-900">{selectedCitizen.mobile}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">
                      {selectedCitizen.address ? (
                        <>
                          {selectedCitizen.address.village && <div>Village: {selectedCitizen.address.village}</div>}
                          {selectedCitizen.address.tehsil && <div>Tehsil: {selectedCitizen.address.tehsil}</div>}
                          {selectedCitizen.address.district && <div>District: {selectedCitizen.address.district}</div>}
                        </>
                      ) : (
                        'No address provided'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Status Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCitizen.isActive)}`}>
                        {selectedCitizen.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getLockStatusColor(selectedCitizen.isLocked)}`}>
                        {selectedCitizen.isLocked ? 'Locked' : 'Unlocked'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedCitizen.isLocked && selectedCitizen.lockReason && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs font-medium text-red-800 mb-1">Lock Reason:</p>
                      <p className="text-sm text-red-700">{selectedCitizen.lockReason}</p>
                      {selectedCitizen.lockedAt && (
                        <p className="text-xs text-red-600 mt-1">
                          Locked on: {formatDate(selectedCitizen.lockedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Registered On</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedCitizen.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                {!selectedCitizen.isLocked ? (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setShowLockModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Citizen
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleUnlockCitizen(selectedCitizen);
                    }}
                    disabled={isUnlocking}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    {isUnlocking ? 'Unlocking...' : 'Unlock Citizen'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCitizen(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lock Citizen Modal */}
      {showLockModal && selectedCitizen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lock Citizen Account</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Provide a reason for locking {selectedCitizen.name}'s account
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLockModal(false);
                  setLockReason('');
                  setLockError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lock Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={lockReason}
                    onChange={(e) => {
                      setLockReason(e.target.value);
                      setLockError('');
                    }}
                    rows="4"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      lockError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter detailed reason for locking this account..."
                  />
                  {lockError && (
                    <p className="mt-1 text-xs text-red-600">{lockError}</p>
                  )}
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Locking this account will prevent the citizen from logging in and accessing their dashboard. They will see a message with the reason provided.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowLockModal(false);
                      setLockReason('');
                      setLockError('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLockCitizen}
                    disabled={isLocking}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLocking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Locking...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Lock Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCitizen;