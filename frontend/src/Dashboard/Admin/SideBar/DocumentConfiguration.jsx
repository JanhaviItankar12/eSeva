import { useState, useEffect } from 'react';
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
import { 
  useGetDocumentTypesQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useToggleDocumentTypeStatusMutation,
  
  useGetSystemSettingsQuery, 
  useUpdateSystemSettingsMutation 
} from '../../../features/api/adminApi';
import {
  useGetActiveDistrictsQuery,
  useGetActiveTehsilsQuery,
  useGetActiveGramPanchayatsQuery,
  useGetOfficerRolesQuery
} from '../../../features/api/officeApi';

// Processing levels
const processingLevels = ["GRAM", "TEHSIL", "DISTRICT"];

// Document formats
const allowedFormats = ["PDF", "JPG", "PNG", "JPEG", "DOC", "DOCX"];

// Fee types
const feeTypes = ["Fixed", "Variable", "Urgent Only"];

const DocumentConfiguration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [expandedConfigs, setExpandedConfigs] = useState([]);
  
  // API Hooks
  const { 
    data: documentTypesData, 
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments
  } = useGetDocumentTypesQuery({
    type: selectedType !== 'all' ? selectedType : undefined,
    processingLevel: selectedLevel !== 'all' ? selectedLevel : undefined,
    search: searchTerm || undefined
  });

  const [createDocumentType, { isLoading: isCreating }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: isUpdating }] = useUpdateDocumentTypeMutation();
  const [deleteDocumentType, { isLoading: isDeleting }] = useDeleteDocumentTypeMutation();
  const [toggleDocumentTypeStatus, { isLoading: isToggling }] = useToggleDocumentTypeStatusMutation();
  

  const { data: settings, isLoading: isLoadingSettings } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdatingSettings }] = useUpdateSystemSettingsMutation();

  // Fetch officer roles for dropdowns
  const { data: officerRolesData, isLoading: isLoadingRoles } = useGetOfficerRolesQuery();

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

  const [globalSettings, setGlobalSettings] = useState({
    maxFileSize: 5,
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    defaultSla: 7,
    urgentFeeMultiplier: 2,
    feeTypes: ['Fixed', 'Variable', 'Urgent Only']
  });

  const [rejectionTemplates, setRejectionTemplates] = useState([]);
  const [approvalTemplates, setApprovalTemplates] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Get document types data
  const documentTypes = documentTypesData?.data || [];

  // Load settings from API
  useEffect(() => {
    if (settings?.data) {
      setGlobalSettings({
        maxFileSize: settings.data.maxFileSize || 5,
        allowedFormats: settings.data.allowedFormats || ['PDF', 'JPG', 'PNG'],
        defaultSla: settings.data.defaultSla || 7,
        urgentFeeMultiplier: settings.data.urgentFeeMultiplier || 2,
        feeTypes: settings.data.feeTypes || ['Fixed', 'Variable', 'Urgent Only']
      });
      setRejectionTemplates(settings.data.rejectionTemplates || []);
      setApprovalTemplates(settings.data.approvalTemplates || []);
    }
  }, [settings]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Filter configurations (client-side filtering as backup, but API already filters)
  const filteredConfigs = documentTypes.filter(config => {
    // Search filter (additional client-side filter)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        config.name?.toLowerCase().includes(searchLower) ||
        config.type?.toLowerCase().includes(searchLower) ||
        config.description?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
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
    if (!dateString) return 'N/A';
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

    if (!formData.name?.trim()) {
      newErrors.name = 'Certificate name is required';
    }
    if (!formData.type?.trim()) {
      newErrors.type = 'Certificate type is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.processingLevel) {
      newErrors.processingLevel = 'Processing level is required';
    }
    if (!formData.slaDays || formData.slaDays < 1) {
      newErrors.slaDays = 'Valid SLA days is required';
    }
    if (formData.fee === undefined || formData.fee < 0) {
      newErrors.fee = 'Valid fee amount is required';
    }
    if (!formData.validFor?.trim()) {
      newErrors.validFor = 'Validity period is required';
    }
    if (!formData.authority?.trim()) {
      newErrors.authority = 'Issuing authority is required';
    }

    // Check hierarchy
    if (formData.hierarchy.length === 0) {
      newErrors.hierarchy = 'At least one processing level is required';
    }

    // Check if each level has at least one officer
    formData.hierarchy.forEach((level, index) => {
      if (level.officers.length === 0) {
        newErrors[`hierarchy_${index}`] = `At least one officer must be assigned at ${level.level} level`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create config
  const handleCreateConfig = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await createDocumentType(formData).unwrap();
      
      showToastMessage(`Certificate ${formData.name} created successfully!`, 'success');

      setShowConfigModal(false);
      resetForm();
      refetchDocuments();

    } catch (error) {
      if (error.data?.field) {
        setErrors({
          [error.data.field]: error.data.message
        });
      } else {
        setErrors({
          submit: error?.data?.message || 'Failed to create certificate type'
        });
      }
    }
  };

  // Handle update config
  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateDocumentType({
        id: selectedConfig._id,
        ...formData
      }).unwrap();
      
      showToastMessage(`Certificate ${formData.name} updated successfully!`, 'success');

      setShowConfigModal(false);
      resetForm();
      setSelectedConfig(null);
      refetchDocuments();

    } catch (error) {
      if (error.data?.field) {
        setErrors({
          [error.data.field]: error.data.message
        });
      } else {
        setErrors({
          submit: error?.data?.message || 'Failed to update certificate type'
        });
      }
    }
  };

  // Handle delete config
  const handleDelete = async (config) => {
    if (!window.confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDocumentType(config._id).unwrap();
      showToastMessage(`Certificate "${config.name}" deleted successfully`, 'success');
      refetchDocuments();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to delete certificate type', 'error');
    }
  };

  // Handle duplicate config
  const handleDuplicate = async (config) => {
    try {
      await duplicateDocumentType(config._id).unwrap();
      showToastMessage(`Certificate duplicated successfully`, 'success');
      refetchDocuments();
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to duplicate certificate type', 'error');
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (config) => {
    try {
      await toggleDocumentTypeStatus({
        id: config._id,
        isActive: !config.isActive
      }).unwrap();
      
      showToastMessage(`Certificate ${config.isActive ? 'deactivated' : 'activated'} successfully`, 'success');
      refetchDocuments();
    } catch (error) {
      showToastMessage(error?.data?.message || `Failed to ${config.isActive ? 'deactivate' : 'activate'} certificate`, 'error');
    }
  };

  // Handle save global settings
  const handleSaveGlobalSettings = async () => {
    try {
      await updateSystemSettings({
        ...globalSettings,
        rejectionTemplates,
        approvalTemplates
      }).unwrap();
      
      showToastMessage('Global settings updated successfully', 'success');
    } catch (error) {
      showToastMessage(error?.data?.message || 'Failed to update global settings', 'error');
    }
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
      requiredDocs: config.requiredDocs || [],
      rejectionReasons: config.rejectionReasons || [''],
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

  // Handle template management
  const handleAddRejectionTemplate = () => {
    setRejectionTemplates(prev => [...prev, { title: '', content: '' }]);
  };

  const handleUpdateRejectionTemplate = (index, field, value) => {
    setRejectionTemplates(prev => prev.map((template, i) =>
      i === index ? { ...template, [field]: value } : template
    ));
  };

  const handleRemoveRejectionTemplate = (index) => {
    setRejectionTemplates(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddApprovalTemplate = () => {
    setApprovalTemplates(prev => [...prev, { title: '', content: '' }]);
  };

  const handleUpdateApprovalTemplate = (index, field, value) => {
    setApprovalTemplates(prev => prev.map((template, i) =>
      i === index ? { ...template, [field]: value } : template
    ));
  };

  const handleRemoveApprovalTemplate = (index) => {
    setApprovalTemplates(prev => prev.filter((_, i) => i !== index));
  };

  const isLoading = isLoadingDocuments || isLoadingSettings;

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
            onClick={() => setSelectedType('all')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              selectedType === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Certificate Types
          </button>
          <button
            onClick={() => setSelectedType('templates')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              selectedType === 'templates'
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
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedLevel('all');
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Certificate Types List */}
      {selectedType !== 'templates' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading document types...</p>
            </div>
          ) : filteredConfigs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificate types found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or add a new certificate type</p>
              <button
                onClick={() => {
                  setModalMode('create');
                  resetForm();
                  setShowConfigModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Certificate Type
              </button>
            </div>
          ) : (
            filteredConfigs.map(config => (
              <div key={config._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => toggleConfig(config._id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        {expandedConfigs.includes(config._id) ? (
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
                    <span className="text-gray-600">Applications: {config.totalApplications || 0}</span>
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
                {expandedConfigs.includes(config._id) && (
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
                                {level.officers?.map(officer => (
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
                        {config.requiredDocs?.map((doc, idx) => (
                          <div key={idx} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                            <div className={`mt-0.5 w-2 h-2 rounded-full ${doc.required ? 'bg-red-500' : 'bg-gray-400'}`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Max: {doc.maxSize} | Formats: {doc.formats?.join(', ')}
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
                        {config.rejectionReasons?.map((reason, idx) => (
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
                        <p className="text-sm text-gray-900">{formatDate(config.updatedAt)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(config)}
                        disabled={isUpdating}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(config)}
                        disabled={isDuplicating}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(config)}
                        disabled={isToggling}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
                        onClick={() => handleDelete(config)}
                        disabled={isDeleting}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Templates & Settings Tab */}
      {selectedType === 'templates' && (
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
                  value={globalSettings.maxFileSize}
                  onChange={(e) => setGlobalSettings({...globalSettings, maxFileSize: parseInt(e.target.value)})}
                  min="1"
                  max="100"
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
                      <input 
                        type="checkbox" 
                        checked={globalSettings.allowedFormats.includes(format)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGlobalSettings({
                              ...globalSettings,
                              allowedFormats: [...globalSettings.allowedFormats, format]
                            });
                          } else {
                            setGlobalSettings({
                              ...globalSettings,
                              allowedFormats: globalSettings.allowedFormats.filter(f => f !== format)
                            });
                          }
                        }}
                        className="rounded text-blue-600" 
                      />
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
                  value={globalSettings.defaultSla}
                  onChange={(e) => setGlobalSettings({...globalSettings, defaultSla: parseInt(e.target.value)})}
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Urgent Fee Multiplier
                </label>
                <input
                  type="number"
                  value={globalSettings.urgentFeeMultiplier}
                  onChange={(e) => setGlobalSettings({...globalSettings, urgentFeeMultiplier: parseFloat(e.target.value)})}
                  step="0.5"
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={handleSaveGlobalSettings}
                disabled={isUpdatingSettings}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isUpdatingSettings ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Global Settings'
                )}
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
              {rejectionTemplates.map((template, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={template.title}
                      onChange={(e) => handleUpdateRejectionTemplate(index, 'title', e.target.value)}
                      className="text-sm font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Template Title"
                    />
                    <button
                      onClick={() => handleRemoveRejectionTemplate(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                  <textarea
                    value={template.content}
                    onChange={(e) => handleUpdateRejectionTemplate(index, 'content', e.target.value)}
                    rows="2"
                    className="w-full text-xs text-gray-600 bg-transparent border rounded p-2"
                    placeholder="Template content..."
                  />
                </div>
              ))}
              <button
                onClick={handleAddRejectionTemplate}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Template
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
              {approvalTemplates.map((template, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={template.title}
                      onChange={(e) => handleUpdateApprovalTemplate(index, 'title', e.target.value)}
                      className="text-sm font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Template Title"
                    />
                    <button
                      onClick={() => handleRemoveApprovalTemplate(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                  <textarea
                    value={template.content}
                    onChange={(e) => handleUpdateApprovalTemplate(index, 'content', e.target.value)}
                    rows="2"
                    className="w-full text-xs text-gray-600 bg-transparent border rounded p-2"
                    placeholder="Template content..."
                  />
                </div>
              ))}
              <button
                onClick={handleAddApprovalTemplate}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Template
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
                  Fee Types
                </label>
                <div className="space-y-2">
                  {feeTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={globalSettings.feeTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGlobalSettings({
                              ...globalSettings,
                              feeTypes: [...globalSettings.feeTypes, type]
                            });
                          } else {
                            setGlobalSettings({
                              ...globalSettings,
                              feeTypes: globalSettings.feeTypes.filter(t => t !== type)
                            });
                          }
                        }}
                        className="rounded text-blue-600" 
                      />
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

            <form onSubmit={modalMode === 'create' ? handleCreateConfig : handleUpdateConfig} className="p-6 space-y-6">
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
                          {(level.level === 'GRAM' ? officerRolesData?.GRAM || [] : 
                            level.level === 'TEHSIL' ? officerRolesData?.TEHSIL || [] : 
                            officerRolesData?.DISTRICT || []).map(officer => (
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
                        {errors[`hierarchy_${index}`] && (
                          <p className="mt-1 text-xs text-red-600">{errors[`hierarchy_${index}`]}</p>
                        )}

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
                      {globalSettings.feeTypes.map(type => (
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
                            {globalSettings.allowedFormats.map(format => (
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
                  disabled={isCreating || isUpdating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {modalMode === 'create' ? 'Creating...' : 'Updating...'}
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
                  <p className="text-2xl font-bold text-blue-600">{selectedConfig.totalApplications || 0}</p>
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
                          {level.officers?.map(officer => (
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
                  <p className="text-sm text-gray-900">{formatDate(selectedConfig.updatedAt)}</p>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Required Documents</h3>
                <div className="space-y-2">
                  {selectedConfig.requiredDocs?.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full ${doc.required ? 'bg-red-500' : 'bg-gray-400'} mr-2`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max Size: {doc.maxSize} | Formats: {doc.formats?.join(', ')}
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
                  {selectedConfig.rejectionReasons?.map((reason, idx) => (
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