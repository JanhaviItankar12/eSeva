import { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  XCircle,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Clock,
  Layers,
  Shield,
  Upload,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  GitBranch,
  Users,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  UserCog
} from 'lucide-react';

// Mock data for document configurations with hierarchy
const mockDocumentConfigs = [
  {
    id: "DOC001",
    name: "Birth Certificate",
    type: "BIRTH",
    description: "Official document recording birth details",
    hierarchy: [
      { level: "GRAM", officers: ["GRAM_SEVAK"], canApprove: false },
      { level: "TEHSIL", officers: ["TEHSIL_CLERK", "TEHSILDAR"], canApprove: true },
      { level: "DISTRICT", officers: ["DISTRICT_CLERK"], canApprove: true }
    ],
    requiredDocs: [
      { name: "Birth Report", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Parent ID Proof", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Hospital Certificate", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] }
    ],
    processingLevel: "TEHSIL", // Final approval level
    slaDays: 7,
    fee: 50,
    isActive: true,
    totalApplications: 1250,
    createdAt: "2025-01-15T10:30:00Z",
    lastUpdated: "2026-02-01T14:20:00Z",
    rejectionReasons: [
      "Documents not clear/legible",
      "Missing required documents",
      "Information mismatch",
      "Invalid address proof",
      "Expired documents"
    ],
    validFor: "Lifetime",
    authority: "Gram Panchayat"
  },
  {
    id: "DOC002",
    name: "Residence Certificate",
    type: "RESIDENCE",
    description: "Proof of current residential address",
    hierarchy: [
      { level: "GRAM", officers: ["GRAM_SEVAK"], canApprove: false },
      { level: "TEHSIL", officers: ["TEHSIL_CLERK"], canApprove: true }
    ],
    requiredDocs: [
      { name: "Ration Card", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Electricity Bill", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Aadhar Card", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] }
    ],
    processingLevel: "TEHSIL",
    slaDays: 5,
    fee: 100,
    isActive: true,
    totalApplications: 980,
    createdAt: "2025-01-20T11:15:00Z",
    lastUpdated: "2026-02-05T09:30:00Z",
    rejectionReasons: [
      "Address proof not clear",
      "Bill older than 3 months",
      "Name mismatch with ID proof",
      "Invalid document format"
    ],
    validFor: "5 years",
    authority: "Gram Panchayat"
  },
  {
    id: "DOC003",
    name: "Income Certificate",
    type: "INCOME",
    description: "Certificate of annual family income",
    hierarchy: [
      { level: "GRAM", officers: ["GRAM_SEVAK"], canApprove: false },
      { level: "TEHSIL", officers: ["TEHSIL_CLERK", "TEHSILDAR"], canApprove: true }
    ],
    requiredDocs: [
      { name: "Income Proof Form", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Salary Slips (3 months)", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Bank Statement", required: true, maxSize: "5MB", formats: ["PDF"] },
      { name: "Self Declaration", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] }
    ],
    processingLevel: "TEHSIL",
    slaDays: 10,
    fee: 150,
    isActive: true,
    totalApplications: 750,
    createdAt: "2025-02-01T09:30:00Z",
    lastUpdated: "2026-02-10T11:45:00Z",
    rejectionReasons: [
      "Income proof insufficient",
      "Salary slips not verifiable",
      "Bank statement not provided",
      "Income exceeds limit",
      "Documents mismatch"
    ],
    validFor: "1 year",
    authority: "Tehsil Office"
  },
  {
    id: "DOC004",
    name: "Caste Certificate",
    type: "CASTE",
    description: "Certificate of caste/tribe affiliation",
    hierarchy: [
      { level: "GRAM", officers: ["GRAM_SEVAK"], canApprove: false },
      { level: "TEHSIL", officers: ["TEHSIL_CLERK", "TEHSILDAR"], canApprove: true }
    ],
    requiredDocs: [
      { name: "Caste Certificate Form", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Parent Caste Proof", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Aadhar Card", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] }
    ],
    processingLevel: "TEHSIL",
    slaDays: 15,
    fee: 100,
    isActive: true,
    totalApplications: 620,
    createdAt: "2025-02-10T14:20:00Z",
    lastUpdated: "2026-02-12T16:30:00Z",
    rejectionReasons: [
      "Caste proof not valid",
      "Parent documents missing",
      "Community verification failed",
      "Document mismatch",
      "Expired certificates"
    ],
    validFor: "Lifetime",
    authority: "Tehsil Office"
  },
  {
    id: "DOC005",
    name: "Domicile Certificate",
    type: "DOMICILE",
    description: "Proof of state residency",
    hierarchy: [
      { level: "GRAM", officers: ["GRAM_SEVAK"], canApprove: false },
      { level: "TEHSIL", officers: ["TEHSIL_CLERK", "TEHSILDAR"], canApprove: false },
      { level: "DISTRICT", officers: ["DISTRICT_CLERK", "COLLECTOR"], canApprove: true }
    ],
    requiredDocs: [
      { name: "Domicile Form", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Property Proof", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "Aadhar Card", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] },
      { name: "School Certificate", required: true, maxSize: "5MB", formats: ["PDF", "JPG", "PNG"] }
    ],
    processingLevel: "DISTRICT",
    slaDays: 12,
    fee: 100,
    isActive: true,
    totalApplications: 430,
    createdAt: "2025-02-15T10:00:00Z",
    lastUpdated: "2026-02-18T13:15:00Z",
    rejectionReasons: [
      "Residency period insufficient",
      "Property proof not valid",
      "School records mismatch",
      "Address verification failed",
      "Documents incomplete"
    ],
    validFor: "Lifetime",
    authority: "District Office"
  }
];

// Processing levels
const processingLevels = ["GRAM", "TEHSIL", "DISTRICT"];

// Officer roles by level
const officerRoles = {
  GRAM: [
    { value: "GRAM_SEVAK", label: "Gram Sevak" },
    { value: "SARPANCH", label: "Sarpanch" }
  ],
  TEHSIL: [
    { value: "TEHSIL_CLERK", label: "Tehsil Clerk" },
    { value: "TEHSILDAR", label: "Tehsildar" }
  ],
  DISTRICT: [
    { value: "DISTRICT_CLERK", label: "District Clerk" },
    { value: "COLLECTOR", label: "Collector" }
  ]
};

// Document formats
const allowedFormats = ["PDF", "JPG", "PNG", "JPEG", "DOC", "DOCX"];

// Fee types
const feeTypes = ["Fixed", "Variable", "Urgent Only"];

const DocumentConfiguration = () => {
  const [configs, setConfigs] = useState(mockDocumentConfigs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [expandedConfigs, setExpandedConfigs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    hierarchy: [
      { level: 'GRAM', officers: [], canApprove: false }
    ],
    processingLevel: 'TEHSIL',
    slaDays: 7,
    fee: 0,
    feeType: 'Fixed',
    isActive: true,
    requiredDocs: [],
    rejectionReasons: [''],
    validFor: '',
    authority: '',
    maxFileSize: 5,
    allowedFormats: ['PDF', 'JPG', 'PNG']
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('configs'); // 'configs', 'templates'

  // Filter configurations
  const filteredConfigs = configs.filter(config => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        config.name.toLowerCase().includes(searchLower) ||
        config.type.toLowerCase().includes(searchLower) ||
        config.description.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // Type filter
    if (selectedType !== 'all' && config.type !== selectedType) return false;
    
    // Level filter
    if (selectedLevel !== 'all' && config.processingLevel !== selectedLevel) return false;
    
    return true;
  });

  // Toggle config expansion
  const toggleConfig = (configId) => {
    setExpandedConfigs(prev =>
      prev.includes(configId)
        ? prev.filter(id => id !== configId)
        : [...prev, configId]
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
    return status
      ? 'text-green-600 bg-green-100'
      : 'text-gray-600 bg-gray-100';
  };

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      'GRAM': 'bg-green-100 text-green-800',
      'TEHSIL': 'bg-blue-100 text-blue-800',
      'DISTRICT': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Get officer role label
  const getOfficerLabel = (role) => {
    const labels = {
      'GRAM_SEVAK': 'Gram Sevak',
      'SARPANCH': 'Sarpanch',
      'TEHSIL_CLERK': 'Tehsil Clerk',
      'TEHSILDAR': 'Tehsildar',
      'DISTRICT_CLERK': 'District Clerk',
      'COLLECTOR': 'Collector'
    };
    return labels[role] || role;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Certificate name is required';
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Certificate type is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.processingLevel) {
      newErrors.processingLevel = 'Processing level is required';
    }
    if (!formData.slaDays || formData.slaDays < 1) {
      newErrors.slaDays = 'Valid SLA days is required';
    }
    if (!formData.fee || formData.fee < 0) {
      newErrors.fee = 'Valid fee amount is required';
    }
    if (!formData.validFor.trim()) {
      newErrors.validFor = 'Validity period is required';
    }
    if (!formData.authority.trim()) {
      newErrors.authority = 'Issuing authority is required';
    }

    // Check hierarchy
    if (formData.hierarchy.length === 0) {
      newErrors.hierarchy = 'At least one processing level is required';
    }

    // Check for duplicate name/type
    if (modalMode === 'create') {
      const nameExists = configs.some(c => 
        c.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (nameExists) {
        newErrors.name = 'Certificate with this name already exists';
      }

      const typeExists = configs.some(c => 
        c.type.toLowerCase() === formData.type.toLowerCase()
      );
      if (typeExists) {
        newErrors.type = 'Certificate with this type already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create/update config
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (modalMode === 'create') {
        const newConfig = {
          id: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          ...formData,
          totalApplications: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        setConfigs(prev => [...prev, newConfig]);
        setSuccessMessage(`Certificate ${formData.name} created successfully!`);
      } else {
        setConfigs(prev => prev.map(c => 
          c.id === selectedConfig.id 
            ? { ...c, ...formData, lastUpdated: new Date().toISOString() }
            : c
        ));
        setSuccessMessage(`Certificate ${formData.name} updated successfully!`);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowConfigModal(false);
      resetForm();

    } catch (error) {
      setErrors({ submit: 'Failed to save configuration' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete config
  const handleDelete = (configId) => {
    if (window.confirm('Are you sure you want to delete this certificate type? This action cannot be undone.')) {
      setConfigs(prev => prev.filter(c => c.id !== configId));
      setSuccessMessage('Certificate type deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle duplicate config
  const handleDuplicate = (config) => {
    const newConfig = {
      ...config,
      id: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: `${config.name} (Copy)`,
      type: `${config.type}_COPY`,
      totalApplications: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setConfigs(prev => [...prev, newConfig]);
    setSuccessMessage(`Certificate duplicated successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle toggle active status
  const handleToggleActive = (config) => {
    setConfigs(prev => prev.map(c =>
      c.id === config.id
        ? { ...c, isActive: !c.isActive, lastUpdated: new Date().toISOString() }
        : c
    ));
    setSuccessMessage(`Certificate ${config.isActive ? 'deactivated' : 'activated'} successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      hierarchy: [
        { level: 'GRAM', officers: [], canApprove: false }
      ],
      processingLevel: 'TEHSIL',
      slaDays: 7,
      fee: 0,
      feeType: 'Fixed',
      isActive: true,
      requiredDocs: [],
      rejectionReasons: [''],
      validFor: '',
      authority: '',
      maxFileSize: 5,
      allowedFormats: ['PDF', 'JPG', 'PNG']
    });
    setErrors({});
  };

  // Open edit modal
  const openEditModal = (config) => {
    setSelectedConfig(config);
    setFormData({
      name: config.name,
      type: config.type,
      description: config.description,
      hierarchy: config.hierarchy || [{ level: 'GRAM', officers: [], canApprove: false }],
      processingLevel: config.processingLevel,
      slaDays: config.slaDays,
      fee: config.fee,
      feeType: config.feeType || 'Fixed',
      isActive: config.isActive,
      requiredDocs: config.requiredDocs,
      rejectionReasons: config.rejectionReasons,
      validFor: config.validFor,
      authority: config.authority,
      maxFileSize: config.maxFileSize || 5,
      allowedFormats: config.allowedFormats || ['PDF', 'JPG', 'PNG']
    });
    setModalMode('edit');
    setShowConfigModal(true);
  };

  // Handle hierarchy
  const handleAddHierarchyLevel = () => {
    const nextLevel = formData.hierarchy.length === 1 ? 'TEHSIL' : 'DISTRICT';
    setFormData(prev => ({
      ...prev,
      hierarchy: [
        ...prev.hierarchy,
        { level: nextLevel, officers: [], canApprove: nextLevel === 'DISTRICT' }
      ]
    }));
  };

  const handleRemoveHierarchyLevel = (index) => {
    setFormData(prev => ({
      ...prev,
      hierarchy: prev.hierarchy.filter((_, i) => i !== index)
    }));
  };

  const handleHierarchyChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      hierarchy: prev.hierarchy.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      )
    }));
  };

  const handleOfficerToggle = (levelIndex, officerValue) => {
    setFormData(prev => {
      const level = prev.hierarchy[levelIndex];
      const officers = level.officers.includes(officerValue)
        ? level.officers.filter(o => o !== officerValue)
        : [...level.officers, officerValue];
      
      const newHierarchy = [...prev.hierarchy];
      newHierarchy[levelIndex] = { ...level, officers };
      
      return { ...prev, hierarchy: newHierarchy };
    });
  };

  // Handle required docs change
  const handleAddRequiredDoc = () => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: [
        ...prev.requiredDocs,
        { name: '', required: true, maxSize: '5MB', formats: ['PDF', 'JPG', 'PNG'] }
      ]
    }));
  };

  const handleRemoveRequiredDoc = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.filter((_, i) => i !== index)
    }));
  };

  const handleRequiredDocChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  // Handle rejection reasons
  const handleAddRejectionReason = () => {
    setFormData(prev => ({
      ...prev,
      rejectionReasons: [...prev.rejectionReasons, '']
    }));
  };

  const handleRemoveRejectionReason = (index) => {
    setFormData(prev => ({
      ...prev,
      rejectionReasons: prev.rejectionReasons.filter((_, i) => i !== index)
    }));
  };

  const handleRejectionReasonChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rejectionReasons: prev.rejectionReasons.map((reason, i) =>
        i === index ? value : reason
      )
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Document Configuration</h1>
          <p className="text-sm text-gray-600 mt-1">Manage certificate types, hierarchy and required documents</p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            resetForm();
            setShowConfigModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Certificate Type
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('configs')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'configs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Certificate Types
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Templates & Settings
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
                placeholder="Search certificate types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="BIRTH">Birth</option>
            <option value="RESIDENCE">Residence</option>
            <option value="INCOME">Income</option>
            <option value="CASTE">Caste</option>
            <option value="DOMICILE">Domicile</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="GRAM">Gram</option>
            <option value="TEHSIL">Tehsil</option>
            <option value="DISTRICT">District</option>
          </select>
          <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Certificate Types List */}
      {activeTab === 'configs' && (
        <div className="space-y-4">
          {filteredConfigs.map(config => (
            <div key={config.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => toggleConfig(config.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      {expandedConfigs.includes(config.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(config.processingLevel)}`}>
                      {config.processingLevel}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(config.isActive)}`}>
                      {config.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm">
                  <span className="text-gray-600">SLA: {config.slaDays} days</span>
                  <span className="text-gray-600">Fee: ₹{config.fee}</span>
                  <span className="text-gray-600">Applications: {config.totalApplications}</span>
                  <span className="text-gray-600">Valid: {config.validFor}</span>
                </div>

                {/* Hierarchy Preview */}
                <div className="mt-3 flex items-center space-x-2">
                  <GitBranch className="w-4 h-4 text-gray-400" />
                  {config.hierarchy?.map((level, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level.level)}`}>
                        {level.level}
                      </span>
                      {idx < config.hierarchy.length - 1 && (
                        <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedConfigs.includes(config.id) && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  {/* Processing Hierarchy */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                      Processing Hierarchy
                    </h4>
                    <div className="space-y-3">
                      {config.hierarchy?.map((level, idx) => (
                        <div key={idx} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level.level)}`}>
                            {level.level}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                              {level.officers.map(officer => (
                                <span key={officer} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {getOfficerLabel(officer)}
                                </span>
                              ))}
                            </div>
                          </div>
                          {level.canApprove && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Can Approve
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Required Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {config.requiredDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                          <div className={`mt-0.5 w-2 h-2 rounded-full ${doc.required ? 'bg-red-500' : 'bg-gray-400'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Max: {doc.maxSize} | Formats: {doc.formats.join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection Reasons */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Rejection Reasons</h4>
                    <div className="flex flex-wrap gap-2">
                      {config.rejectionReasons.map((reason, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Issuing Authority</p>
                      <p className="text-sm font-medium text-gray-900">{config.authority}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-900">{formatDate(config.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(config.lastUpdated)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(config)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(config)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(config)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={config.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {config.isActive ? (
                        <EyeOff className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedConfig(config) || setShowDetailModal(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Templates & Settings Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Global Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-500" />
              Global Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Allowed File Formats
                </label>
                <div className="flex flex-wrap gap-2">
                  {allowedFormats.map(format => (
                    <label key={format} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={['PDF', 'JPG', 'PNG'].includes(format)} className="rounded text-blue-600" />
                      <span className="text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Default SLA (Days)
                </label>
                <input
                  type="number"
                  defaultValue="7"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Global Settings
              </button>
            </div>
          </div>

          {/* Rejection Templates */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
              Rejection Templates
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Document Quality</p>
                <p className="text-xs text-gray-600 mt-1">"The uploaded document is not clear/legible. Please upload a clear copy."</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Missing Documents</p>
                <p className="text-xs text-gray-600 mt-1">"Required documents are missing. Please upload all mandatory documents."</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Information Mismatch</p>
                <p className="text-xs text-gray-600 mt-1">"The information provided does not match with uploaded documents."</p>
              </div>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                + Add Template
              </button>
            </div>
          </div>

          {/* Approval Templates */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-gray-500" />
              Approval Templates
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Standard Approval</p>
                <p className="text-xs text-gray-600 mt-1">"Your application has been approved. You can now download the certificate."</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Urgent Approval</p>
                <p className="text-xs text-gray-600 mt-1">"Your urgent application has been approved. Certificate is ready for download."</p>
              </div>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                + Add Template
              </button>
            </div>
          </div>

          {/* Fee Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Fee Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Urgent Fee Multiplier
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  step="0.5"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fee Types
                </label>
                <div className="space-y-2">
                  {feeTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Add Certificate Type' : 'Edit Certificate Type'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure certificate details, hierarchy and required documents
                </p>
              </div>
              <button
                onClick={() => {
                  setShowConfigModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Certificate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., Birth Certificate"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Certificate Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value.toUpperCase()})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., BIRTH"
                      maxLength="10"
                    />
                    {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="2"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Brief description of the certificate"
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Final Approval Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.processingLevel}
                      onChange={(e) => setFormData({...formData, processingLevel: e.target.value})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.processingLevel ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      {processingLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {errors.processingLevel && <p className="mt-1 text-xs text-red-600">{errors.processingLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Issuing Authority <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.authority}
                      onChange={(e) => setFormData({...formData, authority: e.target.value})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.authority ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., Gram Panchayat"
                    />
                    {errors.authority && <p className="mt-1 text-xs text-red-600">{errors.authority}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Validity Period <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.validFor}
                      onChange={(e) => setFormData({...formData, validFor: e.target.value})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.validFor ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., Lifetime, 5 years"
                    />
                    {errors.validFor && <p className="mt-1 text-xs text-red-600">{errors.validFor}</p>}
                  </div>
                </div>
              </div>

              {/* Processing Hierarchy */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                    Processing Hierarchy
                  </h3>
                  {formData.hierarchy.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddHierarchyLevel}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add Level
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {formData.hierarchy.map((level, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level.level)}`}>
                            {level.level}
                          </span>
                          {index > 0 && (
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        {formData.hierarchy.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveHierarchyLevel(index)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>

                      <div className="ml-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Assign Officers at this level
                        </label>
                        <div className="space-y-2">
                          {officerRoles[level.level]?.map(officer => (
                            <label key={officer.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={level.officers.includes(officer.value)}
                                onChange={() => handleOfficerToggle(index, officer.value)}
                                className="rounded text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{officer.label}</span>
                            </label>
                          ))}
                        </div>

                        {index === formData.hierarchy.length - 1 && (
                          <div className="mt-3">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={level.canApprove}
                                onChange={(e) => handleHierarchyChange(index, 'canApprove', e.target.checked)}
                                className="rounded text-blue-600"
                              />
                              <span className="text-sm text-gray-700">
                                Can approve at this level (final approval)
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.hierarchy && (
                  <p className="mt-2 text-xs text-red-600">{errors.hierarchy}</p>
                )}
              </div>

              {/* SLA and Fee */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">SLA & Fee Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      SLA Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.slaDays}
                      onChange={(e) => setFormData({...formData, slaDays: parseInt(e.target.value)})}
                      min="1"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.slaDays ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.slaDays && <p className="mt-1 text-xs text-red-600">{errors.slaDays}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fee Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({...formData, fee: parseInt(e.target.value)})}
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${
                        errors.fee ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.fee && <p className="mt-1 text-xs text-red-600">{errors.fee}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fee Type
                    </label>
                    <select
                      value={formData.feeType}
                      onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {feeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Required Documents</h3>
                  <button
                    type="button"
                    onClick={handleAddRequiredDoc}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Document
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.requiredDocs.map((doc, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Document {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequiredDoc(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Document Name</label>
                          <input
                            type="text"
                            value={doc.name}
                            onChange={(e) => handleRequiredDocChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Aadhar Card"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max Size</label>
                          <input
                            type="text"
                            value={doc.maxSize}
                            onChange={(e) => handleRequiredDocChange(index, 'maxSize', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 5MB"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Formats</label>
                          <select
                            multiple
                            value={doc.formats}
                            onChange={(e) => handleRequiredDocChange(index, 'formats', 
                              Array.from(e.target.selectedOptions, option => option.value)
                            )}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {allowedFormats.map(format => (
                              <option key={format} value={format}>{format}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Required</label>
                          <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={doc.required === true}
                                onChange={() => handleRequiredDocChange(index, 'required', true)}
                                className="mr-2"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={doc.required === false}
                                onChange={() => handleRequiredDocChange(index, 'required', false)}
                                className="mr-2"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reasons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Rejection Reasons</h3>
                  <button
                    type="button"
                    onClick={handleAddRejectionReason}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Reason
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.rejectionReasons.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => handleRejectionReasonChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter rejection reason"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRejectionReason(index)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Active (available for applications)</span>
                </label>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {modalMode === 'create' ? 'Create Certificate' : 'Update Certificate'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedConfig.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedConfig.description}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedConfig.totalApplications}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Applications</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedConfig.slaDays}</p>
                  <p className="text-xs text-gray-600 mt-1">SLA Days</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">₹{selectedConfig.fee}</p>
                  <p className="text-xs text-gray-600 mt-1">Fee</p>
                </div>
              </div>

              {/* Hierarchy */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                  Processing Hierarchy
                </h3>
                <div className="space-y-2">
                  {selectedConfig.hierarchy?.map((level, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level.level)}`}>
                        {level.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {level.officers.map(officer => (
                            <span key={officer} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {getOfficerLabel(officer)}
                            </span>
                          ))}
                        </div>
                      </div>
                      {level.canApprove && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Final Approval
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Certificate Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedConfig.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Processing Level</p>
                  <p className="text-sm font-medium text-gray-900">{selectedConfig.processingLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Issuing Authority</p>
                  <p className="text-sm font-medium text-gray-900">{selectedConfig.authority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Validity</p>
                  <p className="text-sm font-medium text-gray-900">{selectedConfig.validFor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedConfig.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedConfig.lastUpdated)}</p>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Required Documents</h3>
                <div className="space-y-2">
                  {selectedConfig.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full ${doc.required ? 'bg-red-500' : 'bg-gray-400'} mr-2`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max Size: {doc.maxSize} | Formats: {doc.formats.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reasons */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rejection Reasons</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedConfig.rejectionReasons.map((reason, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedConfig);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Edit Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentConfiguration;