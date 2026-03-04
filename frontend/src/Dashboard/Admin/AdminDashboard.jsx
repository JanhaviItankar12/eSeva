import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  FileText,
  Mail,
  Settings,
  Database,
  Shield,
  Activity,
  HardDrive,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Save,
  Edit3,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Mail as MailIcon,
  MessageSquare,
  Zap,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  LogOut,
  UserPlus,
  UserMinus,
  UserCheck,
  Settings as SettingsIcon,
  Globe,
  MapPin,
  Layers,
  FileCheck,
  FileWarning,
  FileX,
  HardDrive as HardDriveIcon,
  Cloud,
  Shield as ShieldIcon,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
  Home,
  Copy,
  Printer,
  Archive,
  Clock as ClockIcon,
  AlertCircle,
  Info,
  HomeIcon
} from 'lucide-react';
import UserManagement from './SideBar/UserManagement';
import DocumentConfiguration from './SideBar/DocumentConfiguration';
import OfficeSetupPage from './SideBar/OfficeSetupPage';
import SystemLogs from './SideBar/SystemLogs';
import BackupRestorePage from './SideBar/BackupStore';
import ExportData from './SideBar/ExportData';
import GlobalSetting from './SideBar/GlobalSetting';
import ShowAllUser from './SideBar/ShowAllUser';

// Mock Data for System Admin Dashboard

// User Statistics
const mockUserStats = {
  totalUsers: 1248,
  activeUsers: 1182,
  inactiveUsers: 66,
  lockedUsers: 23,
  byRole: {
    CITIZEN: 1050,
    GRAM_SEVAK: 85,
    SARPANCH: 62,
    TEHSIL_CLERK: 28,
    TEHSILDAR: 12,
    DISTRICT_CLERK: 8,
    COLLECTOR: 2,
    ADMIN: 1
  },
  recentLogins: 342,
  failedLogins: 28
};

// Office Hierarchy Stats
const mockOfficeStats = {
  districts: 12,
  tehsils: 85,
  gramPanchayats: 1245,
  activeOffices: 1320,
  inactiveOffices: 22
};

// Document Configuration Stats
const mockDocumentConfigs = [
  {
    id: "DOC001",
    name: "Birth Certificate",
    requiredDocs: ["Birth Report", "Parent ID", "Hospital Certificate"],
    processingLevel: "GRAM",
    slaDays: 7,
    isActive: true,
    totalApplications: 1250
  },
  {
    id: "DOC002",
    name: "Residence Certificate",
    requiredDocs: ["Ration Card", "Electricity Bill", "Aadhar Card"],
    processingLevel: "GRAM",
    slaDays: 5,
    isActive: true,
    totalApplications: 980
  },
  {
    id: "DOC003",
    name: "Income Certificate",
    requiredDocs: ["Income Proof Form", "Tax Document", "Aadhar Card"],
    processingLevel: "TEHSIL",
    slaDays: 10,
    isActive: true,
    totalApplications: 750
  },
  {
    id: "DOC004",
    name: "Caste Certificate",
    requiredDocs: ["Caste Certificate Form", "Parent Caste Proof", "Aadhar Card"],
    processingLevel: "TEHSIL",
    slaDays: 15,
    isActive: true,
    totalApplications: 620
  },
  {
    id: "DOC005",
    name: "Domicile Certificate",
    requiredDocs: ["Domicile Form", "Property Proof", "Aadhar Card"],
    processingLevel: "DISTRICT",
    slaDays: 12,
    isActive: true,
    totalApplications: 430
  }
];

// System Logs
const mockSystemLogs = [
  {
    id: 1,
    type: "login",
    user: "admin@eseva.gov.in",
    action: "Successful login",
    ip: "192.168.1.100",
    timestamp: "2026-02-21T09:15:00Z",
    status: "success"
  },
  {
    id: 2,
    type: "login",
    user: "gramsevak@example.com",
    action: "Failed login attempt",
    ip: "192.168.1.150",
    timestamp: "2026-02-21T09:10:00Z",
    status: "failed"
  },
  {
    id: 3,
    type: "error",
    user: "system",
    action: "Database connection timeout",
    ip: "localhost",
    timestamp: "2026-02-21T08:45:00Z",
    status: "error"
  },
  {
    id: 4,
    type: "api",
    user: "system",
    action: "API rate limit exceeded",
    ip: "192.168.1.200",
    timestamp: "2026-02-21T08:30:00Z",
    status: "warning"
  },
  {
    id: 5,
    type: "login",
    user: "tehsildar@example.com",
    action: "Successful login",
    ip: "192.168.1.175",
    timestamp: "2026-02-21T08:15:00Z",
    status: "success"
  }
];

// System Health
const mockSystemHealth = {
  serverStatus: "healthy",
  databaseStatus: "healthy",
  apiStatus: "degraded",
  storageUsed: "68%",
  memoryUsage: "42%",
  cpuUsage: "23%",
  lastBackup: "2026-02-21T03:00:00Z",
  uptime: "15 days 7 hours"
};

// Recent Users for management
const mockRecentUsers = [
  {
    id: "USR001",
    name: "Ramesh Kumar",
    email: "ramesh.gram@eseva.gov.in",
    role: "GRAM_SEVAK",
    office: "Gram Panchayat Rajapur",
    status: "active",
    lastLogin: "2026-02-21T10:30:00Z"
  },
  {
    id: "USR002",
    name: "Priya Singh",
    email: "priya.tehsil@eseva.gov.in",
    role: "TEHSIL_CLERK",
    office: "Tehsil Sadar",
    status: "active",
    lastLogin: "2026-02-21T09:45:00Z"
  },
  {
    id: "USR003",
    name: "Amit Sharma",
    email: "amit.district@eseva.gov.in",
    role: "DISTRICT_CLERK",
    office: "District Lucknow",
    status: "locked",
    lastLogin: "2026-02-20T16:20:00Z"
  },
  {
    id: "USR004",
    name: "Sunita Patel",
    email: "sunita.sarpanch@eseva.gov.in",
    role: "SARPANCH",
    office: "Gram Panchayat Rajapur",
    status: "inactive",
    lastLogin: "2026-02-15T11:10:00Z"
  }
];

// Backup History
const mockBackupHistory = [
  {
    id: "BCK001",
    date: "2026-02-21T03:00:00Z",
    size: "2.4 GB",
    type: "auto",
    status: "success"
  },
  {
    id: "BCK002",
    date: "2026-02-20T03:00:00Z",
    size: "2.3 GB",
    type: "auto",
    status: "success"
  },
  {
    id: "BCK003",
    date: "2026-02-19T03:00:00Z",
    size: "2.3 GB",
    type: "auto",
    status: "success"
  },
  {
    id: "BCK004",
    date: "2026-02-18T15:30:00Z",
    size: "2.2 GB",
    type: "manual",
    status: "success"
  }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [users, setUsers] = useState([]);

  const handleUserCreate = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers(prev =>
      prev.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
  };

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
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get role badge color
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

  return (
    <div className="min-h-screen bg-gray-100 font-['Inter']">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#1e40af"/>
              <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
              <rect x="10" y="21" width="12" height="2" fill="white"/>
            </svg>
              <div>
                <div className="text-sm font-semibold text-gray-900">eSeva Admin</div>
                <div className="text-xs text-gray-500">System Control</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User Management</p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => setActiveSection('create-officers')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Create Officers</span>
                  </button>
                  <button  onClick={() => setActiveSection('show-user')}
                   className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm font-medium">Show All Users</span>
                  </button>
                  
                </div>
              </div>

              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Office Setup</p>
                <div className="mt-2 space-y-1">
                  <button onClick={() => setActiveSection('offices')} className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Create Offices</span>
                  </button>
                 
                </div>
              </div>

              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => setActiveSection('documents')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'documents' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">Document Types</span>
                  </button>
                  
                  <button  onClick={() => setActiveSection('global-setting')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Global Settings</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => setActiveSection('logs')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'logs' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-medium">System Logs</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('backup')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'backup' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Database className="w-5 h-5" />
                    <span className="text-sm font-medium">Backup & Restore</span>
                  </button>
                  <button onClick={() => setActiveSection('export')} className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">Export Data</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">SA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">System Admin</p>
                <p className="text-xs text-gray-500">admin@eseva.gov.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">System Dashboard</h1>

              {/* System Health Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Server Status</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Healthy</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-gray-600">Uptime: {mockSystemHealth.uptime}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Database</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Connected</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <HardDriveIcon className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-600">Storage: {mockSystemHealth.storageUsed}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">API Status</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">Degraded</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-600">Response: 2.3s avg</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Backup</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Today</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-gray-600">{formatDate(mockSystemHealth.lastBackup)}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    User Statistics
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="text-lg font-bold text-gray-900">{mockUserStats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="text-lg font-bold text-green-600">{mockUserStats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Inactive Users</span>
                      <span className="text-lg font-bold text-gray-500">{mockUserStats.inactiveUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Locked Users</span>
                      <span className="text-lg font-bold text-red-600">{mockUserStats.lockedUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Recent Logins</span>
                      <span className="text-lg font-bold text-blue-600">{mockUserStats.recentLogins}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Failed Logins</span>
                      <span className="text-lg font-bold text-red-600">{mockUserStats.failedLogins}</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveSection('show-user')}
                   className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All Users →
                  </button>
                </div>

                {/* Office Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Office Hierarchy
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Districts</span>
                      <span className="text-lg font-bold text-gray-900">{mockOfficeStats.districts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tehsils</span>
                      <span className="text-lg font-bold text-gray-900">{mockOfficeStats.tehsils}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gram Panchayats</span>
                      <span className="text-lg font-bold text-gray-900">{mockOfficeStats.gramPanchayats}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Offices</span>
                      <span className="text-lg font-bold text-green-600">{mockOfficeStats.activeOffices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Inactive Offices</span>
                      <span className="text-lg font-bold text-gray-500">{mockOfficeStats.inactiveOffices}</span>
                    </div>
                  </div>
                  <button  onClick={() => setActiveSection('offices')}
                   className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Manage Offices →
                  </button>
                </div>

                {/* Document Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Document Types
                  </h2>
                  <div className="space-y-4">
                    {mockDocumentConfigs.slice(0, 3).map(doc => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{doc.name}</span>
                        <span className="text-sm font-medium text-gray-900">{doc.totalApplications}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Active Configs</span>
                      <span className="font-medium text-green-600">
                        {mockDocumentConfigs.filter(d => d.isActive).length}/5
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setActiveSection('documents')}
                   className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Configure Documents →
                  </button>
                </div>
              </div>

              {/* Recent Users & System Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockRecentUsers.map(user => (
                      <div key={user.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <div className="flex items-center mt-1 space-x-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                                  {user.role.replace('_', ' ')}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Logs */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">System Logs</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockSystemLogs.map(log => (
                      <div key={log.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 mt-2 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' :
                              log.status === 'failed' ? 'bg-red-500' :
                              log.status === 'error' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.action}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {log.user} • {log.ip}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(log.timestamp)}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button onClick={() => setActiveSection('logs')}
                     className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View All Logs →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button onClick={() => setActiveSection('create-officers')}
                   className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
                    <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-blue-700">Create Officers</span>
                  </button>
                  <button onClick={() => setActiveSection('offices')}
                   className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                    <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-purple-700">Create Offices</span>
                  </button>
                  <button onClick={() => setActiveSection('backup')}
                   className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                    <Database className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-green-700">Backup Now</span>
                  </button>
                  <button onClick={() => setActiveSection('global-setting')}
                   className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition-colors">
                    <Settings className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-orange-700">System Settings</span>
                  </button>
                </div>
              </div>

              {/* Backup History */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Backups</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockBackupHistory.map(backup => (
                        <tr key={backup.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(backup.date)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{backup.size}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {backup.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                              {backup.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'create-officers' && (
             <UserManagement
        users={users} // Your users array
        onUserCreate={handleUserCreate}
        onUserUpdate={handleUserUpdate}
      />
          )}

          {activeSection === 'documents' && (
            <DocumentConfiguration/>
          )}

          {activeSection === 'logs' && (
           <SystemLogs/>
          )}

           {activeSection === 'offices' && (
           <OfficeSetupPage/>
          )}

          {activeSection === 'backup' && (
           <BackupRestorePage/>
          )}
           
          {activeSection === 'export' && (
            <ExportData/>
          )}

          {activeSection === 'global-setting' && (
            <GlobalSetting/>
          )}

          {activeSection === 'show-user' && (
            <ShowAllUser/>
          )}



        </div>
      </div>
    </div>
  );
}