import { useState } from 'react';
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
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Home,
  Building2,
  Globe
} from 'lucide-react';

// Mock data for offices (in real app, fetch from API)
const mockOffices = {
  districts: [
    { id: "D001", name: "Lucknow" },
    { id: "D002", name: "Kanpur" },
    { id: "D003", name: "Agra" },
    { id: "D004", name: "Varanasi" }
  ],
  tehsils: {
    "Lucknow": [
      { id: "T001", name: "Sadar" },
      { id: "T002", name: "Malihabad" },
      { id: "T003", name: "Mohanlalganj" }
    ],
    "Kanpur": [
      { id: "T004", name: "Sadar" },
      { id: "T005", name: "Bilhaur" }
    ],
    "Agra": [
      { id: "T006", name: "Sadar" },
      { id: "T007", name: "Kiraoli" }
    ],
    "Varanasi": [
      { id: "T008", name: "Sadar" },
      { id: "T009", name: "Pindra" }
    ]
  },
  gramPanchayats: {
    "Sadar": [
      { id: "G001", name: "Rajapur" },
      { id: "G002", name: "Saidpur" },
      { id: "G003", name: "Gosaiganj" }
    ],
    "Malihabad": [
      { id: "G004", name: "Malihabad" },
      { id: "G005", name: "Kakori" }
    ]
  }
};

// Role hierarchy mapping
const roleLevels = {

  COLLECTOR: { level: 1, category: "district", canCreate: ["DISTRICT_CLERK", "TEHSILDAR", "TEHSIL_CLERK"] },
  DISTRICT_CLERK: { level: 2, category: "district", canCreate: ["TEHSILDAR", "TEHSIL_CLERK"] },
  TEHSILDAR: { level: 3, category: "tehsil", canCreate: ["TEHSIL_CLERK", "SARPANCH", "GRAM_SEVAK"] },
  TEHSIL_CLERK: { level: 4, category: "tehsil", canCreate: ["SARPANCH", "GRAM_SEVAK"] },
  SARPANCH: { level: 5, category: "gram", canCreate: ["GRAM_SEVAK"] },
  GRAM_SEVAK: { level: 6, category: "gram", canCreate: [] },
  
};

const UserManagement = ({ users = [], onUserUpdate, onUserCreate, onUserDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    officeLevel: '',
    district: '',
    tehsil: '',
    gramPanchayat: '',
    employeeId: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for demonstration
  const mockRecentUsers = users.length > 0 ? users : [
    {
      id: "USR001",
      name: "Ramesh Kumar",
      email: "ramesh.gram@eseva.gov.in",
      mobile: "9876543210",
      role: "GRAM_SEVAK",
      office: "Gram Panchayat Rajapur",
      district: "Lucknow",
      tehsil: "Sadar",
      gramPanchayat: "Rajapur",
      status: "active",
      lastLogin: "2026-02-21T10:30:00Z",
      employeeId: "EMP001",
      createdAt: "2025-01-15T10:30:00Z"
    },
    {
      id: "USR002",
      name: "Priya Singh",
      email: "priya.tehsil@eseva.gov.in",
      mobile: "9876543211",
      role: "TEHSIL_CLERK",
      office: "Tehsil Sadar",
      district: "Lucknow",
      tehsil: "Sadar",
      status: "active",
      lastLogin: "2026-02-21T09:45:00Z",
      employeeId: "EMP002",
      createdAt: "2025-02-10T09:30:00Z"
    },
    {
      id: "USR003",
      name: "Amit Sharma",
      email: "amit.district@eseva.gov.in",
      mobile: "9876543212",
      role: "DISTRICT_CLERK",
      office: "District Lucknow",
      district: "Lucknow",
      status: "locked",
      lastLogin: "2026-02-20T16:20:00Z",
      employeeId: "EMP003",
      createdAt: "2025-01-20T11:15:00Z"
    },
    {
      id: "USR004",
      name: "Sunita Patel",
      email: "sunita.sarpanch@eseva.gov.in",
      mobile: "9876543213",
      role: "SARPANCH",
      office: "Gram Panchayat Rajapur",
      district: "Lucknow",
      tehsil: "Sadar",
      gramPanchayat: "Rajapur",
      status: "inactive",
      lastLogin: "2026-02-15T11:10:00Z",
      employeeId: "EMP004",
      createdAt: "2025-03-05T14:20:00Z"
    }
  ];

  // Filter users
  const filteredUsers = mockRecentUsers.filter(user => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.employeeId?.toLowerCase().includes(searchLower) ||
        user.office?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // Role filter
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    
    // Status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    // Office level validation based on role
    if (formData.role && formData.role !== 'ADMIN' && formData.role !== 'CITIZEN') {
      if (!formData.district) {
        newErrors.district = 'District is required';
      }

      if (['TEHSILDAR', 'TEHSIL_CLERK', 'SARPANCH', 'GRAM_SEVAK'].includes(formData.role)) {
        if (!formData.tehsil) {
          newErrors.tehsil = 'Tehsil is required';
        }
      }

      if (['SARPANCH', 'GRAM_SEVAK'].includes(formData.role)) {
        if (!formData.gramPanchayat) {
          newErrors.gramPanchayat = 'Gram Panchayat is required';
        }
      }

      if (formData.role !== 'CITIZEN' && !formData.employeeId) {
        newErrors.employeeId = 'Employee ID is required for officers';
      }
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate office name
      let office = '';
      if (formData.role === 'ADMIN') {
        office = 'Head Office';
      } else if (formData.role === 'COLLECTOR' || formData.role === 'DISTRICT_CLERK') {
        office = `District ${formData.district}`;
      } else if (formData.role === 'TEHSILDAR' || formData.role === 'TEHSIL_CLERK') {
        office = `Tehsil ${formData.tehsil}`;
      } else if (formData.role === 'SARPANCH' || formData.role === 'GRAM_SEVAK') {
        office = `Gram Panchayat ${formData.gramPanchayat}`;
      }

      const newUser = {
        id: `USR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        ...formData,
        office,
        status: 'active',
        lastLogin: null,
        createdAt: new Date().toISOString()
      };

      setSuccessMessage(`User ${formData.name} created successfully! Temporary password: Welcome@123`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowCreateModal(false);
      resetForm();
      
      if (onUserCreate) onUserCreate(newUser);

    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage(`User ${formData.name} updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowEditModal(false);
      resetForm();
      
      if (onUserUpdate) onUserUpdate({ ...selectedUser, ...formData });

    } catch (error) {
      setErrors({ submit: 'Failed to update user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage(`Password reset for ${selectedUser.name}. New temporary password: Reset@123`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      setShowResetPasswordModal(false);
      setSelectedUser(null);

    } catch (error) {
      setErrors({ reset: 'Failed to reset password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle lock/unlock user
  const handleLockUser = async (user) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newStatus = user.status === 'locked' ? 'active' : 'locked';
      setSuccessMessage(`User ${user.name} ${newStatus === 'locked' ? 'locked' : 'unlocked'} successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onUserUpdate) onUserUpdate({ ...user, status: newStatus });

    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  // Handle deactivate/activate user
  const handleToggleActive = async (user) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      setSuccessMessage(`User ${user.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onUserUpdate) onUserUpdate({ ...user, status: newStatus });

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
      officeLevel: '',
      district: '',
      tehsil: '',
      gramPanchayat: '',
      employeeId: '',
      isActive: true
    });
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
      district: user.district || '',
      tehsil: user.tehsil || '',
      gramPanchayat: user.gramPanchayat || '',
      employeeId: user.employeeId || '',
      isActive: user.status === 'active'
    });
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
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create New User
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
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
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.office}</p>
                    {user.district && (
                      <p className="text-xs text-gray-500 mt-1">{user.district}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.employeeId || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
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
                      
                      {user.status === 'locked' ? (
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

                      {user.status === 'active' ? (
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                <p className="text-sm text-gray-500 mt-1">Add a new user to the system</p>
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
                      Mobile Number
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="EMP001"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Role & Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {formData.role && formData.role !== 'ADMIN' && formData.role !== 'CITIZEN' && (
                    <>
                      {/* District */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg ${
                            errors.district ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Select District</option>
                          {mockOffices.districts.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                        {errors.district && (
                          <p className="mt-1 text-xs text-red-600">{errors.district}</p>
                        )}
                      </div>

                      {/* Tehsil */}
                      {['TEHSILDAR', 'TEHSIL_CLERK', 'SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tehsil <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="tehsil"
                            value={formData.tehsil}
                            onChange={handleInputChange}
                            disabled={!formData.district}
                            className={`w-full px-3 py-2 text-sm border rounded-lg ${
                              errors.tehsil ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !formData.district && 'bg-gray-50'
                            }`}
                          >
                            <option value="">Select Tehsil</option>
                            {formData.district && mockOffices.tehsils[formData.district]?.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                          {errors.tehsil && (
                            <p className="mt-1 text-xs text-red-600">{errors.tehsil}</p>
                          )}
                        </div>
                      )}

                      {/* Gram Panchayat */}
                      {['SARPANCH', 'GRAM_SEVAK'].includes(formData.role) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Gram Panchayat <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="gramPanchayat"
                            value={formData.gramPanchayat}
                            onChange={handleInputChange}
                            disabled={!formData.tehsil}
                            className={`w-full px-3 py-2 text-sm border rounded-lg ${
                              errors.gramPanchayat ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !formData.tehsil && 'bg-gray-50'
                            }`}
                          >
                            <option value="">Select Gram Panchayat</option>
                            {formData.tehsil && mockOffices.gramPanchayats[formData.tehsil]?.map(g => (
                              <option key={g.id} value={g.name}>{g.name}</option>
                            ))}
                          </select>
                          {errors.gramPanchayat && (
                            <p className="mt-1 text-xs text-red-600">{errors.gramPanchayat}</p>
                          )}
                        </div>
                      )}
                    </>
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
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create User
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
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-500 mt-1">Update user information</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-6">
              {/* Same form fields as create modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update User
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
                A temporary password will be generated and sent to their email.
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
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
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