import { useState } from 'react';
import {
  Building2,
  MapPin,
  Home,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Users,
  Globe,
  Layers,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

// Mock data for districts and hierarchy
const mockDistricts = [
  {
    id: "D001",
    name: "Lucknow",
    code: "LKO",
    region: "Central",
    totalTehsils: 5,
    totalGramPanchayats: 85,
    totalOfficers: 42,
    status: "active",
    createdAt: "2025-01-15T10:30:00Z",
    tehsils: [
      {
        id: "T001",
        name: "Sadar",
        code: "SDR",
        totalGramPanchayats: 25,
        totalOfficers: 12,
        status: "active",
        gramPanchayats: [
          { id: "G001", name: "Rajapur", code: "RJP", totalOfficers: 3, status: "active" },
          { id: "G002", name: "Saidpur", code: "SDP", totalOfficers: 2, status: "active" },
          { id: "G003", name: "Gosaiganj", code: "GSG", totalOfficers: 2, status: "active" }
        ]
      },
      {
        id: "T002",
        name: "Malihabad",
        code: "MLH",
        totalGramPanchayats: 18,
        totalOfficers: 9,
        status: "active",
        gramPanchayats: [
          { id: "G004", name: "Malihabad", code: "MLH", totalOfficers: 2, status: "active" },
          { id: "G005", name: "Kakori", code: "KKR", totalOfficers: 2, status: "active" }
        ]
      },
      {
        id: "T003",
        name: "Mohanlalganj",
        code: "MLG",
        totalGramPanchayats: 22,
        totalOfficers: 11,
        status: "active",
        gramPanchayats: [
          { id: "G006", name: "Mohanlalganj", code: "MLG", totalOfficers: 2, status: "active" },
          { id: "G007", name: "Bakshi Ka Talab", code: "BKT", totalOfficers: 2, status: "active" }
        ]
      }
    ]
  },
  {
    id: "D002",
    name: "Kanpur",
    code: "KNP",
    region: "Central",
    totalTehsils: 3,
    totalGramPanchayats: 62,
    totalOfficers: 31,
    status: "active",
    createdAt: "2025-01-20T11:15:00Z",
    tehsils: [
      {
        id: "T004",
        name: "Sadar",
        code: "SDR",
        totalGramPanchayats: 28,
        totalOfficers: 14,
        status: "active",
        gramPanchayats: [
          { id: "G008", name: "Kanpur City", code: "KPC", totalOfficers: 3, status: "active" }
        ]
      },
      {
        id: "T005",
        name: "Bilhaur",
        code: "BLR",
        totalGramPanchayats: 34,
        totalOfficers: 17,
        status: "active",
        gramPanchayats: [
          { id: "G009", name: "Bilhaur", code: "BLR", totalOfficers: 2, status: "active" }
        ]
      }
    ]
  },
  {
    id: "D003",
    name: "Agra",
    code: "AGR",
    region: "Western",
    totalTehsils: 4,
    totalGramPanchayats: 78,
    totalOfficers: 39,
    status: "active",
    createdAt: "2025-02-01T09:30:00Z",
    tehsils: [
      {
        id: "T006",
        name: "Sadar",
        code: "SDR",
        totalGramPanchayats: 32,
        totalOfficers: 16,
        status: "active",
        gramPanchayats: [
          { id: "G010", name: "Agra City", code: "AGR", totalOfficers: 3, status: "active" }
        ]
      },
      {
        id: "T007",
        name: "Kiraoli",
        code: "KRL",
        totalGramPanchayats: 46,
        totalOfficers: 23,
        status: "active",
        gramPanchayats: [
          { id: "G011", name: "Kiraoli", code: "KRL", totalOfficers: 2, status: "active" }
        ]
      }
    ]
  },
  {
    id: "D004",
    name: "Varanasi",
    code: "VNS",
    region: "Eastern",
    totalTehsils: 4,
    totalGramPanchayats: 82,
    totalOfficers: 41,
    status: "active",
    createdAt: "2025-02-10T14:20:00Z",
    tehsils: [
      {
        id: "T008",
        name: "Sadar",
        code: "SDR",
        totalGramPanchayats: 38,
        totalOfficers: 19,
        status: "active",
        gramPanchayats: [
          { id: "G012", name: "Varanasi City", code: "VNS", totalOfficers: 3, status: "active" }
        ]
      },
      {
        id: "T009",
        name: "Pindra",
        code: "PDR",
        totalGramPanchayats: 44,
        totalOfficers: 22,
        status: "active",
        gramPanchayats: [
          { id: "G013", name: "Pindra", code: "PDR", totalOfficers: 2, status: "active" }
        ]
      }
    ]
  }
];

// Regions for dropdown
const regions = ["Central", "Northern", "Southern", "Eastern", "Western", "North-Eastern"];

const OfficeSetupPage = () => {
  const [districts, setDistricts] = useState(mockDistricts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [expandedDistricts, setExpandedDistricts] = useState([]);
  const [expandedTehsils, setExpandedTehsils] = useState([]);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showTehsilModal, setShowTehsilModal] = useState(false);
  const [showGramModal, setShowGramModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    status: 'active'
  });
  const [tehsilFormData, setTehsilFormData] = useState({
    name: '',
    code: '',
    districtId: '',
    status: 'active'
  });
  const [gramFormData, setGramFormData] = useState({
    name: '',
    code: '',
    tehsilId: '',
    districtId: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('districts'); // 'districts', 'hierarchy'

  // Filter districts
  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle district expansion
  const toggleDistrict = (districtId) => {
    setExpandedDistricts(prev =>
      prev.includes(districtId)
        ? prev.filter(id => id !== districtId)
        : [...prev, districtId]
    );
  };

  // Toggle tehsil expansion
  const toggleTehsil = (tehsilId) => {
    setExpandedTehsils(prev =>
      prev.includes(tehsilId)
        ? prev.filter(id => id !== tehsilId)
        : [...prev, tehsilId]
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active'
      ? 'text-green-600 bg-green-100'
      : 'text-gray-600 bg-gray-100';
  };

  // Validate district form
  const validateDistrictForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'District name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'District code is required';
    } else if (formData.code.length > 5) {
      newErrors.code = 'Code must be max 5 characters';
    }
    if (!formData.region) {
      newErrors.region = 'Region is required';
    }

    // Check for duplicate name/code
    if (modalMode === 'create') {
      const nameExists = districts.some(d => 
        d.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (nameExists) {
        newErrors.name = 'District with this name already exists';
      }

      const codeExists = districts.some(d => 
        d.code.toLowerCase() === formData.code.toLowerCase()
      );
      if (codeExists) {
        newErrors.code = 'District with this code already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate tehsil form
  const validateTehsilForm = () => {
    const newErrors = {};

    if (!tehsilFormData.name.trim()) {
      newErrors.name = 'Tehsil name is required';
    }
    if (!tehsilFormData.code.trim()) {
      newErrors.code = 'Tehsil code is required';
    } else if (tehsilFormData.code.length > 5) {
      newErrors.code = 'Code must be max 5 characters';
    }
    if (!tehsilFormData.districtId) {
      newErrors.districtId = 'Please select a district';
    }

    // Check for duplicate in selected district
    if (tehsilFormData.districtId && modalMode === 'create') {
      const district = districts.find(d => d.id === tehsilFormData.districtId);
      const nameExists = district?.tehsils?.some(t => 
        t.name.toLowerCase() === tehsilFormData.name.toLowerCase()
      );
      if (nameExists) {
        newErrors.name = 'Tehsil with this name already exists in this district';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate gram panchayat form
  const validateGramForm = () => {
    const newErrors = {};

    if (!gramFormData.name.trim()) {
      newErrors.name = 'Gram Panchayat name is required';
    }
    if (!gramFormData.code.trim()) {
      newErrors.code = 'Gram Panchayat code is required';
    } else if (gramFormData.code.length > 5) {
      newErrors.code = 'Code must be max 5 characters';
    }
    if (!gramFormData.tehsilId) {
      newErrors.tehsilId = 'Please select a tehsil';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create district
  const handleCreateDistrict = async (e) => {
    e.preventDefault();
    
    if (!validateDistrictForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newDistrict = {
        id: `D${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...formData,
        totalTehsils: 0,
        totalGramPanchayats: 0,
        totalOfficers: 0,
        tehsils: [],
        createdAt: new Date().toISOString()
      };

      setDistricts(prev => [...prev, newDistrict]);
      setSuccessMessage(`District ${formData.name} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowDistrictModal(false);
      resetForm();

    } catch (error) {
      setErrors({ submit: 'Failed to create district' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle create tehsil
  const handleCreateTehsil = async (e) => {
    e.preventDefault();
    
    if (!validateTehsilForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newTehsil = {
        id: `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: tehsilFormData.name,
        code: tehsilFormData.code,
        status: tehsilFormData.status,
        totalGramPanchayats: 0,
        totalOfficers: 0,
        gramPanchayats: []
      };

      setDistricts(prev => prev.map(district => {
        if (district.id === tehsilFormData.districtId) {
          return {
            ...district,
            tehsils: [...(district.tehsils || []), newTehsil],
            totalTehsils: (district.totalTehsils || 0) + 1
          };
        }
        return district;
      }));

      setSuccessMessage(`Tehsil ${tehsilFormData.name} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowTehsilModal(false);
      resetTehsilForm();

    } catch (error) {
      setErrors({ submit: 'Failed to create tehsil' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle create gram panchayat
  const handleCreateGram = async (e) => {
    e.preventDefault();
    
    if (!validateGramForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newGram = {
        id: `G${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: gramFormData.name,
        code: gramFormData.code,
        status: gramFormData.status,
        totalOfficers: 0
      };

      setDistricts(prev => prev.map(district => {
        if (district.id === gramFormData.districtId) {
          const updatedTehsils = district.tehsils?.map(tehsil => {
            if (tehsil.id === gramFormData.tehsilId) {
              return {
                ...tehsil,
                gramPanchayats: [...(tehsil.gramPanchayats || []), newGram],
                totalGramPanchayats: (tehsil.totalGramPanchayats || 0) + 1
              };
            }
            return tehsil;
          });
          return {
            ...district,
            tehsils: updatedTehsils,
            totalGramPanchayats: (district.totalGramPanchayats || 0) + 1
          };
        }
        return district;
      }));

      setSuccessMessage(`Gram Panchayat ${gramFormData.name} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowGramModal(false);
      resetGramForm();

    } catch (error) {
      setErrors({ submit: 'Failed to create gram panchayat' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete district
  const handleDeleteDistrict = (districtId) => {
    if (window.confirm('Are you sure you want to delete this district? This action cannot be undone.')) {
      setDistricts(prev => prev.filter(d => d.id !== districtId));
      setSuccessMessage('District deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Reset forms
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      region: '',
      status: 'active'
    });
    setErrors({});
  };

  const resetTehsilForm = () => {
    setTehsilFormData({
      name: '',
      code: '',
      districtId: '',
      status: 'active'
    });
    setErrors({});
  };

  const resetGramForm = () => {
    setGramFormData({
      name: '',
      code: '',
      tehsilId: '',
      districtId: '',
      status: 'active'
    });
    setErrors({});
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Office Setup</h1>
          <p className="text-sm text-gray-600 mt-1">Manage districts, tehsils and gram panchayats</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setModalMode('create');
              resetForm();
              setShowDistrictModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add District
          </button>
          <button
            onClick={() => {
              setModalMode('create');
              resetTehsilForm();
              setShowTehsilModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Tehsil
          </button>
          <button
            onClick={() => {
              setModalMode('create');
              resetGramForm();
              setShowGramModal(true);
            }}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Gram Panchayat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('districts')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'districts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Districts View
          </button>
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'hierarchy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Hierarchy View
          </button>
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
                placeholder="Search districts, tehsils or gram panchayats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Districts View */}
      {activeTab === 'districts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistricts.map(district => (
            <div key={district.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                      <p className="text-xs text-gray-500">Code: {district.code}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(district.status)}`}>
                    {district.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{district.totalTehsils}</p>
                    <p className="text-xs text-gray-500">Tehsils</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{district.totalGramPanchayats}</p>
                    <p className="text-xs text-gray-500">Gram Panchayats</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{district.totalOfficers}</p>
                    <p className="text-xs text-gray-500">Officers</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Region: {district.region}</span>
                    <span className="text-gray-500">Created: {formatDate(district.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit District">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleDeleteDistrict(district.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Delete District"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hierarchy View */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredDistricts.map(district => (
              <div key={district.id} className="p-4">
                {/* District Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleDistrict(district.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedDistricts.includes(district.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                      <p className="text-xs text-gray-500">Code: {district.code} | Region: {district.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(district.status)}`}>
                      {district.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {district.totalTehsils} Tehsils • {district.totalGramPanchayats} GPs
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Add Tehsil">
                        <PlusCircle className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit District">
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tehsils */}
                {expandedDistricts.includes(district.id) && district.tehsils && (
                  <div className="ml-12 mt-4 space-y-3">
                    {district.tehsils.map(tehsil => (
                      <div key={tehsil.id} className="border-l-2 border-blue-200 pl-4">
                        {/* Tehsil Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTehsil(tehsil.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {expandedTehsils.includes(tehsil.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tehsil.name}</h4>
                              <p className="text-xs text-gray-500">Code: {tehsil.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tehsil.status)}`}>
                              {tehsil.status}
                            </span>
                            <span className="text-xs text-gray-600">
                              {tehsil.totalGramPanchayats} GPs • {tehsil.totalOfficers} Officers
                            </span>
                            <div className="flex space-x-1">
                              <button className="p-1 hover:bg-gray-100 rounded" title="Add Gram Panchayat">
                                <PlusCircle className="w-3 h-3 text-blue-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded" title="Edit Tehsil">
                                <Edit3 className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Gram Panchayats */}
                        {expandedTehsils.includes(tehsil.id) && tehsil.gramPanchayats && (
                          <div className="ml-12 mt-3 space-y-2">
                            {tehsil.gramPanchayats.map(gram => (
                              <div key={gram.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Home className="w-3 h-3 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{gram.name}</p>
                                    <p className="text-xs text-gray-500">Code: {gram.code}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(gram.status)}`}>
                                    {gram.status}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {gram.totalOfficers} Officers
                                  </span>
                                  <div className="flex space-x-1">
                                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit GP">
                                      <Edit3 className="w-3 h-3 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create District Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Add New District' : 'Edit District'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Create a new district in the hierarchy</p>
              </div>
              <button
                onClick={() => {
                  setShowDistrictModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateDistrict} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Lucknow"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  maxLength="5"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., LKO"
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="mt-1 text-xs text-red-600">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDistrictModal(false);
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
                      Create District
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Tehsil Modal */}
      {showTehsilModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Tehsil</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new tehsil under a district</p>
              </div>
              <button
                onClick={() => {
                  setShowTehsilModal(false);
                  resetTehsilForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateTehsil} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select District <span className="text-red-500">*</span>
                </label>
                <select
                  value={tehsilFormData.districtId}
                  onChange={(e) => setTehsilFormData({...tehsilFormData, districtId: e.target.value})}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.districtId ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
                {errors.districtId && <p className="mt-1 text-xs text-red-600">{errors.districtId}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tehsil Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tehsilFormData.name}
                  onChange={(e) => setTehsilFormData({...tehsilFormData, name: e.target.value})}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Sadar"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tehsil Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tehsilFormData.code}
                  onChange={(e) => setTehsilFormData({...tehsilFormData, code: e.target.value.toUpperCase()})}
                  maxLength="5"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., SDR"
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={tehsilFormData.status}
                  onChange={(e) => setTehsilFormData({...tehsilFormData, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTehsilModal(false);
                    resetTehsilForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Tehsil
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Gram Panchayat Modal */}
      {showGramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Gram Panchayat</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new gram panchayat under a tehsil</p>
              </div>
              <button
                onClick={() => {
                  setShowGramModal(false);
                  resetGramForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateGram} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select District
                </label>
                <select
                  value={gramFormData.districtId}
                  onChange={(e) => {
                    const districtId = e.target.value;
                    setGramFormData({
                      ...gramFormData,
                      districtId,
                      tehsilId: ''
                    });
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Tehsil <span className="text-red-500">*</span>
                </label>
                <select
                  value={gramFormData.tehsilId}
                  onChange={(e) => setGramFormData({...gramFormData, tehsilId: e.target.value})}
                  disabled={!gramFormData.districtId}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.tehsilId ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !gramFormData.districtId && 'bg-gray-50'
                  }`}
                >
                  <option value="">Select Tehsil</option>
                  {gramFormData.districtId && districts
                    .find(d => d.id === gramFormData.districtId)
                    ?.tehsils?.map(tehsil => (
                      <option key={tehsil.id} value={tehsil.id}>{tehsil.name}</option>
                    ))}
                </select>
                {errors.tehsilId && <p className="mt-1 text-xs text-red-600">{errors.tehsilId}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gram Panchayat Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={gramFormData.name}
                  onChange={(e) => setGramFormData({...gramFormData, name: e.target.value})}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Rajapur"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gram Panchayat Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={gramFormData.code}
                  onChange={(e) => setGramFormData({...gramFormData, code: e.target.value.toUpperCase()})}
                  maxLength="5"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., RJP"
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={gramFormData.status}
                  onChange={(e) => setGramFormData({...gramFormData, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGramModal(false);
                    resetGramForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Gram Panchayat
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeSetupPage;