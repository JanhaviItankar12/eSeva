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
  UserCog,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightPaginate,
  ChevronsRight
} from 'lucide-react';
import {
  useAllCertificatesQuery,
  useCertificateByIdQuery,
  useCreateCertificateMutation,
  useGetSystemSettingsQuery,
  useToggleCertificateMutation,
  useUpdateCertificateMutation,
  useUpdateSystemSettingsMutation
} from '../../../features/api/adminApi';
import {
  useOfficerRolesQuery
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page

  // Get unique types and levels from actual data
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);

  // API Hooks
  const {
    data: certificatesData,
    isLoading: isLoadingCertificates,
    refetch: refetchCertificates
  } = useAllCertificatesQuery({
    type: selectedType !== 'all' ? selectedType : undefined,
    processingLevel: selectedLevel !== 'all' ? selectedLevel : undefined,
    search: searchTerm || undefined
  });

  const [createCertificate, { isLoading: isCreating }] = useCreateCertificateMutation();
  const [updateCertificate, { isLoading: isUpdating }] = useUpdateCertificateMutation();
  const [toggleCertificate, { isLoading: isToggling }] = useToggleCertificateMutation();

  const { data: settings, isLoading: isLoadingSettings } = useGetSystemSettingsQuery();
  const [updateSystemSettings, { isLoading: isUpdatingSettings }] = useUpdateSystemSettingsMutation();

  // Fetch officer roles for dropdowns
  const { data: officerRolesData, isLoading: isLoadingRoles } = useOfficerRolesQuery();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    hierarchy: [
      { level: 'GRAM', officers: [], canApprove: false }
    ],
    processingLevel: 'GRAM',
    slaDays: settings?.data?.defaultSLADays,
    fee: 0,
    feeType: 'Fixed',
    isActive: true,
    requiredDocs: [],
    rejectionReasons: [''],
    validFor: '',
    authority: '',
    maxFileSize: settings?.data?.maxFileSize,
    allowedFormats: settings?.data?.allowedFileTypes
  });

  const [globalSettings, setGlobalSettings] = useState({
    maxFileSize: settings?.data?.maxFileSize,
    allowedFormats: settings?.data?.allowedFileTypes,
    defaultSla: settings?.data?.defaultSLADays,
    urgentFeeMultiplier: settings?.data?.urgentFeeMultiplier,
    feeTypes: settings?.data?.feeTypes
  });

  const [rejectionTemplates, setRejectionTemplates] = useState([]);
  const [approvalTemplates, setApprovalTemplates] = useState([]);

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Get certificates data
  const certificates = certificatesData?.certificateData || [];

  // Extract unique types and levels from certificates data
  useEffect(() => {
    if (certificates.length > 0) {
      // Get unique certificate types
      const types = [...new Set(certificates.map(cert => cert.type))].filter(Boolean);
      setAvailableTypes(types);

      // Get unique processing levels
      const levels = [...new Set(certificates.map(cert => cert.processingLevel))].filter(Boolean);
      setAvailableLevels(levels);
    }
  }, [certificates]);

  // Load settings from API
  useEffect(() => {
    if (settings?.data) {
      setGlobalSettings({
        maxFileSize: settings.data.maxFileSize || 5,
        allowedFormats: settings.data.allowedFileTypes || ['PDF', 'JPG', 'PNG'],
        defaultSla: settings.data.defaultSLADays || 7,
        urgentFeeMultiplier: settings.data.urgentFeeMultiplier || 2,
        feeTypes: settings.data.feeTypes || ['Fixed', 'Variable', 'Urgent Only']
      });
      setRejectionTemplates(settings.data.rejectionTemplates || []);
      setApprovalTemplates(settings.data.approvalTemplates || []);
    }
  }, [settings]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedLevel]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Filter certificates (client-side filtering as backup, but API already filters)
  const filteredCertificates = certificates.filter(cert => {
    // Search filter (additional client-side filter)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches =
        cert.name?.toLowerCase().includes(searchLower) ||
        cert.type?.toLowerCase().includes(searchLower) ||
        cert.description?.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    return true;
  });

  // Pagination calculations
  const totalItems = filteredCertificates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Toggle certificate expansion
  const toggleCertificateStatus = (certId) => {
    setExpandedConfigs(prev =>
      prev.includes(certId)
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
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

    // Check if authority is present in the hierarchy officers
    if (formData.authority) {
      const authorityFound = formData.hierarchy.some(level => 
        level.officers.includes(formData.authority)
      );
      
      if (!authorityFound) {
        newErrors.authority = 'Issuing authority must be assigned in the hierarchy';
      }
    }

    if (!formData.feeType) {
      newErrors.feeType = 'Fee type is required';
    }

    // Check hierarchy
    if (formData.hierarchy.length === 0) {
      newErrors.hierarchy = 'At least one processing level is required';
    } else {
      // Check each level for officers
      formData.hierarchy.forEach((level, index) => {
        let availableOfficers = [];
        
        if (officerRolesData?.data) {
          if (level.level === 'GRAM') {
            availableOfficers = officerRolesData.data.GRAM || [];
          } else if (level.level === 'TEHSIL') {
            availableOfficers = officerRolesData.data.TEHSIL || [];
          } else if (level.level === 'DISTRICT') {
            availableOfficers = officerRolesData.data.DISTRICT || [];
          }
        }

        // Only validate if there are actually officers available for this level
        if (availableOfficers.length > 0 && (!level.officers || level.officers.length === 0)) {
          newErrors[`hierarchy_${index}`] = 
            `At least one officer must be assigned at ${level.level} level`;
        }
        
        // For the final approval level, check if canApprove is set
        if (index === formData.hierarchy.length - 1 && !level.canApprove) {
          newErrors[`hierarchy_${index}_approval`] = 
            `Final approval level (${level.level}) must have approval permission`;
        }
      });
    }

    // Check for duplicate certificate type
    if (modalMode === 'create') {
      const existingCert = certificates.find(
        cert => cert.type?.toLowerCase() === formData.type?.toLowerCase()
      );
      if (existingCert) {
        newErrors.type = 'Certificate type already exists';
      }
    } else if (modalMode === 'edit' && selectedConfig) {
      const existingCert = certificates.find(
        cert => cert.type?.toLowerCase() === formData.type?.toLowerCase() &&
          cert._id !== selectedConfig._id
      );
      if (existingCert) {
        newErrors.type = 'Certificate type already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create certificate
  const handleCreateCertificate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await createCertificate(formData).unwrap();
      showToastMessage(`Certificate ${formData.name} created successfully!`, 'success');
      setShowConfigModal(false);
      resetForm();
      refetchCertificates();
    } catch (error) {
      if (error.data?.message?.includes('already exists') || error.data?.code === 11000) {
        setErrors({
          type: 'Certificate type already exists'
        });
      } else if (error.data?.field) {
        setErrors({
          [error.data.field]: error.data.message
        });
      } else {
        setErrors({
          submit: error?.data?.message || 'Failed to create certificate'
        });
      }
    }
  };

  // Handle update certificate
  const handleUpdateCertificate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateCertificate({
        id: selectedConfig._id,
        formData
      }).unwrap();

      showToastMessage(`Certificate ${formData.name} updated successfully!`, 'success');
      setShowConfigModal(false);
      resetForm();
      setSelectedConfig(null);
      refetchCertificates();
    } catch (error) {
      if (error.data?.message?.includes('already exists') || error.data?.code === 11000) {
        setErrors({
          type: 'Certificate type already exists'
        });
      } else if (error.data?.field) {
        setErrors({
          [error.data.field]: error.data.message
        });
      } else {
        setErrors({
          submit: error?.data?.message || 'Failed to update certificate'
        });
      }
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (certificate) => {
    try {
      await toggleCertificate({
        id: certificate._id,
        isActive: !certificate.isActive
      }).unwrap();

      showToastMessage(`Certificate ${certificate.isActive ? 'deactivated' : 'activated'} successfully`, 'success');
      refetchCertificates();
    } catch (error) {
      showToastMessage(error?.data?.message || `Failed to ${certificate.isActive ? 'deactivate' : 'activate'} certificate`, 'error');
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
  const openEditModal = (certificate) => {
    setSelectedConfig(certificate);
    setFormData({
      name: certificate.name,
      type: certificate.type,
      description: certificate.description,
      hierarchy: certificate.hierarchy || [{ level: 'GRAM', officers: [], canApprove: false }],
      processingLevel: certificate.processingLevel,
      slaDays: certificate.slaDays,
      fee: certificate.fee,
      feeType: certificate.feeType || 'Fixed',
      isActive: certificate.isActive,
      requiredDocs: certificate.requiredDocs || [],
      rejectionReasons: certificate.rejectionReasons || [''],
      validFor: certificate.validFor,
      authority: certificate.authority,
      maxFileSize: certificate.maxFileSize || 5,
      allowedFormats: certificate.allowedFormats || ['PDF', 'JPG', 'PNG']
    });
    setModalMode('edit');
    setShowConfigModal(true);
  };

  // Handle hierarchy
  const handleAddHierarchyLevel = () => {
    const currentLength = formData.hierarchy.length;
    let nextLevel;
    
    if (currentLength === 1) {
      nextLevel = 'TEHSIL';
    } else if (currentLength === 2) {
      nextLevel = 'DISTRICT';
    } else {
      return; // Max levels reached
    }
    
    setFormData(prev => ({
      ...prev,
      hierarchy: [
        ...prev.hierarchy,
        { 
          level: nextLevel, 
          officers: [], 
          canApprove: nextLevel === 'DISTRICT' // Only DISTRICT can approve by default
        }
      ]
    }));
  };

  const handleRemoveHierarchyLevel = (index) => {
    setFormData(prev => ({
      ...prev,
      hierarchy: prev.hierarchy.filter((_, i) => i !== index)
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`hierarchy_${index}`];
      return newErrors;
    });
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

      // Toggle officer selection
      const officers = level.officers.includes(officerValue)
        ? level.officers.filter(o => o !== officerValue)
        : [...level.officers, officerValue];

      const newHierarchy = [...prev.hierarchy];
      newHierarchy[levelIndex] = { ...level, officers };

      return { ...prev, hierarchy: newHierarchy };
    });

    // Clear error for this level if at least one officer is selected
    setErrors(prev => {
      const newErrors = { ...prev };
      const level = formData.hierarchy[levelIndex];
      const willHaveOfficers = level.officers.includes(officerValue)
        ? level.officers.length - 1  // Removing an officer
        : level.officers.length + 1; // Adding an officer

      // If after toggle there will be at least one officer, remove the error
      if (willHaveOfficers > 0) {
        delete newErrors[`hierarchy_${levelIndex}`];
      }

      return newErrors;
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

  // Add this function to get authority options based on processingLevel
  const getAuthorityOptions = () => {
    const options = [
      { value: 'GRAM_SEVAK', label: 'GRAM SEVAK', level: 'GRAM' },
      { value: 'SARPANCH', label: 'SARPANCH', level: 'GRAM' },
      { value: 'TEHSILDAR', label: 'TEHSILDAR', level: 'TEHSIL' },
      { value: 'COLLECTOR', label: 'COLLECTOR', level: 'DISTRICT' }
    ];
    
    // Filter based on selected processingLevel
    return options.filter(opt => opt.level === formData.processingLevel);
  };

  const isLoading = isLoadingCertificates || isLoadingSettings;

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
          <h1 className="text-2xl font-bold text-gray-900">Certificate Configuration</h1>
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
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${selectedType === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Certificate Types
          </button>
          <button
            onClick={() => setSelectedType('templates')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${selectedType === 'templates'
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
          
          {/* Certificate Type Filter - Only shows types that exist in data */}
          <select
            value={selectedType === 'all' ? 'all' : selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Processing Level Filter - Only shows levels that exist in data */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            {availableLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
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

        {/* Show filter summary */}
        {selectedType !== 'all' || selectedLevel !== 'all' ? (
          <div className="mt-3 text-xs text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} certificates
          </div>
        ) : null}
      </div>

      {/* Certificate Types List */}
      {selectedType !== 'templates' && (
        <>
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading certificate types...</p>
              </div>
            ) : currentItems.length === 0 ? (
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
              currentItems.map(certificate => (
                <div key={certificate._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Header - Clickable to expand/collapse */}
                  <div 
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" 
                    onClick={() => toggleCertificateStatus(certificate._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Expand/Collapse Button */}
                        <button 
                          className="p-1 hover:bg-gray-200 rounded focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            toggleCertificateStatus(certificate._id);
                          }}
                        >
                          {expandedConfigs.includes(certificate._id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        
                        {/* Certificate Icon */}
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        {/* Certificate Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{certificate.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{certificate.description}</p>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(certificate.processingLevel)}`}>
                          {certificate.processingLevel}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(certificate.isActive)}`}>
                          {certificate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-4 flex items-center space-x-6 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Type:</span> {certificate.type}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-medium">SLA:</span> {certificate.slaDays} days
                      </span>
                      <span className="text-gray-600">
                        <span className="font-medium">Fee:</span> ₹{certificate.fee}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-medium">Applications:</span> {certificate.totalApplications || 0}
                      </span>
                    </div>

                    {/* Hierarchy Preview */}
                    <div className="mt-3 flex items-center space-x-2">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      {certificate.hierarchy?.map((level, idx) => (
                        <div key={idx} className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level.level)}`}>
                            {level.level}
                          </span>
                          {idx < certificate.hierarchy.length - 1 && (
                            <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedConfigs.includes(certificate._id) && (
                    <div className="px-6 pb-6 border-t border-gray-200">
                      {/* Processing Hierarchy */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <GitBranch className="w-4 h-4 mr-2 text-blue-500" />
                          Processing Hierarchy
                        </h4>
                        <div className="space-y-3">
                          {certificate.hierarchy?.map((level, idx) => (
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
                          {certificate.requiredDocs?.map((doc, idx) => (
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
                          {certificate.rejectionReasons?.map((reason, idx) => (
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
                          <p className="text-sm font-medium text-gray-900">{certificate.authority}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm text-gray-900">{formatDate(certificate.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Updated</p>
                          <p className="text-sm text-gray-900">{formatDate(certificate.updatedAt)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(certificate);
                          }}
                          disabled={isUpdating}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(certificate);
                          }}
                          disabled={isToggling}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title={certificate.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {certificate.isActive ? (
                            <EyeOff className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConfig(certificate);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalItems > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1
                          ? 'cursor-not-allowed'
                          : 'hover:bg-gray-50 focus:outline-none'
                      }`}
                    >
                      <span className="sr-only">First</span>
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1
                          ? 'cursor-not-allowed'
                          : 'hover:bg-gray-50 focus:outline-none'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages
                          ? 'cursor-not-allowed'
                          : 'hover:bg-gray-50 focus:outline-none'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightPaginate className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages
                          ? 'cursor-not-allowed'
                          : 'hover:bg-gray-50 focus:outline-none'
                      }`}
                    >
                      <span className="sr-only">Last</span>
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
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
                  onChange={(e) => setGlobalSettings({ ...globalSettings, maxFileSize: parseInt(e.target.value) })}
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
                  onChange={(e) => setGlobalSettings({ ...globalSettings, defaultSla: parseInt(e.target.value) })}
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
                  onChange={(e) => setGlobalSettings({ ...globalSettings, urgentFeeMultiplier: parseFloat(e.target.value) })}
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

            <form onSubmit={modalMode === 'create' ? handleCreateCertificate : handleUpdateCertificate} className="p-6 space-y-6">
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'
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
                      onChange={(e) => setFormData({ ...formData, type: e.target.value.toUpperCase() })}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.type ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., BIRTH"
                      maxLength="10"
                    />
                    {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
                    <p className="text-xs text-gray-500 mt-1">Certificate type must be unique</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'
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
                      onChange={(e) => {
                        const newLevel = e.target.value;
                        setFormData({ 
                          ...formData, 
                          processingLevel: newLevel,
                          authority: '' // Reset authority when level changes
                        });
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.processingLevel ? 'border-red-500' : 'border-gray-300'
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
                    <select
                      value={formData.authority}
                      onChange={(e) => {
                        const selectedAuthority = e.target.value;
                        setFormData({ ...formData, authority: selectedAuthority });
                        
                        // Auto-assign this officer in hierarchy based on level
                        if (selectedAuthority) {
                          const authorityOption = getAuthorityOptions().find(opt => opt.value === selectedAuthority);
                          if (authorityOption) {
                            // Find the level in hierarchy that matches the authority's level
                            const levelIndex = formData.hierarchy.findIndex(h => h.level === authorityOption.level);
                            if (levelIndex !== -1) {
                              // Add this officer to that level if not already added
                              handleOfficerToggle(levelIndex, selectedAuthority);
                            }
                          }
                        }
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.authority ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Authority</option>
                      {getAuthorityOptions().map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} ({opt.level})
                        </option>
                      ))}
                    </select>
                    {errors.authority && (
                      <p className="mt-1 text-xs text-red-600">{errors.authority}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Validity Period <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.validFor}
                      onChange={(e) => setFormData({ ...formData, validFor: e.target.value })}
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.validFor ? 'border-red-500' : 'border-gray-300'
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
                  {formData.hierarchy.map((level, index) => {
                    // Get officers based on level from API response
                    let levelOfficers = [];
                    
                    if (officerRolesData?.data) {
                      if (level.level === 'GRAM') {
                        levelOfficers = officerRolesData.data.GRAM || [];
                      } else if (level.level === 'TEHSIL') {
                        levelOfficers = officerRolesData.data.TEHSIL || [];
                      } else if (level.level === 'DISTRICT') {
                        levelOfficers = officerRolesData.data.DISTRICT || [];
                      }
                    }

                    // If authority is selected and matches this level, highlight it
                    const isAuthorityLevel = formData.authority && 
                      ((level.level === 'GRAM' && ['GRAM_SEVAK', 'SARPANCH'].includes(formData.authority)) ||
                       (level.level === 'TEHSIL' && ['TEHSIL_CLERK', 'TEHSILDAR'].includes(formData.authority)) ||
                       (level.level === 'DISTRICT' && ['DISTRICT_CLERK', 'COLLECTOR'].includes(formData.authority)));

                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg ${
                          isAuthorityLevel 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level.level)}`}>
                              {level.level}
                            </span>
                            {index > 0 && (
                              <ArrowDown className="w-4 h-4 text-gray-400" />
                            )}
                            {isAuthorityLevel && (
                              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                                Authority Level
                              </span>
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
                            Assign Officers at {level.level} level
                          </label>
                          
                          {isLoadingRoles ? (
                            <div className="flex items-center justify-center p-4">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                              <span className="text-sm text-gray-500">Loading officer roles...</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {levelOfficers.length > 0 ? (
                                levelOfficers.map((officer) => {
                                  // Check if this officer is the selected authority
                                  const isAuthority = officer.value === formData.authority;
                                  
                                  return (
                                    <label 
                                      key={officer.value} 
                                      className={`flex items-center space-x-2 p-1 rounded ${
                                        isAuthority ? 'bg-blue-100' : ''
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={level.officers.includes(officer.value)}
                                        onChange={() => handleOfficerToggle(index, officer.value)}
                                        className="rounded text-blue-600"
                                      />
                                      <span className={`text-sm ${isAuthority ? 'font-bold text-blue-800' : 'text-gray-700'}`}>
                                        {officer.label}
                                        {isAuthority && ' (Issuing Authority)'}
                                      </span>
                                    </label>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-gray-500 italic">No officers available for this level</p>
                              )}
                            </div>
                          )}

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
                    );
                  })}
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
                      onChange={(e) => setFormData({ ...formData, slaDays: parseInt(e.target.value) })}
                      min="1"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.slaDays ? 'border-red-500' : 'border-gray-300'
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
                      onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) })}
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.fee ? 'border-red-500' : 'border-gray-300'
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
                      onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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