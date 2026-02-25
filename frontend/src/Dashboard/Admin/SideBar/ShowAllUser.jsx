import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Copy,
  Printer,
  Shield,
  Briefcase,
  Home,
  Globe,
  Smartphone,
  Mail as MailIcon,
  FileText,
  Award,
  Settings,
  LogOut,
  UserPlus,
  UserMinus,
  Ban,
  Activity,
  Star,
  Filter as FilterIcon,
  SlidersHorizontal,
  Grid,
  List,
  Table as TableIcon
} from 'lucide-react';

// Mock Users Data - Based on your schema
const mockUsers = [
  // Citizens
  {
    id: "USR001",
    name: "Rajesh Kumar Sharma",
    email: "rajesh.k@example.com",
    mobile: "9876543210",
    role: "CITIZEN",
    address: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-25T09:30:00Z",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-02-20T11:15:00Z",
    isActive: true,
    emailVerified: true,
    mobileVerified: true,
    totalApplications: 12,
    approvedCertificates: 8,
    pendingApplications: 3,
    rejectedApplications: 1,
    lastApplication: "2026-02-20T14:30:00Z"
  },
  {
    id: "USR002",
    name: "Priya Singh",
    email: "priya.s@example.com",
    mobile: "9876543211",
    role: "CITIZEN",
    address: {
      village: "Saidpur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-24T16:45:00Z",
    createdAt: "2025-02-10T09:30:00Z",
    updatedAt: "2026-02-15T10:20:00Z",
    isActive: true,
    emailVerified: true,
    mobileVerified: true,
    totalApplications: 8,
    approvedCertificates: 6,
    pendingApplications: 2,
    rejectedApplications: 0,
    lastApplication: "2026-02-18T11:20:00Z"
  },
  {
    id: "USR003",
    name: "Amit Patel",
    email: "amit.p@example.com",
    mobile: "9876543212",
    role: "CITIZEN",
    address: {
      village: "Gosaiganj",
      tehsil: "Malihabad",
      district: "Lucknow"
    },
    status: "inactive",
    lastLogin: "2026-02-01T10:15:00Z",
    createdAt: "2025-03-05T14:20:00Z",
    updatedAt: "2026-02-10T09:45:00Z",
    isActive: false,
    emailVerified: true,
    mobileVerified: false,
    totalApplications: 5,
    approvedCertificates: 3,
    pendingApplications: 1,
    rejectedApplications: 1,
    lastApplication: "2026-01-28T13:10:00Z"
  },

  // Gram Sevak
  {
    id: "USR004",
    name: "Ramesh Kumar",
    email: "ramesh.gram@eseva.gov.in",
    mobile: "9876543213",
    role: "GRAM_SEVAK",
    employeeId: "EMP001",
    officeLevel: "GRAM",
    officeId: "OFF001",
    officeName: "Gram Panchayat Rajapur",
    address: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-25T08:30:00Z",
    createdAt: "2025-01-20T11:15:00Z",
    updatedAt: "2026-02-18T14:30:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    assignedApplications: 45,
    processedApplications: 128,
    pendingVerification: 12,
    averageProcessingTime: "2.5 days"
  },
  {
    id: "USR005",
    name: "Suresh Yadav",
    email: "suresh.gram@eseva.gov.in",
    mobile: "9876543214",
    role: "GRAM_SEVAK",
    employeeId: "EMP002",
    officeLevel: "GRAM",
    officeId: "OFF002",
    officeName: "Gram Panchayat Saidpur",
    address: {
      village: "Saidpur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "locked",
    lastLogin: "2026-02-23T15:20:00Z",
    createdAt: "2025-02-15T10:00:00Z",
    updatedAt: "2026-02-24T09:15:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    assignedApplications: 38,
    processedApplications: 95,
    pendingVerification: 8,
    averageProcessingTime: "3.1 days",
    lockReason: "Multiple failed login attempts"
  },

  // Sarpanch
  {
    id: "USR006",
    name: "Sunita Patel",
    email: "sunita.sarpanch@eseva.gov.in",
    mobile: "9876543215",
    role: "SARPANCH",
    employeeId: "EMP003",
    officeLevel: "GRAM",
    officeId: "OFF001",
    officeName: "Gram Panchayat Rajapur",
    address: {
      village: "Rajapur",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-24T11:45:00Z",
    createdAt: "2025-01-10T09:30:00Z",
    updatedAt: "2026-02-19T16:20:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    verifiedApplications: 245,
    rejectedApplications: 12,
    pendingReview: 5
  },

  // Tehsil Clerk
  {
    id: "USR007",
    name: "Vikram Singh",
    email: "vikram.tehsil@eseva.gov.in",
    mobile: "9876543216",
    role: "TEHSIL_CLERK",
    employeeId: "EMP004",
    officeLevel: "TEHSIL",
    officeId: "OFF003",
    officeName: "Tehsil Sadar",
    address: {
      village: "Sadar",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-25T10:15:00Z",
    createdAt: "2025-01-05T14:20:00Z",
    updatedAt: "2026-02-22T13:10:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    assignedApplications: 156,
    processedApplications: 412,
    pendingVerification: 23
  },

  // Tehsildar
  {
    id: "USR008",
    name: "Ravindra Gupta",
    email: "ravindra.tehsildar@eseva.gov.in",
    mobile: "9876543217",
    role: "TEHSILDAR",
    employeeId: "EMP005",
    officeLevel: "TEHSIL",
    officeId: "OFF003",
    officeName: "Tehsil Sadar",
    address: {
      village: "Sadar",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-24T09:30:00Z",
    createdAt: "2024-12-01T11:00:00Z",
    updatedAt: "2026-02-21T15:45:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    verifiedApplications: 856,
    rejectedApplications: 34,
    pendingApproval: 12
  },

  // District Clerk
  {
    id: "USR009",
    name: "Neha Sharma",
    email: "neha.district@eseva.gov.in",
    mobile: "9876543218",
    role: "DISTRICT_CLERK",
    employeeId: "EMP006",
    officeLevel: "DISTRICT",
    officeId: "OFF004",
    officeName: "District Lucknow",
    address: {
      village: "Lucknow",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-25T08:45:00Z",
    createdAt: "2024-11-15T13:30:00Z",
    updatedAt: "2026-02-20T10:30:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    assignedApplications: 89,
    processedApplications: 234,
    pendingVerification: 15
  },

  // Collector
  {
    id: "USR010",
    name: "Anjali Mishra",
    email: "anjali.collector@eseva.gov.in",
    mobile: "9876543219",
    role: "COLLECTOR",
    employeeId: "EMP007",
    officeLevel: "DISTRICT",
    officeId: "OFF004",
    officeName: "District Lucknow",
    address: {
      village: "Lucknow",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: "2026-02-24T14:20:00Z",
    createdAt: "2024-10-01T09:15:00Z",
    updatedAt: "2026-02-19T11:40:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true,
    approvedApplications: 1245,
    rejectedApplications: 56,
    pendingReview: 8
  },

  // Admin
  {
    id: "USR011",
    name: "System Admin",
    email: "admin@eseva.gov.in",
    mobile: "9876543200",
    role: "ADMIN",
    employeeId: "EMP000",
    officeLevel: "STATE",
    officeName: "Head Office",
    status: "active",
    lastLogin: "2026-02-25T11:30:00Z",
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2026-02-23T16:15:00Z",
    isActive: true,
    isFirstLogin: false,
    emailVerified: true,
    mobileVerified: true
  },

  // New User - First Login
  {
    id: "USR012",
    name: "New Officer",
    email: "new.officer@eseva.gov.in",
    mobile: "9876543220",
    role: "TEHSIL_CLERK",
    employeeId: "EMP008",
    officeLevel: "TEHSIL",
    officeId: "OFF003",
    officeName: "Tehsil Sadar",
    address: {
      village: "Sadar",
      tehsil: "Sadar",
      district: "Lucknow"
    },
    status: "active",
    lastLogin: null,
    createdAt: "2026-02-24T15:30:00Z",
    updatedAt: "2026-02-24T15:30:00Z",
    isActive: true,
    isFirstLogin: true,
    tempPasswordExpires: "2026-03-02T15:30:00Z",
    emailVerified: false,
    mobileVerified: false,
    assignedApplications: 0,
    processedApplications: 0,
    pendingVerification: 0
  }
];

// Role colors for badges
const roleColors = {
  ADMIN: 'bg-purple-100 text-purple-800',
  COLLECTOR: 'bg-indigo-100 text-indigo-800',
  DISTRICT_CLERK: 'bg-blue-100 text-blue-800',
  TEHSILDAR: 'bg-cyan-100 text-cyan-800',
  TEHSIL_CLERK: 'bg-sky-100 text-sky-800',
  SARPANCH: 'bg-green-100 text-green-800',
  GRAM_SEVAK: 'bg-emerald-100 text-emerald-800',
  CITIZEN: 'bg-gray-100 text-gray-800'
};

// Status colors
const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  locked: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const ShowAllUser = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', 'list'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter users
  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.mobile?.includes(searchTerm) ||
        user.employeeId?.toLowerCase().includes(searchLower) ||
        user.officeName?.toLowerCase().includes(searchLower) ||
        user.address?.village?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // Role filter
    if (selectedRole !== 'all' && user.role !== selectedRole) return false;
    
    // Status filter
    if (selectedStatus !== 'all' && user.status !== selectedStatus) return false;
    
    // District filter
    if (selectedDistrict !== 'all' && user.address?.district !== selectedDistrict) return false;
    
    return true;
  });

  // Get unique districts for filter
  const districts = [...new Set(users
    .filter(u => u.address?.district)
    .map(u => u.address.district)
  )];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  // Handle select all users
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Handle select user
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle bulk action
  const handleBulkAction = (action) => {
    let message = '';
    switch(action) {
      case 'activate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        message = `${selectedUsers.length} users activated successfully`;
        break;
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ));
        message = `${selectedUsers.length} users deactivated successfully`;
        break;
      case 'lock':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'locked' } : u
        ));
        message = `${selectedUsers.length} users locked successfully`;
        break;
      case 'unlock':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        message = `${selectedUsers.length} users unlocked successfully`;
        break;
      case 'resetPassword':
        message = `Password reset emails sent to ${selectedUsers.length} users`;
        break;
    }
    
    setSuccessMessage(message);
    setShowSuccess(true);
    setSelectedUsers([]);
    setShowBulkActions(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle toggle user status
  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    setSuccessMessage(`User ${user.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle lock/unlock user
  const handleLockUser = (user) => {
    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    setSuccessMessage(`User ${user.name} ${newStatus === 'locked' ? 'locked' : 'unlocked'}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle reset password
  const handleResetPassword = (user) => {
    setSuccessMessage(`Password reset email sent to ${user.email}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
    setSuccessMessage(`User deleted successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle export users
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Mobile,Role,District,Status,Last Login\n"
      + filteredUsers.map(u => 
        `${u.name},${u.email},${u.mobile},${u.role},${u.address?.district || ''},${u.status},${u.lastLogin || ''}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    setSuccessMessage('Users exported successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-sm text-gray-600 mt-1">
            Total {filteredUsers.length} users • {users.filter(u => u.status === 'active').length} active • {users.filter(u => u.status === 'locked').length} locked
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
         
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, mobile, employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="COLLECTOR">Collector</option>
              <option value="DISTRICT_CLERK">District Clerk</option>
              <option value="TEHSILDAR">Tehsildar</option>
              <option value="TEHSIL_CLERK">Tehsil Clerk</option>
              <option value="SARPANCH">Sarpanch</option>
              <option value="GRAM_SEVAK">Gram Sevak</option>
              <option value="CITIZEN">Citizen</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Verified</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>Verified</option>
                  <option>Unverified</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Verified</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>Verified</option>
                  <option>Unverified</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Login</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>First Login</option>
                  <option>Returning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Registration Date</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                  <option>All Time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} users selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
            >
              <UserCheck className="w-4 h-4 inline mr-1" />
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <UserMinus className="w-4 h-4 inline mr-1" />
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('lock')}
              className="px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200"
            >
              <Lock className="w-4 h-4 inline mr-1" />
              Lock
            </button>
            <button
              onClick={() => handleBulkAction('unlock')}
              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
            >
              <Unlock className="w-4 h-4 inline mr-1" />
              Unlock
            </button>
            <button
              onClick={() => handleBulkAction('resetPassword')}
              className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200"
            >
              <Key className="w-4 h-4 inline mr-1" />
              Reset Password
            </button>
          </div>
        </div>
      )}

      {/* Users Display - Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.employeeId && (
                            <p className="text-xs text-gray-400">ID: {user.employeeId}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      {user.isFirstLogin && (
                        <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          First Login
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.mobile || 'N/A'}
                        </p>
                        {user.emailVerified ? (
                          <p className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Unverified
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {user.address ? (
                        <div className="text-xs text-gray-600">
                          <p>{user.address.village}</p>
                          <p>{user.address.tehsil}, {user.address.district}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                      {user.officeName && (
                        <p className="text-xs text-gray-500 mt-1">{user.officeName}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalMode('edit');
                            setShowUserModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {user.status === 'locked' ? (
                          <button
                            onClick={() => handleLockUser(user)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Unlock User"
                          >
                            <Unlock className="w-4 h-4 text-green-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLockUser(user)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Lock User"
                          >
                            <Lock className="w-4 h-4 text-yellow-500" />
                          </button>
                        )}

                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4 text-blue-500" />
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Deactivate User"
                          >
                            <UserMinus className="w-4 h-4 text-orange-500" />
                          </button>
                        ) : user.status !== 'locked' && (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Activate User"
                          >
                            <UserCheck className="w-4 h-4 text-green-500" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>

                        <button
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Expanded Row Details */}
                      {expandedUser === user.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Total Applications</p>
                              <p className="text-sm font-medium text-gray-900">{user.totalApplications || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Approved</p>
                              <p className="text-sm font-medium text-green-600">{user.approvedCertificates || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Pending</p>
                              <p className="text-sm font-medium text-yellow-600">{user.pendingApplications || 0}</p>
                            </div>
                            {user.assignedApplications && (
                              <>
                                <div>
                                  <p className="text-xs text-gray-500">Assigned</p>
                                  <p className="text-sm font-medium text-gray-900">{user.assignedApplications}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Processed</p>
                                  <p className="text-sm font-medium text-gray-900">{user.processedApplications}</p>
                                </div>
                              </>
                            )}
                            <div>
                              <p className="text-xs text-gray-500">Member Since</p>
                              <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {user.lockReason && (
                            <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-600">
                              Lock Reason: {user.lockReason}
                            </div>
                          )}
                          {user.tempPasswordExpires && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-600">
                              Temporary password expires: {formatDate(user.tempPasswordExpires)}
                            </div>
                          )}
                        </div>
                      )}
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
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.employeeId && (
                        <p className="text-xs text-gray-400 mt-1">ID: {user.employeeId}</p>
                      )}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded text-blue-600"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="w-3 h-3 mr-1" />
                    {user.mobile || 'N/A'}
                  </div>

                  {user.address && (
                    <div className="flex items-start text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                      <span>
                        {user.address.village}, {user.address.tehsil}, {user.address.district}
                      </span>
                    </div>
                  )}

                  {user.officeName && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Building2 className="w-3 h-3 mr-1" />
                      {user.officeName}
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    Last login: {formatDate(user.lastLogin)}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Applications</p>
                      <p className="text-sm font-semibold text-gray-900">{user.totalApplications || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Approved</p>
                      <p className="text-sm font-semibold text-green-600">{user.approvedCertificates || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="text-sm font-semibold text-yellow-600">{user.pendingApplications || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Reset Password">
                    <Key className="w-4 h-4 text-blue-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title={user.status === 'locked' ? 'Unlock' : 'Lock'}>
                    {user.status === 'locked' ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded text-blue-600"
                  />
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600">{user.email}</span>
                      <span className="text-xs text-gray-600">{user.mobile}</span>
                      {user.address && (
                        <span className="text-xs text-gray-600">
                          {user.address.village}, {user.address.district}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Key className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing 1 to {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User?</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllUser;