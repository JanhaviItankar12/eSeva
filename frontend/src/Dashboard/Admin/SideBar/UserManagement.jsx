import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Unlock,
  Lock,
  Key,
  UserMinus,
  XCircle,
  CheckCircle,
  AlertCircle,
  Save,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  useActivateOfficerMutation,
  useCreateOfficerMutation, 
  useDeactivateOfficerMutation, 
  useGetAllOfficersQuery,
  useGetExpiredPasswordUsersQuery,
  useLockOfficerMutation,
  useResetPasswordMutation,
  useUnlockOfficerMutation,
  useUpdateOfficerMutation,
  
} from '../../../features/api/adminApi';
import {
  useGetActiveDistrictsQuery,
  useGetActiveTehsilsQuery,
  useGetActiveGramPanchayatsQuery
} from '../../../features/api/officeApi';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expiredUserIds, setExpiredUserIds] = useState(new Set());
  const [lockReason, setLockReason] = useState('');

  // API Hooks
  const [createOfficer, { isLoading: isCreating }] = useCreateOfficerMutation();
  const [updateOfficer, { isLoading: isUpdating }] = useUpdateOfficerMutation();
  const [lockOfficer, { isLoading: isLocking }] = useLockOfficerMutation();
  const [unlockOfficer, { isLoading: isUnlocking }] = useUnlockOfficerMutation();
  const [deactivateOfficer, { isLoading: isDeactivating }] = useDeactivateOfficerMutation();
  const [activateOfficer, { isLoading: isActivating }] = useActivateOfficerMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  
  const { data: officersData, isLoading: isLoadingOfficers, refetch: refetchOfficers } = useGetAllOfficersQuery();
  const { 
    data: expiredOfficersData, 
    isLoading: isLoadingExpiredOfficers,
    refetch: refetchExpiredOfficers 
  } = useGetExpiredPasswordUsersQuery();

  // Office selection state
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');

  // Fetch offices based on selections
  const { data: districtsData, isLoading: isLoadingDistricts } = useGetActiveDistrictsQuery();
  const { data: tehsilsData, isLoading: isLoadingTehsils } = useGetActiveTehsilsQuery(selectedDistrict, {
    skip: !selectedDistrict
  });
  const { data: gramPanchayatsData, isLoading: isLoadingGramPanchayats } = useGetActiveGramPanchayatsQuery(selectedTehsil, {
    skip: !selectedTehsil
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    employeeId: '',
    office: '',
  });
  
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Get officers data
  const officers = officersData?.data || [];
  const expiredOfficers = expiredOfficersData?.data || [];

  // Get unique roles from officers data for filter dropdown
  const uniqueRoles = ['all', ...new Set(officers.map(officer => officer.role).filter(Boolean))];
  
  // Get unique statuses from officers data for filter dropdown
  const getStatusFromUser = (user) => {
    if (!user.isActive) return 'inactive';
    if (user.locked) return 'locked';
    return 'active';
  };
  
  const uniqueStatuses = ['all', ...new Set(officers.map(user => getStatusFromUser(user)))];

  // Update expired user IDs when expired officers data changes
  useEffect(() => {
    if (expiredOfficers.length > 0) {
      const expiredIds = new Set(expiredOfficers.map(officer => officer._id));
      setExpiredUserIds(expiredIds);
    } else {
      setExpiredUserIds(new Set());
    }
  }, [expiredOfficers]);

  // Check if password is expired using API data
  const isPasswordExpired = (user) => {
    return expiredUserIds.has(user._id);
  };

  // Filter users
  const filteredUsers = officers.filter(user => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.employeeId?.toLowerCase().includes(searchLower) ||
        user.office?.officeName?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // Role filter
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    
    // Status filter
    if (filterStatus !== 'all') {
      const status = getUserStatus(user);
      if (status !== filterStatus) return false;
    }
    
    // Expired only filter - use the Set for O(1) lookup
    if (showExpiredOnly && !expiredUserIds.has(user._id)) return false;
    
    return true;
  });

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'locked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get user status
  const getUserStatus = (user) => {
    if (!user.isActive) return 'inactive';
    if (user.locked) return 'locked';
    return 'active';
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'COLLECTOR': 'bg-indigo-100 text-indigo-800',
      'DISTRICT_CLERK': 'bg-blue-100 text-blue-800',
      'TEHSILDAR': 'bg-cyan-100 text-cyan-800',
      'TEHSIL_CLERK': 'bg-sky-100 text-sky-800',
      'SARPANCH': 'bg-green-100 text-green-800',
      'GRAM_SEVAK': 'bg-emerald-100 text-emerald-800',
      'CITIZEN': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return '';
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    // Office validation based on role
    if (formData.role && !['ADMIN', 'CITIZEN'].includes(formData.role)) {
      if (!formData.office) {
        newErrors.office = 'Office selection is required';
      }
    }

    if (formData.role && !['ADMIN', 'CITIZEN'].includes(formData.role) && !formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required for officers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset dependent fields when role changes
    if (name === 'role') {
      setSelectedDistrict('');
      setSelectedTehsil('');
      setSelectedGramPanchayat('');
      setFormData(prev => ({ ...prev, office: '' }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle office selection
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedTehsil('');
    setSelectedGramPanchayat('');
    setFormData(prev => ({ ...prev, office: districtId }));
  };

  const handleTehsilChange = (e) => {
    const tehsilId = e.target.value;
    setSelectedTehsil(tehsilId);
    setSelectedGramPanchayat('');
    setFormData(prev => ({ ...prev, office: tehsilId }));
  };

  const handleGramPanchayatChange = (e) => {
    const gpId = e.target.value;
    setSelectedGramPanchayat(gpId);
    setFormData(prev => ({ ...prev, office: gpId }));
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await createOfficer(formData).unwrap();
      
      showToastMessage(`Officer created successfully! Temporary password has been sent to ${formData.email}`, 'success');

      setShowCreateModal(false);
      resetForm();
      await refetchOfficers();
      await refetchExpiredOfficers();

    } catch (error) {
      if (error.data?.field) {
        setErrors({
          [error.data.field]: error.data.message
        });
      } else {
        setErrors({
          submit: error?.data?.message || 'Failed to create officer'
        });
      }
    }
  };

  // Handle edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateOfficer({
        id: selectedUser._id,
        ...formData
      }).unwrap();
      
      showToastMessage(`User ${formData.name} updated successfully!`, 'success');

      setShowEditModal(false);
      resetForm();
      setSelectedUser(null);
      await refetchOfficers();
      await refetchExpiredOfficers();

    } catch (error) {
      setErrors({ submit: error?.data?.message || 'Failed to update user. Please try again.' });
    }
  };

  // Handle lock user with reason
  const handleLockUser = async () => {
    if (!lockReason.trim()) {
      setErrors({ lockReason: 'Lock reason is required' });
      return;
    }

    try {
      await lockOfficer({ 
        id: selectedUser._id, 
        reason: lockReason 
      }).unwrap();
      
      showToastMessage(`User ${selectedUser.name} locked successfully!`, 'success');

      setShowLockModal(false);
      setLockReason('');
      setSelectedUser(null);
      
      // Force refetch to update the UI
      await refetchOfficers();
      await refetchExpiredOfficers();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to lock user', 'error');
    }
  };

  // Handle unlock user
  const handleUnlockUser = async (user) => {
    try {
      await unlockOfficer(user._id).unwrap();
      showToastMessage(`User ${user.name} unlocked successfully!`, 'success');
      
      // Force refetch to update the UI
      await refetchOfficers();
      await refetchExpiredOfficers();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to unlock user', 'error');
    }
  };

  // Handle deactivate/activate user
  const handleToggleActive = async (user) => {
    try {
      if (user.isActive) {
        await deactivateOfficer(user._id).unwrap();
        showToastMessage(`User ${user.name} deactivated successfully!`, 'success');
      } else {
        await activateOfficer(user._id).unwrap();
        showToastMessage(`User ${user.name} activated successfully!`, 'success');
      }
      
      // Force refetch to update the UI
      await refetchOfficers();
      await refetchExpiredOfficers();
    } catch (error) {
      showToastMessage(error?.data?.message || `Failed to ${user.isActive ? 'deactivate' : 'activate'} user`, 'error');
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    try {
      await resetPassword(selectedUser._id).unwrap();
      
      showToastMessage(`Password reset for ${selectedUser.name}. Temporary password sent to their email.`, 'success');

      setShowResetPasswordModal(false);
      setSelectedUser(null);
      
      // Force refetch to update the UI
      await refetchOfficers();
      await refetchExpiredOfficers();

    } catch (error) {
      setErrors({ reset: error?.data?.message || 'Failed to reset password. Please try again.' });
    }
  };

  // Handle filter by role click - PREVENT EVENT PROPAGATION
  const handleRoleClick = (e, role) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterRole(role);
  };

  // Handle filter by status click - PREVENT EVENT PROPAGATION
  const handleStatusClick = (e, status) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterStatus(status);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: '',
      employeeId: '',
      office: '',
    });
    setSelectedDistrict('');
    setSelectedTehsil('');
    setSelectedGramPanchayat('');
    setErrors({});
  };

  // Open edit modal with pre-filled data
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      role: user.role,
      employeeId: user.employeeId || '',
      office: user.office?._id || '',
    });
    
    // Auto-populate office hierarchy based on user's office
    if (user.office) {
      if (user.office.officeLevel === 'DISTRICT') {
        setSelectedDistrict(user.office._id);
      } else if (user.office.officeLevel === 'TEHSIL') {
        setSelectedDistrict(user.office.parentOffice?._id);
        setSelectedTehsil(user.office._id);
      } else if (user.office.officeLevel === 'GRAM') {
        setSelectedDistrict(user.office.parentOffice?.parentOffice?._id);
        setSelectedTehsil(user.office.parentOffice?._id);
        setSelectedGramPanchayat(user.office._id);
      }
    }
    
    setShowEditModal(true);
  };

  // Open lock modal
  const openLockModal = (user) => {
    setSelectedUser(user);
    setLockReason('');
    setErrors({});
    setShowLockModal(true);
  };

  // Count expired users from API data
  const expiredUsersCount = expiredOfficers.length;

  // Show loading state for expired data
  const isLoading = isLoadingOfficers || isLoadingExpiredOfficers;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-18 right-5 z-50 px-4 py-3 rounded-lg shadow-lg 
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
        <h1 className="text-2xl font-bold text-gray-900">Officer Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create New Officer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Role Filter - Dynamic from backend data */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.filter(role => role !== 'all').map(role => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
          
          {/* Status Filter - Dynamic from backend data */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {uniqueStatuses.filter(status => status !== 'all').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          {/* Expired Password Filter */}
          <button
            onClick={() => setShowExpiredOnly(!showExpiredOnly)}
            disabled={isLoadingExpiredOfficers}
            className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center ${
              showExpiredOnly 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
            } ${isLoadingExpiredOfficers ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Password Expired
            {expiredUsersCount > 0 && !showExpiredOnly && (
              <span className="ml-2 bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs">
                {expiredUsersCount}
              </span>
            )}
            {isLoadingExpiredOfficers && (
              <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Expired Users Summary */}
      {expiredUsersCount > 0 && !showExpiredOnly && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                <strong>{expiredUsersCount}</strong> officer(s) have expired passwords and need to reset them.
              </span>
            </div>
            <button
              onClick={() => setShowExpiredOnly(true)}
              className="text-sm text-yellow-700 hover:text-yellow-900 font-medium underline"
            >
              View Expired
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading officers...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Officer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => {
                    const status = getUserStatus(user);
                    const passwordExpired = expiredUserIds.has(user._id);
                    return (
                      <tr key={user._id} className={`hover:bg-gray-50 ${passwordExpired ? 'bg-yellow-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              {user.mobile && (
                                <p className="text-xs text-gray-400 mt-1">{user.mobile}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => handleRoleClick(e, user.role)}
                            className={`text-xs px-2 py-1 rounded-full hover:opacity-80 transition-opacity cursor-pointer ${getRoleColor(user.role)}`}
                            title={`Click to filter by ${formatRole(user.role)}`}
                          >
                            {formatRole(user.role)}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{user.office?.officeName || '-'}</p>
                          {user.office?.officeLevel && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">{user.office.officeLevel.toLowerCase()}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.employeeId || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => handleStatusClick(e, status)}
                            className={`text-xs px-2 py-1 rounded-full hover:opacity-80 transition-opacity cursor-pointer ${getStatusColor(status)}`}
                            title={`Click to filter by ${status} users`}
                          >
                            {status.toUpperCase()}
                          </button>
                          {user.lockReason && user.locked && (
                            <p className="text-xs text-gray-500 mt-1" title={user.lockReason}>
                              Reason: {user.lockReason.substring(0, 20)}...
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-6 py-4">
                          {passwordExpired ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center w-fit">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Expired
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>
                            
                            {/* Lock/Unlock button - Always show based on user.locked status */}
                            {user.locked ? (
                              <button
                                onClick={() => handleUnlockUser(user)}
                                disabled={isUnlocking}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Unlock User"
                              >
                                <Unlock className="w-4 h-4 text-green-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => openLockModal(user)}
                                disabled={isLocking}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Lock User"
                              >
                                <Lock className="w-4 h-4 text-yellow-500" />
                              </button>
                            )}

                            {/* Show reset icon ONLY for expired passwords */}
                            {passwordExpired && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowResetPasswordModal(true);
                                }}
                                disabled={isResetting}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-yellow-600"
                                title="Password Expired - Reset Required"
                              >
                                <Key className="w-4 h-4 text-yellow-600" />
                              </button>
                            )}

                            {user.isActive ? (
                              <button
                                onClick={() => handleToggleActive(user)}
                                disabled={isDeactivating || isActivating}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Deactivate User"
                              >
                                <UserMinus className="w-4 h-4 text-red-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleActive(user)}
                                disabled={isDeactivating || isActivating}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Activate User"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No officers found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                {(filterRole !== 'all' || filterStatus !== 'all' || showExpiredOnly) && (
                  <button
                    onClick={() => {
                      setFilterRole('all');
                      setFilterStatus('all');
                      setShowExpiredOnly(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Officer</h2>
                <p className="text-sm text-gray-500 mt-1">Add a new officer to the system</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="user@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        maxLength="10"
                        className={`w-full pl-12 pr-3 py-2 text-sm border rounded-lg ${
                          errors.mobile ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.employeeId ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="EMP001"
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-xs text-red-600">{errors.employeeId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Role & Assignment</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Role</option>
                      <option value="COLLECTOR">Collector</option>
                      <option value="DISTRICT_CLERK">District Clerk</option>
                      <option value="TEHSILDAR">Tehsildar</option>
                      <option value="TEHSIL_CLERK">Tehsil Clerk</option>
                      <option value="SARPANCH">Sarpanch</option>
                      <option value="GRAM_SEVAK">Gram Sevak</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                    )}
                  </div>

                  {formData.role && !['ADMIN', 'CITIZEN'].includes(formData.role) && (
                    <div className="space-y-4">
                      {/* District Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select District</option>
                          {districtsData?.data?.map(district => (
                            <option key={district._id} value={district._id}>
                              {district.officeName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tehsil Selection for Tehsil and Gram level roles */}
                      {['TEHSILDAR', 'TEHSIL_CLERK', 'SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tehsil <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedTehsil}
                            onChange={handleTehsilChange}
                            disabled={!selectedDistrict || isLoadingTehsils}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                          >
                            <option value="">Select Tehsil</option>
                            {tehsilsData?.data?.map(tehsil => (
                              <option key={tehsil._id} value={tehsil._id}>
                                {tehsil.officeName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Gram Panchayat Selection for Gram level roles */}
                      {['SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Gram Panchayat <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedGramPanchayat}
                            onChange={handleGramPanchayatChange}
                            disabled={!selectedTehsil || isLoadingGramPanchayats}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                          >
                            <option value="">Select Gram Panchayat</option>
                            {gramPanchayatsData?.data?.map(gp => (
                              <option key={gp._id} value={gp._id}>
                                {gp.officeName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Officer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Officer</h2>
                <p className="text-sm text-gray-500 mt-1">Update officer information</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="user@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-gray-500">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        maxLength="10"
                        className={`w-full pl-12 pr-3 py-2 text-sm border rounded-lg ${
                          errors.mobile ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.employeeId ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="EMP001"
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-xs text-red-600">{errors.employeeId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Role & Assignment</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Role</option>
                      <option value="COLLECTOR">Collector</option>
                      <option value="DISTRICT_CLERK">District Clerk</option>
                      <option value="TEHSILDAR">Tehsildar</option>
                      <option value="TEHSIL_CLERK">Tehsil Clerk</option>
                      <option value="SARPANCH">Sarpanch</option>
                      <option value="GRAM_SEVAK">Gram Sevak</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                    )}
                  </div>

                  {formData.role && !['ADMIN', 'CITIZEN'].includes(formData.role) && (
                    <div className="space-y-4">
                      {/* District Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select District</option>
                          {districtsData?.data?.map(district => (
                            <option key={district._id} value={district._id}>
                              {district.officeName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tehsil Selection for Tehsil and Gram level roles */}
                      {['TEHSILDAR', 'TEHSIL_CLERK', 'SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tehsil <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedTehsil}
                            onChange={handleTehsilChange}
                            disabled={!selectedDistrict || isLoadingTehsils}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                          >
                            <option value="">Select Tehsil</option>
                            {tehsilsData?.data?.map(tehsil => (
                              <option key={tehsil._id} value={tehsil._id}>
                                {tehsil.officeName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Gram Panchayat Selection for Gram level roles */}
                      {['SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Gram Panchayat <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedGramPanchayat}
                            onChange={handleGramPanchayatChange}
                            disabled={!selectedTehsil || isLoadingGramPanchayats}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                          >
                            <option value="">Select Gram Panchayat</option>
                            {gramPanchayatsData?.data?.map(gp => (
                              <option key={gp._id} value={gp._id}>
                                {gp.officeName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Officer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lock User Modal */}
      {/* Lock/Unlock User Modal */}
{showLockModal && selectedUser && (
  
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-md w-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {selectedUser.isLocked ? 'Unlock User Account' : 'Lock User Account'}
        </h2>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            selectedUser.isLocked ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {selectedUser.isLocked ? (
              <Unlock className="w-8 h-8 text-green-600" />
            ) : (
              <Lock className="w-8 h-8 text-yellow-600" />
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 mb-4">
          {selectedUser.isLocked ? 'Unlock account for' : 'Lock account for'} 
          <span className="font-medium"> {selectedUser.name}</span>
        </p>

        {selectedUser.isLocked ? (
          /* Unlock Confirmation - No reason needed */
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                This user is currently locked. Unlocking will restore their access to the system.
              </p>
            </div>
            
            {selectedUser.lockReason && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Original lock reason:</p>
                <p className="text-sm text-gray-700">{selectedUser.lockReason}</p>
              </div>
            )}
          </>
        ) : (
          /* Lock with Reason */
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Reason for locking <span className="text-red-500">*</span>
              </label>
              <textarea
                value={lockReason}
                onChange={(e) => {
                  setLockReason(e.target.value);
                  if (errors.lockReason) {
                    setErrors(prev => ({ ...prev, lockReason: '' }));
                  }
                }}
                rows="3"
                className={`w-full px-3 py-2 text-sm border rounded-lg ${
                  errors.lockReason ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter reason for locking this account..."
              />
              {errors.lockReason && (
                <p className="mt-1 text-xs text-red-600">{errors.lockReason}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                Locking this account will prevent the user from accessing the system until unlocked.
              </p>
            </div>
          </>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowLockModal(false);
              setLockReason('');
              setSelectedUser(null);
              setErrors({});
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          {selectedUser.isLocked ? (
            /* Unlock Button */
            <button
              onClick={() => handleUnlockUser(selectedUser)}
              disabled={isUnlocking}
              className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isUnlocking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock Account
                </>
              )}
            </button>
          ) : (
            /* Lock Button */
            <button
              onClick={handleLockUser}
              disabled={isLocking}
              className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
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
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <p className="text-center text-gray-600 mb-2">
                Reset password for <span className="font-medium">{selectedUser.name}</span>
              </p>
              <p className="text-center text-sm text-gray-500 mb-6">
                A temporary password will be generated and sent to {selectedUser.email}
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  The user will need to change this password on their next login.
                </p>
              </div>

              {errors.reset && (
                <p className="text-sm text-red-600 mb-4">{errors.reset}</p>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;