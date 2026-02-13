import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Info,
  HelpCircle,
  Clock,
  Zap,
  ChevronRight,
  FileUp,
  Trash2,
  Eye,
  Loader
} from 'lucide-react';
import { useCitizenInfoQuery, useApplyCertificateMutation } from '../../features/api/citizenApi';

// Certificate types with descriptions - Using your schema
const certificateTypes = [
  {
    id: "BIRTH",
    name: "Birth Certificate",
    icon: "👶",
    description: "Official document recording birth details",
    fee: "₹50",
    processingTime: "7-10 days",
    requiredDocs: ["Birth Report", "Parent ID", "Hospital Certificate"]
  },
  {
    id: "RESIDENCE",
    name: "Residence Certificate",
    icon: "🏠",
    description: "Proof of current residential address",
    fee: "₹100",
    processingTime: "5-7 days",
    requiredDocs: ["Ration Card", "Electricity Bill", "Aadhar Card"]
  },
  {
    id: "INCOME",
    name: "Income Certificate",
    icon: "💰",
    description: "Certificate of annual family income",
    fee: "₹150",
    processingTime: "10-12 days",
    requiredDocs: ["Income Proof Form", "Tax Document", "Aadhar Card"]
  },
  {
    id: "CASTE",
    name: "Caste Certificate",
    icon: "👤",
    description: "Certificate of caste/tribe affiliation",
    fee: "₹100",
    processingTime: "15-20 days",
    requiredDocs: ["Caste Certificate Form", "Parent Caste Proof", "Aadhar Card"]
  },
  {
    id: "DOMICILE",
    name: "Domicile Certificate",
    icon: "📍",
    description: "Proof of state residency",
    fee: "₹100",
    processingTime: "12-15 days",
    requiredDocs: ["Domicile Form", "Property Proof", "Aadhar Card"]
  }
];

// Document categories mapping
const documentCategories = {
  "Birth Report": { category: "Medical", required: true },
  "Parent ID": { category: "Identity", required: true },
  "Hospital Certificate": { category: "Medical", required: true },
  "Ration Card": { category: "Address Proof", required: true },
  "Electricity Bill": { category: "Address Proof", required: true },
  "Aadhar Card": { category: "Identity", required: true },
  "Income Proof Form": { category: "Financial", required: true },
  "Tax Document": { category: "Financial", required: true },
  "Caste Certificate Form": { category: "Community", required: true },
  "Parent Caste Proof": { category: "Community", required: true },
  "Domicile Form": { category: "Legal", required: true },
  "Property Proof": { category: "Legal", required: true }
};

export default function NewApplication() {
  const navigate = useNavigate();
  const { id } = useParams();


  const { data, isLoading: isDataLoading } = useCitizenInfoQuery();
  const [applyCertificate, { isLoading: isSubmitting }] = useApplyCertificateMutation();
  
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    certificateType: '',
    issueUrgency: 'normal',
    jurisdiction: {
      village: '',
      tehsil: '',
      district: ''
    },
    certificateData: {
      applicantDetails: {
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        occupation: '',
        annualIncome: '' || 0,
        address: '',
        pincode: ''
      }
    },
    documents: []
  });

  // Track uploaded documents by type
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedApplicationId, setGeneratedApplicationId] = useState('');

  // Set jurisdiction from citizen data
  useEffect(() => {
    if (data?.citizen?.address) {
      setFormData(prev => ({
        ...prev,
        jurisdiction: {
          village: data.citizen.address.village || '',
          tehsil: data.citizen.address.tehsil || '',
          district: data.citizen.address.district || ''
        }
      }));
    }
  }, [data]);

  // Handle certificate type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      certificateType: type.id
    }));
    setCurrentStep(2);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      certificateData: {
        ...prev.certificateData,
        applicantDetails: {
          ...prev.certificateData.applicantDetails,
          [name]: value
        }
      }
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle urgency change
  const handleUrgencyChange = (urgency) => {
    setFormData(prev => ({
      ...prev,
      issueUrgency: urgency
    }));
  };

  // Handle file upload for specific document type
  const handleFileUpload = (e, documentType) => {
    const files = Array.from(e.target.files);
    
    const newDocs = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      documentType,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      isVerified: false,
      file,
      preview: URL.createObjectURL(file)
    }));

    // Update uploaded documents state
    setUploadedDocs(prev => ({
      ...prev,
      [documentType]: [...(prev[documentType] || []), ...newDocs]
    }));

    // Simulate upload progress
    newDocs.forEach(doc => {
      setUploadProgress(prev => ({
        ...prev,
        [doc.id]: 0
      }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [doc.id]: progress
        }));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });
  };

  // Remove document
  const removeDocument = (docId, documentType) => {
    setUploadedDocs(prev => ({
      ...prev,
      [documentType]: prev[documentType].filter(doc => doc.id !== docId)
    }));
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[docId];
      return newProgress;
    });
  };

  // Check if all required documents are uploaded
  const areAllDocumentsUploaded = () => {
    if (!selectedType) return false;
    
    const required = selectedType.requiredDocs;
    return required.every(docType => 
      uploadedDocs[docType] && uploadedDocs[docType].length > 0
    );
  };

  // Get missing documents
  const getMissingDocuments = () => {
    if (!selectedType) return [];
    
    const required = selectedType.requiredDocs;
    return required.filter(docType => 
      !uploadedDocs[docType] || uploadedDocs[docType].length === 0
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Personal details validation
    if (!formData.certificateData.applicantDetails.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.certificateData.applicantDetails.fatherName?.trim()) {
      newErrors.fatherName = 'Father\'s name is required';
    }
    if (!formData.certificateData.applicantDetails.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.certificateData.applicantDetails.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.certificateData.applicantDetails.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.certificateData.applicantDetails.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.certificateData.applicantDetails.pincode)) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    }

    // Income specific validation
    if (selectedType?.id === 'INCOME' && !formData.certificateData.applicantDetails.annualIncome) {
      newErrors.annualIncome = 'Annual income is required';
    }

    // Jurisdiction validation
    if (!formData.jurisdiction.village?.trim()) {
      newErrors.village = 'Village is required';
    }
    if (!formData.jurisdiction.tehsil?.trim()) {
      newErrors.tehsil = 'Tehsil is required';
    }
    if (!formData.jurisdiction.district?.trim()) {
      newErrors.district = 'District is required';
    }

    // Document validation
    if (!areAllDocumentsUploaded()) {
      newErrors.documents = 'Please upload all required documents';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - MATCHES BACKEND CONTROLLER
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const formDataToSend = new FormData();

    // Normal fields
    formDataToSend.append("certificateType", selectedType.id);
    formDataToSend.append(
      "certificateData",
      JSON.stringify(formData.certificateData)
    );
    formDataToSend.append("issueUrgency", formData.issueUrgency);
    formDataToSend.append(
      "jurisdiction",
      JSON.stringify(formData.jurisdiction)
    );

    // Files
    Object.entries(uploadedDocs).forEach(([docType, docs]) => {
      docs.forEach((doc) => {
        formDataToSend.append("documents", doc.file); // actual file
        formDataToSend.append("documentTypes", docType); // send type separately
      });
    });

    const response = await applyCertificate(
      
      formDataToSend
    ).unwrap();

    setGeneratedApplicationId(response.application.applicationId);
    setSubmitSuccess(true);

    setTimeout(() => {
      navigate("/citizen/applications");
    }, 3000);

  } catch (error) {
    console.error("Application submission failed:", error);

    if (error.data?.missingDocs) {
      setErrors({
        documents: `Missing documents: ${error.data.missingDocs.join(", ")}`
      });
    } else {
      setErrors({
        submit:
          error.data?.message ||
          "Failed to submit application. Please try again."
      });
    }
  }
};


  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get document category
  const getDocumentCategory = (docType) => {
    return documentCategories[docType]?.category || 'Other';
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">New Application</h1>
              <p className="text-sm text-gray-600">Apply for digital certificate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">Application Submitted Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your application ID is <span className="font-bold">{generatedApplicationId}</span>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Redirecting to applications page...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Certificate</span>
            <span>Fill Details</span>
            <span>Upload Documents</span>
          </div>
        </div>

        {/* Step 1: Certificate Type Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Certificate Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificateTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start">
                      <span className="text-3xl mr-3">{type.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                            {type.name}
                          </h3>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            {type.fee}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {type.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{type.processingTime}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Required: {type.requiredDocs.length} documents
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Jurisdiction Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Your Jurisdiction</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Village: {data?.citizen?.address?.village || 'Not set'} | 
                    Tehsil: {data?.citizen?.address?.tehsil || 'Not set'} | 
                    District: {data?.citizen?.address?.district || 'Not set'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Applications are processed by your local Gram Panchayat office
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && selectedType && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedType.icon} {selectedType.name} Application
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Please fill in your details accurately
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Urgency</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleUrgencyChange('normal')}
                      className={`px-3 py-1.5 text-xs rounded ${
                        formData.issueUrgency === 'normal'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Normal (₹{selectedType.fee.replace('₹', '')})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUrgencyChange('urgent')}
                      className={`px-3 py-1.5 text-xs rounded flex items-center ${
                        formData.issueUrgency === 'urgent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Urgent (₹{parseInt(selectedType.fee.replace('₹', '')) * 2})
                    </button>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.certificateData.applicantDetails.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="As per Aadhar card"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.certificateData.applicantDetails.fatherName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded ${
                        errors.fatherName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Father's full name"
                    />
                    {errors.fatherName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fatherName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.certificateData.applicantDetails.motherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mother's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.certificateData.applicantDetails.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.certificateData.applicantDetails.gender}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Marital Status
                    </label>
                    <select
                      name="maritalStatus"
                      value={formData.certificateData.applicantDetails.maritalStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="DIVORCED">Divorced</option>
                      <option value="WIDOWED">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.certificateData.applicantDetails.occupation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your occupation"
                    />
                  </div>

                  {selectedType?.id === 'INCOME' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Annual Income (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="annualIncome"
                        value={formData.certificateData.applicantDetails.annualIncome}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded ${
                          errors.annualIncome ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter annual income"
                      />
                      {errors.annualIncome && (
                        <p className="mt-1 text-xs text-red-600">{errors.annualIncome}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Address Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Complete Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.certificateData.applicantDetails.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-3 py-2 text-sm border rounded ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="House no., Street, Locality, Village/City"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.certificateData.applicantDetails.pincode}
                        onChange={handleInputChange}
                        maxLength="6"
                        className={`w-full px-3 py-2 text-sm border rounded ${
                          errors.pincode ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Jurisdiction Display (Read Only) */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Jurisdiction (From Profile)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Village
                      </label>
                      <input
                        type="text"
                        value={formData.jurisdiction.village}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600"
                      />
                      {errors.village && (
                        <p className="mt-1 text-xs text-red-600">{errors.village}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tehsil
                      </label>
                      <input
                        type="text"
                        value={formData.jurisdiction.tehsil}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600"
                      />
                      {errors.tehsil && (
                        <p className="mt-1 text-xs text-red-600">{errors.tehsil}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        value={formData.jurisdiction.district}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600"
                      />
                      {errors.district && (
                        <p className="mt-1 text-xs text-red-600">{errors.district}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Next: Upload Documents
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && selectedType && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upload Required Documents
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Please upload all required documents for {selectedType.name}
                </p>
              </div>

              {/* Required Documents List */}
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Required Documents ({selectedType.requiredDocs.length}/3)
                </h3>
                <div className="space-y-3">
                  {selectedType.requiredDocs.map((docType, index) => {
                    const isUploaded = uploadedDocs[docType] && uploadedDocs[docType].length > 0;
                    const category = getDocumentCategory(docType);
                    
                    return (
                      <div key={index} className="flex items-start justify-between p-2 bg-white rounded border border-blue-100">
                        <div className="flex items-start">
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                            isUploaded ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {isUploaded && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{docType}</p>
                            <p className="text-xs text-gray-500">Category: {category}</p>
                          </div>
                        </div>
                        
                        {!isUploaded ? (
                          <div className="relative">
                            <input
                              type="file"
                              id={`file-${index}`}
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, docType)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`file-${index}`}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded cursor-pointer hover:bg-blue-700"
                            >
                              Upload
                            </label>
                          </div>
                        ) : (
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Uploaded
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Missing Documents Alert */}
                {!areAllDocumentsUploaded() && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Missing documents: {getMissingDocuments().join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Uploaded Documents List */}
              {Object.keys(uploadedDocs).length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Uploaded Documents
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(uploadedDocs).map(([docType, docs]) => 
                      docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center flex-1">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-700">
                                {docType} - {doc.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.fileSize)}
                              </p>
                            </div>
                          </div>
                          
                          {/* Upload Progress */}
                          {uploadProgress[doc.id] < 100 ? (
                            <div className="w-24">
                              <div className="bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{ width: `${uploadProgress[doc.id]}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 text-right mt-1">
                                {uploadProgress[doc.id]}%
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <button
                                onClick={() => {
                                  if (doc.preview) {
                                    window.open(doc.preview, '_blank');
                                  }
                                }}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeDocument(doc.id, docType)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {errors.documents && (
                <p className="text-xs text-red-600 mt-2">{errors.documents}</p>
              )}

              {/* Declaration */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="declaration"
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="declaration" className="text-xs text-gray-600">
                    I hereby declare that all the information provided is true and correct to the best of my knowledge. 
                    I understand that furnishing false information may lead to rejection of application and legal action.
                  </label>
                </div>
              </div>

              {/* Fee Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Fee Summary</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Application Fee ({selectedType.name})</span>
                  <span className="font-medium">{selectedType.fee}</span>
                </div>
                {formData.issueUrgency === 'urgent' && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Urgent Processing Fee</span>
                    <span className="font-medium">₹{parseInt(selectedType.fee.replace('₹', ''))}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">
                    ₹{parseInt(selectedType.fee.replace('₹', '')) * (formData.issueUrgency === 'urgent' ? 2 : 1)}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !areAllDocumentsUploaded()}
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Need Help?</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Contact your local Gram Panchayat office or call our helpline at 1800-123-4567
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Office hours: Monday to Friday, 10:00 AM to 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

