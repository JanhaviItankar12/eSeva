import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Home,
  PlusCircle,
  Edit3,
  Save,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Layers,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight
} from 'lucide-react';
import {
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeActivateOfficeMutation,
  useActivateOfficeMutation
} from '../../../features/api/adminApi';
import {
  useGetDistrictsQuery,
  useGetTehsilsQuery,
  useGetGramPanchayatsQuery,
  useGetOfficeByIdQuery,
  officeApi
} from '../../../features/api/officeApi';
import { useDispatch } from 'react-redux';

// Regions for dropdown
const regions = ["Central", "Northern", "Southern", "Eastern", "Western", "North-Eastern"];

const ITEMS_PER_PAGE = 5;
const OfficeSetupPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedDistricts, setExpandedDistricts] = useState({});
  const [expandedTehsils, setExpandedTehsils] = useState({});
  const dispatch = useDispatch();

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showTehsilModal, setShowTehsilModal] = useState(false);
  const [showGramModal, setShowGramModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [districtModalMode, setDistrictModalMode] = useState('create');
  const [tehsilModalMode, setTehsilModalMode] = useState('create');
  const [gramModalMode, setGramModalMode] = useState('create');

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [viewOfficeData, setViewOfficeData] = useState(null);

  // State for fetching tehsils and gram panchayats dynamically
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedTehsilId, setSelectedTehsilId] = useState(null);

  // Form states
  const [districtForm, setDistrictForm] = useState({
    officeName: '',
    officeLevel: 'DISTRICT',
    region: '',
    pincode: '',
    address: ''
  });

  const [tehsilForm, setTehsilForm] = useState({
    officeName: '',
    officeLevel: 'TEHSIL',
    parentOffice: '',
    pincode: '',
    address: ''
  });

  const [gramForm, setGramForm] = useState({
    officeName: '',
    officeLevel: 'GRAM',
    parentOffice: '',
    pincode: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // API Hooks
  const [createOffice, { isLoading: isCreating }] = useCreateOfficeMutation();
  const [updateOffice, { isLoading: isUpdating }] = useUpdateOfficeMutation();
  const [deActivateOffice, { isLoading: isDeactivating }] = useDeActivateOfficeMutation();
  const [activateOffice, { isLoading: isActivating }] = useActivateOfficeMutation();

  // Fetch all districts
  const {
    data: districtsResponse,
    isLoading: isLoadingDistricts,
    refetch: refetchDistricts
  } = useGetDistrictsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Fetch tehsils for a specific district when expanded
  const {
    data: tehsilsResponse,
    isLoading: isLoadingTehsils,
    refetch: refetchTehsils
  } = useGetTehsilsQuery(selectedDistrictId, {
    skip: !selectedDistrictId,
    refetchOnMountOrArgChange: true,
  });

  // Fetch gram panchayats for a specific tehsil when expanded
  const {
    data: gramPanchayatsResponse,
    isLoading: isLoadingGram,
    refetch: refetchGram
  } = useGetGramPanchayatsQuery(selectedTehsilId, {
    skip: !selectedTehsilId,
    refetchOnMountOrArgChange: true,
  });

  // Extract districts data
  const districts = districtsResponse?.data || [];

  // Filter districts
  const filterDistricts = (districts) => {
    return districts.filter(district => {
      if (selectedRegion !== 'all' && district.region !== selectedRegion) return false;
      if (selectedStatus !== 'all') {
        const statusMatch = selectedStatus === 'active' ? district.isActive === true : district.isActive === false;
        if (!statusMatch) return false;
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return district.officeName?.toLowerCase().includes(searchLower) ||
          district.region?.toLowerCase().includes(searchLower);
      }
      return true;
    });
  };

  const filteredDistricts = filterDistricts(districts);

  // Pagination
  const totalPages = Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE);
  const paginatedDistricts = filteredDistricts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedStatus]);

  // Get tehsils for a district from the query response
  const getTehsilsForDistrict = (districtId) => {
    // If this is the currently selected district and we have data, use it
    if (selectedDistrictId === districtId && tehsilsResponse?.data) {
      return tehsilsResponse.data;
    }
    return [];
  };

  // Get gram panchayats for a tehsil from the query response
  const getGramPanchayatsForTehsil = (tehsilId) => {
    // If this is the currently selected tehsil and we have data, use it
    if (selectedTehsilId === tehsilId && gramPanchayatsResponse?.data) {
      return gramPanchayatsResponse.data;
    }
    return [];
  };

  // Fetch single office for view modal
  const {
    data: officeDetailsResponse,
    isLoading: isLoadingOffice
  } = useGetOfficeByIdQuery(selectedOffice?._id, {
    skip: !selectedOffice || !showViewModal
  });

  useEffect(() => {
    if (officeDetailsResponse?.data) {
      setViewOfficeData(officeDetailsResponse.data);
    }
  }, [officeDetailsResponse]);

  // Build hierarchy for paginated districts
  const buildHierarchy = () => {
    if (!Array.isArray(paginatedDistricts)) return [];

    return paginatedDistricts.map(district => {
      const tehsils = getTehsilsForDistrict(district._id);

      return {
        ...district,
        tehsils: tehsils
          .filter(tehsil => {
            if (selectedStatus !== 'all') {
              return selectedStatus === 'active' ? tehsil.isActive === true : tehsil.isActive === false;
            }
            return true;
          })
          .map(tehsil => ({
            ...tehsil,
            gramPanchayats: getGramPanchayatsForTehsil(tehsil._id)
              .filter(gram => {
                if (selectedStatus !== 'all') {
                  return selectedStatus === 'active' ? gram.isActive === true : gram.isActive === false;
                }
                return true;
              })
          }))
      };
    });
  };

  const hierarchyData = buildHierarchy();

  // Toggle functions
  const toggleDistrict = (districtId) => {
    const newExpandedState = !expandedDistricts[districtId];

    setExpandedDistricts(prev => ({
      ...prev,
      [districtId]: newExpandedState
    }));

    // Fetch tehsils when expanding a district
    if (newExpandedState) {
      setSelectedDistrictId(districtId);
    }
  };

  const toggleTehsil = (tehsilId) => {
    const newExpandedState = !expandedTehsils[tehsilId];

    setExpandedTehsils(prev => ({
      ...prev,
      [tehsilId]: newExpandedState
    }));

    // Fetch gram panchayats when expanding a tehsil
    if (newExpandedState) {
      setSelectedTehsilId(tehsilId);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive
      ? 'text-green-600 bg-green-100'
      : 'text-gray-600 bg-gray-100';
  };

  // Validation functions
  const validateDistrictForm = () => {
    const newErrors = {};

    if (!districtForm.officeName?.trim()) {
      newErrors.officeName = 'District name is required';
    }
    if (!districtForm.region) {
      newErrors.region = 'Region is required';
    }
    if (!districtForm.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(districtForm.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTehsilForm = () => {
    const newErrors = {};

    if (!tehsilForm.officeName?.trim()) {
      newErrors.officeName = 'Tehsil name is required';
    }
    if (!tehsilForm.parentOffice) {
      newErrors.parentOffice = 'Please select a parent district';
    }
    if (!tehsilForm.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(tehsilForm.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGramForm = () => {
    const newErrors = {};

    if (!gramForm.officeName?.trim()) {
      newErrors.officeName = 'Gram Panchayat name is required';
    }
    if (!gramForm.parentOffice) {
      newErrors.parentOffice = 'Please select a parent tehsil';
    }
    if (!gramForm.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(gramForm.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create district
  const handleCreateDistrict = async (e) => {
    e.preventDefault();

    if (!validateDistrictForm()) return;

    try {
      await createOffice({
        ...districtForm,
        pincode: parseInt(districtForm.pincode)
      }).unwrap();

      setSuccessMessage(`District ${districtForm.officeName} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowDistrictModal(false);
      resetDistrictForm();
      // No need for manual refetch - RTK Query handles it

    } catch (error) {
      console.error('Creation of District error:', error);
      const message = error?.data?.message || error?.message || `Failed to create district`;
      showToastMessage(message, 'error');
    }
  };

  // Handle create tehsil
  const handleCreateTehsil = async (e) => {
    e.preventDefault();

    if (!validateTehsilForm()) return;

    try {
      await createOffice({
        ...tehsilForm,
        pincode: parseInt(tehsilForm.pincode)
      }).unwrap();

      setSuccessMessage(`Tehsil ${tehsilForm.officeName} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowTehsilModal(false);
      resetTehsilForm();

      // If this tehsil's parent is currently expanded, it will auto-refresh
      if (tehsilForm.parentOffice === selectedDistrictId) {
        // The query will automatically refetch due to tag invalidation
      }

    } catch (error) {
      console.error('Creation Of Tehsil error:', error);
      const message = error?.data?.message || error?.message || `Failed to create tehsil`;
      showToastMessage(message, 'error');
    }
  };

  // Handle create gram panchayat
  const handleCreateGram = async (e) => {
    e.preventDefault();

    if (!validateGramForm()) return;

    try {
      await createOffice({
        ...gramForm,
        pincode: parseInt(gramForm.pincode)
      }).unwrap();

      setSuccessMessage(`Gram Panchayat ${gramForm.officeName} created successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowGramModal(false);
      resetGramForm();

    } catch (error) {
      console.error('Creation Gram error:', error);
      const message = error?.data?.message || error?.message || `Failed to create gram panchayat`;
      showToastMessage(message, 'error');
    }
  };

  // Handle update district
  const handleUpdateDistrict = async (e) => {
    e.preventDefault();

    if (!selectedOffice) return;

    if (!validateDistrictForm()) return;

    try {
      const updateData = {
        ...districtForm,
        pincode: parseInt(districtForm.pincode)
      };

      await updateOffice({
        id: selectedOffice._id,
        ...updateData
      }).unwrap();

      setSuccessMessage(`District updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowDistrictModal(false);
      setSelectedOffice(null);
      resetDistrictForm();

    } catch (error) {
      console.error('Update District Error:', error);
      const message = error?.data?.message || error?.message || `Failed to update district`;
      showToastMessage(message, 'error');
    }
  };

  // Handle update tehsil
  const handleUpdateTehsil = async (e) => {
    e.preventDefault();

    if (!selectedOffice) return;

    if (!validateTehsilForm()) return;

    try {
      const updateData = {
        ...tehsilForm,
        pincode: parseInt(tehsilForm.pincode)
      };

      await updateOffice({
        id: selectedOffice._id,
        ...updateData
      }).unwrap();

      setSuccessMessage(`Tehsil updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowTehsilModal(false);
      setSelectedOffice(null);
      resetTehsilForm();

    } catch (error) {
      console.error('Update Tehsil error:', error);
      const message = error?.data?.message || error?.message || `Failed to update tehsil`;
      showToastMessage(message, 'error');
    }
  };

  // Handle update gram panchayat
  const handleUpdateGram = async (e) => {
    e.preventDefault();

    if (!selectedOffice) return;

    if (!validateGramForm()) return;

    try {
      const updateData = {
        ...gramForm,
        pincode: parseInt(gramForm.pincode)
      };

      await updateOffice({
        id: selectedOffice._id,
        ...updateData
      }).unwrap();

      setSuccessMessage(`Gram Panchayat updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setShowGramModal(false);
      setSelectedOffice(null);
      resetGramForm();

    } catch (error) {
      console.error('Update Gram Error:', error);
      const message = error?.data?.message || error?.message || `Failed to update gram panchayat`;
      showToastMessage(message, 'error');
    }
  };
  // Handle activate/deactivate
  const handleActivateOffice = async (office) => {
    try {
      await activateOffice(office._id).unwrap();
      dispatch(
        officeApi.util.invalidateTags([
          { type: "District", id: "LIST" },
          { type: "Tehsil", id: "LIST" },
          { type: "Gram", id: "LIST" }
        ])
      );
      showToastMessage(`${office.officeName} activated successfully!`, 'success');
    } catch (error) {
      console.error('Activation error:', error);
      const message = error?.data?.message || error?.message || `Failed to activate ${office.officeName}`;
      showToastMessage(message, 'error');
    }
  };

  const handleDeactivateOffice = async (office) => {
    try {
      await deActivateOffice(office._id).unwrap();
      dispatch(
        officeApi.util.invalidateTags([
          { type: "District", id: "LIST" },
          { type: "Tehsil", id: "LIST" },
          { type: "Gram", id: "LIST" }
        ])
      );
      showToastMessage(`${office.officeName} deactivated successfully!`, 'success');
    } catch (error) {
      console.error('Deactivation error:', error);
      const message = error?.data?.message || error?.message || `Failed to deactivate ${office.officeName}`;
      showToastMessage(message, 'error');
    }
  };

  // Open modals
  const openViewModal = (office) => {
    setSelectedOffice(office);
    setShowViewModal(true);
  };

  const openEditDistrictModal = (district) => {
    setSelectedOffice(district);
    setDistrictModalMode('edit');
    setDistrictForm({
      officeName: district.officeName,
      officeLevel: 'DISTRICT',
      region: district.region || '',
      pincode: district.pincode?.toString() || '',
      address: district.address || ''
    });
    setShowDistrictModal(true);
  };

  const openEditTehsilModal = (tehsil) => {
    setSelectedOffice(tehsil);
    setTehsilModalMode('edit');
    setTehsilForm({
      officeName: tehsil.officeName,
      officeLevel: 'TEHSIL',
      parentOffice: tehsil.parentOffice?._id || tehsil.parentOffice || '',
      pincode: tehsil.pincode?.toString() || '',
      address: tehsil.address || ''
    });
    setShowTehsilModal(true);
  };

  const openEditGramModal = (gram) => {
    setSelectedOffice(gram);
    setGramModalMode('edit');
    setGramForm({
      officeName: gram.officeName,
      officeLevel: 'GRAM',
      parentOffice: gram.parentOffice?._id || gram.parentOffice || '',
      pincode: gram.pincode?.toString() || '',
      address: gram.address || ''
    });
    setShowGramModal(true);
  };

  // Reset forms
  const resetDistrictForm = () => {
    setDistrictForm({
      officeName: '',
      officeLevel: 'DISTRICT',
      region: '',
      pincode: '',
      address: ''
    });
    setErrors({});
    setDistrictModalMode('create');
  };

  const resetTehsilForm = () => {
    setTehsilForm({
      officeName: '',
      officeLevel: 'TEHSIL',
      parentOffice: '',
      pincode: '',
      address: ''
    });
    setErrors({});
    setTehsilModalMode('create');
  };

  const resetGramForm = () => {
    setGramForm({
      officeName: '',
      officeLevel: 'GRAM',
      parentOffice: '',
      pincode: '',
      address: ''
    });
    setErrors({});
    setGramModalMode('create');
  };

  // Get parent office name
  const getParentOfficeName = (office) => {
    if (!office.parentOffice) return 'None';
    if (typeof office.parentOffice === 'object') {
      return office.parentOffice.officeName;
    }
    const parent = districts.find(d => d._id === office.parentOffice);
    return parent?.officeName || 'Unknown';
  };

  // Loading states
  const isTehsilsLoading = (districtId) => {
    return isLoadingTehsils && selectedDistrictId === districtId;
  };

  const isGramLoading = (tehsilId) => {
    return isLoadingGram && selectedTehsilId === tehsilId;
  };

  // Count functions
  const getTehsilCount = (district) => {
    return district.tehsilCount || 0;
  };

  const getGramCount = (tehsil) => {
    return tehsil.gramCount || 0;
  };

  // Pagination
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Add this function to get all tehsils for dropdown
const getAllTehsils = () => {
  const allTehsils = [];
  
  districts.forEach(district => {
    if (district.tehsils && Array.isArray(district.tehsils)) {
      allTehsils.push(...district.tehsils);
    }
  });
  
  // If you have tehsils loaded via the API response
  if (tehsilsResponse?.data && Array.isArray(tehsilsResponse.data)) {
    tehsilsResponse.data.forEach(tehsil => {
      if (!allTehsils.find(t => t._id === tehsil._id)) {
        allTehsils.push(tehsil);
      }
    });
  }
  
  return allTehsils;
};

// Add this useEffect
useEffect(() => {
  if (showGramModal && districts.length > 0) {
    // If you need to ensure tehsils are loaded
    districts.forEach(district => {
      if (district.tehsils?.length > 0) {
        // Tehsils are already loaded
      } else {
        // Trigger loading of tehsils if needed
        setSelectedDistrictId(district._id);
      }
    });
  }
}, [showGramModal, districts]);

  return (
    <div className="space-y-6">
      {/* Toast */}
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
              resetDistrictForm();
              setShowDistrictModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add District
          </button>
          <button
            onClick={() => {
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
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Hierarchy View */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoadingDistricts ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading office hierarchy...</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {hierarchyData.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offices found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or add a new office</p>
                </div>
              ) : (
                hierarchyData.map(district => {
                  const tehsilCount = getTehsilCount(district);
                  return (
                    <div key={district._id} className="p-4">
                      {/* District Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleDistrict(district._id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {expandedDistricts[district._id] ? (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            )}
                          </button>
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{district.officeName}</h3>
                            <p className="text-xs text-gray-500">
                              Region: {district.region} | Pincode: {district.pincode}
                            </p>
                            {district.address && (
                              <p className="text-xs text-gray-400 mt-1">{district.address}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(district.isActive)}`}>
                            {district.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {tehsilCount} Tehsils
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => openViewModal(district)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => openEditDistrictModal(district)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit District"
                            >
                              <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>
                            {district.isActive ? (
                              <button
                                onClick={() => handleDeactivateOffice(district)}
                                disabled={isDeactivating}
                                className="p-1 hover:bg-gray-100 rounded text-orange-600"
                                title="Deactivate"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateOffice(district)}
                                disabled={isActivating}
                                className="p-1 hover:bg-gray-100 rounded text-green-600"
                                title="Activate"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tehsils */}
                      {expandedDistricts[district._id] && (
                        <div className="ml-12 mt-4 space-y-3">
                          {isTehsilsLoading(district._id) ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                              <p className="text-xs text-gray-500 mt-2">Loading tehsils...</p>
                            </div>
                          ) : district.tehsils && district.tehsils.length > 0 ? (
                            district.tehsils.map(tehsil => {
                              const gramCount = getGramCount(tehsil);
                              return (
                                <div key={tehsil._id} className="border-l-2 border-blue-200 pl-4">
                                  {/* Tehsil Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => toggleTehsil(tehsil._id)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                      >
                                        {expandedTehsils[tehsil._id] ? (
                                          <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                      </button>
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900">{tehsil.officeName}</h4>
                                        <p className="text-xs text-gray-500">Pincode: {tehsil.pincode}</p>
                                        {tehsil.address && (
                                          <p className="text-xs text-gray-400">{tehsil.address}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tehsil.isActive)}`}>
                                        {tehsil.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {gramCount} GPs
                                      </span>
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => openViewModal(tehsil)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                          title="View Details"
                                        >
                                          <Eye className="w-3 h-3 text-gray-500" />
                                        </button>
                                        <button
                                          onClick={() => openEditTehsilModal(tehsil)}
                                          className="p-1 hover:bg-gray-100 rounded"
                                          title="Edit Tehsil"
                                        >
                                          <Edit3 className="w-3 h-3 text-gray-500" />
                                        </button>
                                        {tehsil.isActive ? (
                                          <button
                                            onClick={() => handleDeactivateOffice(tehsil)}
                                            disabled={isDeactivating}
                                            className="p-1 hover:bg-gray-100 rounded text-orange-600"
                                            title="Deactivate"
                                          >
                                            <EyeOff className="w-3 h-3" />
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => handleActivateOffice(tehsil)}
                                            disabled={isActivating}
                                            className="p-1 hover:bg-gray-100 rounded text-green-600"
                                            title="Activate"
                                          >
                                            <Eye className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Gram Panchayats */}
                                  {expandedTehsils[tehsil._id] && (
                                    <div className="ml-12 mt-3 space-y-2">
                                      {isGramLoading(tehsil._id) ? (
                                        <div className="text-center py-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
                                          <p className="text-xs text-gray-500 mt-1">Loading gram panchayats...</p>
                                        </div>
                                      ) : tehsil.gramPanchayats && tehsil.gramPanchayats.length > 0 ? (
                                        tehsil.gramPanchayats.map(gram => (
                                          <div key={gram._id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center space-x-3">
                                              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Home className="w-3 h-3 text-purple-600" />
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium text-gray-900">{gram.officeName}</p>
                                                <p className="text-xs text-gray-500">Pincode: {gram.pincode}</p>
                                                {gram.address && (
                                                  <p className="text-xs text-gray-400">{gram.address}</p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(gram.isActive)}`}>
                                                {gram.isActive ? 'Active' : 'Inactive'}
                                              </span>
                                              <div className="flex space-x-1">
                                                <button
                                                  onClick={() => openViewModal(gram)}
                                                  className="p-1 hover:bg-gray-100 rounded"
                                                  title="View Details"
                                                >
                                                  <Eye className="w-3 h-3 text-gray-500" />
                                                </button>
                                                <button
                                                  onClick={() => openEditGramModal(gram)}
                                                  className="p-1 hover:bg-gray-100 rounded"
                                                  title="Edit GP"
                                                >
                                                  <Edit3 className="w-3 h-3 text-gray-500" />
                                                </button>
                                                {gram.isActive ? (
                                                  <button
                                                    onClick={() => handleDeactivateOffice(gram)}
                                                    disabled={isDeactivating}
                                                    className="p-1 hover:bg-gray-100 rounded text-orange-600"
                                                    title="Deactivate"
                                                  >
                                                    <EyeOff className="w-3 h-3" />
                                                  </button>
                                                ) : (
                                                  <button
                                                    onClick={() => handleActivateOffice(gram)}
                                                    disabled={isActivating}
                                                    className="p-1 hover:bg-gray-100 rounded text-green-600"
                                                    title="Activate"
                                                  >
                                                    <Eye className="w-3 h-3" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-xs text-gray-500 text-center py-2">No gram panchayats found</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-gray-500 text-center py-2">No tehsils found</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {filteredDistricts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredDistricts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredDistricts.length}</span> districts
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
                    <ChevronRightIcon className="w-4 h-4" />
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
          </>
        )}
      </div>

      {/* View Office Details Modal */}
      {showViewModal && viewOfficeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Office Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {viewOfficeData.officeLevel} Information
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOffice(null);
                  setViewOfficeData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {isLoadingOffice ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading details...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Office Name</p>
                      <p className="text-sm font-medium text-gray-900">{viewOfficeData.officeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Office Level</p>
                      <p className="text-sm font-medium text-gray-900">{viewOfficeData.officeLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Region</p>
                      <p className="text-sm font-medium text-gray-900">{viewOfficeData.region || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pincode</p>
                      <p className="text-sm font-medium text-gray-900">{viewOfficeData.pincode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Parent Office</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getParentOfficeName(viewOfficeData)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(viewOfficeData.isActive)}`}>
                        {viewOfficeData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                {viewOfficeData.address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Address</h3>
                    <p className="text-sm text-gray-700">{viewOfficeData.address}</p>
                  </div>
                )}

                {/* Child Offices */}
                {viewOfficeData.children && viewOfficeData.children.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {viewOfficeData.officeLevel === 'DISTRICT' ? 'Tehsils' : 'Gram Panchayats'}
                    </h3>
                    <div className="space-y-2">
                      {viewOfficeData.children.map(child => (
                        <div key={child._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div className="flex items-center space-x-2">
                            {viewOfficeData.officeLevel === 'DISTRICT' ? (
                              <MapPin className="w-4 h-4 text-green-600" />
                            ) : (
                              <Home className="w-4 h-4 text-purple-600" />
                            )}
                            <span className="text-sm text-gray-900">{child.officeName}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(child.isActive)}`}>
                            {child.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="text-sm text-gray-900">{formatDate(viewOfficeData.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(viewOfficeData.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedOffice(null);
                      setViewOfficeData(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit District Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {districtModalMode === 'create' ? 'Add New District' : 'Edit District'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {districtModalMode === 'create' ? 'Create a new district in the hierarchy' : 'Update district information'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDistrictModal(false);
                  setSelectedOffice(null);
                  resetDistrictForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={districtModalMode === 'create' ? handleCreateDistrict : handleUpdateDistrict} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={districtForm.officeName}
                  onChange={(e) => setDistrictForm({ ...districtForm, officeName: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.officeName ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Lucknow"
                />
                {errors.officeName && <p className="mt-1 text-xs text-red-600">{errors.officeName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={districtForm.region}
                  onChange={(e) => setDistrictForm({ ...districtForm, region: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.region ? 'border-red-500' : 'border-gray-300'
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={districtForm.pincode}
                  onChange={(e) => setDistrictForm({ ...districtForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  maxLength="6"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="226001"
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={districtForm.address}
                  onChange={(e) => setDistrictForm({ ...districtForm, address: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDistrictModal(false);
                    setSelectedOffice(null);
                    resetDistrictForm();
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
                      {districtModalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {districtModalMode === 'create' ? 'Create District' : 'Update District'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Tehsil Modal */}
      {showTehsilModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {tehsilModalMode === 'create' ? 'Add New Tehsil' : 'Edit Tehsil'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {tehsilModalMode === 'create' ? 'Create a new tehsil under a district' : 'Update tehsil information'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTehsilModal(false);
                  setSelectedOffice(null);
                  resetTehsilForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={tehsilModalMode === 'create' ? handleCreateTehsil : handleUpdateTehsil} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Parent District <span className="text-red-500">*</span>
                </label>
                <select
                  value={tehsilForm.parentOffice}
                  onChange={(e) => setTehsilForm({ ...tehsilForm, parentOffice: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.parentOffice ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district._id} value={district._id}>{district.officeName}</option>
                  ))}
                </select>
                {errors.parentOffice && <p className="mt-1 text-xs text-red-600">{errors.parentOffice}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tehsil Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tehsilForm.officeName}
                  onChange={(e) => setTehsilForm({ ...tehsilForm, officeName: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.officeName ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Sadar"
                />
                {errors.officeName && <p className="mt-1 text-xs text-red-600">{errors.officeName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tehsilForm.pincode}
                  onChange={(e) => setTehsilForm({ ...tehsilForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  maxLength="6"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="226001"
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={tehsilForm.address}
                  onChange={(e) => setTehsilForm({ ...tehsilForm, address: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTehsilModal(false);
                    setSelectedOffice(null);
                    resetTehsilForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {tehsilModalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {tehsilModalMode === 'create' ? 'Create Tehsil' : 'Update Tehsil'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Gram Panchayat Modal */}
      {showGramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {gramModalMode === 'create' ? 'Add New Gram Panchayat' : 'Edit Gram Panchayat'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {gramModalMode === 'create' ? 'Create a new gram panchayat under a tehsil' : 'Update gram panchayat information'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGramModal(false);
                  setSelectedOffice(null);
                  resetGramForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={gramModalMode === 'create' ? handleCreateGram : handleUpdateGram} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Parent Tehsil <span className="text-red-500">*</span>
                </label>
               {/* Replace the problematic select section */}
<select
  value={gramForm.parentOffice}
  onChange={(e) => setGramForm({ ...gramForm, parentOffice: e.target.value })}
  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.parentOffice ? 'border-red-500' : 'border-gray-300'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
>
  <option value="">Select Tehsil</option>
  {getAllTehsils().map(tehsil => {
    // Find parent district for context
    const parentDistrict = districts.find(d => 
      d._id === (tehsil.parentOffice?._id || tehsil.parentOffice)
    );
    return (
      <option key={tehsil._id} value={tehsil._id}>
        {tehsil.officeName} 
        {parentDistrict ? ` (${parentDistrict.officeName} District)` : ''}
      </option>
    );
  })}
</select>
                {errors.parentOffice && <p className="mt-1 text-xs text-red-600">{errors.parentOffice}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gram Panchayat Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={gramForm.officeName}
                  onChange={(e) => setGramForm({ ...gramForm, officeName: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.officeName ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g., Rajapur"
                />
                {errors.officeName && <p className="mt-1 text-xs text-red-600">{errors.officeName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={gramForm.pincode}
                  onChange={(e) => setGramForm({ ...gramForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  maxLength="6"
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="226001"
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={gramForm.address}
                  onChange={(e) => setGramForm({ ...gramForm, address: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGramModal(false);
                    setSelectedOffice(null);
                    resetGramForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {gramModalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {gramModalMode === 'create' ? 'Create Gram Panchayat' : 'Update Gram Panchayat'}
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