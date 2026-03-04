import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Unlock,
  Lock,
  Key,
  UserMinus,
  XCircle,
  CheckCircle,
  AlertCircle,
  Save,
  Mail,
  Phone,
  MapPin,
  Home,
  Building2,
  Globe
} from 'lucide-react';
import { useCreateOfficerMutation, useGetAllOfficersQuery } from '../../../features/api/adminApi';
import { useGetDistrictsQuery, useGetGramPanchayatsQuery, useGetTehsilsQuery } from '../../../features/api/officeApi';


const UserManagement = ({ users = [], onUserUpdate, onUserCreate, onUserDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // API Hooks
  const [createOfficer, { isLoading: isCreating }] = useCreateOfficerMutation();
  const { data: officersData, isLoading: isLoadingOfficers, refetch: refetchOfficers } = useGetAllOfficersQuery();
  
  // Office selection state
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState('');

  // Fetch offices based on selections
  const { data: districtsData, isLoading: isLoadingDistricts } = useGetDistrictsQuery();
  const { data: tehsilsData, isLoading: isLoadingTehsils } = useGetTehsilsQuery(selectedDistrict, {
    skip: !selectedDistrict
  });
  const { data: gramPanchayatsData, isLoading: isLoadingGramPanchayats } = useGetGramPanchayatsQuery(selectedTehsil, {
    skip: !selectedTehsil
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    employeeId: '',
    office: '', // This will store the office ID
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get officers data
  const OfficersData = officersData?.data || [];

  // Filter users
  const filteredUsers = OfficersData.filter(user => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.employeeId?.toLowerCase().includes(searchLower) ||
        user.office?.name?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    
    if (filterStatus !== 'all') {
      const status = user.isActive ? 'active' : 'inactive';
      if (status !== filterStatus) return false;
    }
    
    return true;
  });

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
    setFormData(prev => ({ ...prev, office: '' }));
  };

  const handleTehsilChange = (e) => {
    const tehsilId = e.target.value;
    setSelectedTehsil(tehsilId);
    setSelectedGramPanchayat('');
    setFormData(prev => ({ ...prev, office: '' }));
  };

  const handleGramPanchayatChange = (e) => {
    const gpId = e.target.value;
    setSelectedGramPanchayat(gpId);
    setFormData(prev => ({ ...prev, office: gpId }));
  };

  // Get available offices based on role and selections
  const getAvailableOffices = () => {
    if (!formData.role || ['ADMIN', 'CITIZEN'].includes(formData.role)) {
      return [];
    }

    const roleLevel = {
      COLLECTOR: 'DISTRICT',
      DISTRICT_CLERK: 'DISTRICT',
      TEHSILDAR: 'TEHSIL',
      TEHSIL_CLERK: 'TEHSIL',
      SARPANCH: 'GRAM',
      GRAM_SEVAK: 'GRAM'
    }[formData.role];

    if (roleLevel === 'DISTRICT') {
      return districtsData?.data || [];
    } else if (roleLevel === 'TEHSIL') {
      return tehsilsData?.data || [];
    } else if (roleLevel === 'GRAM') {
      return gramPanchayatsData?.data || [];
    }
    return [];
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await createOfficer(formData).unwrap();
      
      setSuccessMessage(`Officer created successfully! Temporary password has been sent to ${formData.email}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowCreateModal(false);
      resetForm();
      refetchOfficers(); // Refresh the list

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
      // Implement update mutation here
      setSuccessMessage(`User ${formData.name} updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowEditModal(false);
      resetForm();
      refetchOfficers();

    } catch (error) {
      setErrors({ submit: 'Failed to update user. Please try again.' });
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    try {
      // Implement reset password mutation here
      setSuccessMessage(`Password reset for ${selectedUser.name}. Temporary password sent to their email.`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowResetPasswordModal(false);
      setSelectedUser(null);

    } catch (error) {
      setErrors({ reset: 'Failed to reset password. Please try again.' });
    }
  };

  // Handle lock/unlock user
  const handleLockUser = async (user) => {
    try {
      // Implement lock/unlock mutation here
      const newLockedState = !user.locked;
      setSuccessMessage(`User ${user.name} ${newLockedState ? 'locked' : 'unlocked'} successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      refetchOfficers();

    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  // Handle deactivate/activate user
  const handleToggleActive = async (user) => {
    try {
      // Implement activate/deactivate mutation here
      const newActiveState = !user.isActive;
      setSuccessMessage(`User ${user.name} ${newActiveState ? 'activated' : 'deactivated'} successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      refetchOfficers();

    } catch (error) {
      console.error('Failed to update user status:', error);
    }
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

  // Open edit modal
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
    
    // Set selected office hierarchy based on user's office
    if (user.office) {
      if (user.office.officeLevel === 'DISTRICT') {
        setSelectedDistrict(user.office._id);
      } else if (user.office.officeLevel === 'TEHSIL') {
        setSelectedDistrict(user.office.parentDistrict?._id);
        setSelectedTehsil(user.office._id);
      } else if (user.office.officeLevel === 'GRAM') {
        setSelectedDistrict(user.office.parentTehsil?.parentDistrict?._id);
        setSelectedTehsil(user.office.parentTehsil?._id);
        setSelectedGramPanchayat(user.office._id);
      }
    }
    
    setShowEditModal(true);
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
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="COLLECTOR">Collector</option>
            <option value="DISTRICT_CLERK">District Clerk</option>
            <option value="TEHSILDAR">Tehsildar</option>
            <option value="TEHSIL_CLERK">Tehsil Clerk</option>
            <option value="SARPANCH">Sarpanch</option>
            <option value="GRAM_SEVAK">Gram Sevak</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="locked">Locked</option>
          </select>
          <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoadingOfficers ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map(user => {
                    const status = getUserStatus(user);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name?.split(' ').map(n => n[0]).join('')}
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
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                            {user.role?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{user.office?.name || '-'}</p>
                          {user.office?.officeLevel && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">{user.office.officeLevel.toLowerCase()}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.employeeId || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(user.lastLogin)}
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
                            
                            {user.locked ? (
                              <button
                                onClick={() => handleLockUser(user)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Unlock User"
                              >
                                <Unlock className="w-4 h-4 text-green-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLockUser(user)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Lock User"
                              >
                                <Lock className="w-4 h-4 text-yellow-500" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowResetPasswordModal(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Reset Password"
                            >
                              <Key className="w-4 h-4 text-blue-500" />
                            </button>

                            {user.isActive ? (
                              <button
                                onClick={() => handleToggleActive(user)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Deactivate User"
                              >
                                <UserMinus className="w-4 h-4 text-red-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleActive(user)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
                      {/* District Selection for all roles */}
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
                              {district.name}
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
                                {tehsil.name}
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
                                {gp.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Hidden office field */}
                      {formData.role === 'COLLECTOR' && selectedDistrict && (
                        <input type="hidden" name="office" value={selectedDistrict} />
                      )}
                      {['TEHSILDAR', 'TEHSIL_CLERK'].includes(formData.role) && selectedTehsil && (
                        <input type="hidden" name="office" value={selectedTehsil} />
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
                  disabled={isCreating}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? (
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