import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
  Edit3,
  Loader
} from 'lucide-react';
import { useCitizenInfoQuery, useUpdateAddressMutation, useUpdatePasswordMutation } from '../../features/api/citizenApi';

export default function ProfileSetting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch citizen info
  const { data, isLoading: isDataLoading } = useCitizenInfoQuery();
  const [updateAddress] = useUpdateAddressMutation(); // PUT mutation for address
  const [updatePassword] = useUpdatePasswordMutation(); // PUT mutation for password

  // Form state - only address is editable
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: {
      village: '',
      tehsil: '',
      district: ''
    },
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data
  useEffect(() => {
    if (data?.citizen) {
      setFormData({
        name: data.citizen.name || '',
        email: data.citizen.email || '',
        mobile: data.citizen.mobile || '',
        address: data.citizen.address || {
          village: '',
          tehsil: '',
          district: ''
        },
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [data]);

  // Handle input changes - only for address fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Only allow address field changes
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));

        // Clear error for this field
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      }
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate address form only
  const validateAddressForm = () => {
    const newErrors = {};

    // Address validation
    if (!formData.address.village?.trim()) {
      newErrors['address.village'] = 'Village is required';
    }
    if (!formData.address.tehsil?.trim()) {
      newErrors['address.tehsil'] = 'Tehsil is required';
    }
    if (!formData.address.district?.trim()) {
      newErrors['address.district'] = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form - no current password required
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle address update - PUT mutation
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateAddressForm()) return;

    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Call your PUT mutation for address update
      await updateAddress({
        
        address: formData.address
      }).unwrap();

      setShowSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Address update failed:', error);
      setErrors({ submit: 'Failed to update address. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update - PUT mutation
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Call your PUT mutation for password update
      await updatePassword({
        
        password: formData.newPassword
      }).unwrap();

      setShowSuccess(true);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Password update failed:', error);
      setErrors({ password: 'Failed to update password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Get Indian states/districts (mock)
const districts = [
  "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", 
  "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Saharanpur"
];

const tehsils = {
  "Lucknow": ["Sadar", "Malihabad", "Mohanlalganj", "Lucknow City"],
  "Kanpur": ["Sadar", "Bilhaur", "Ghatampur"],
  "Agra": ["Sadar", "Kiraoli", "Fatehabad"],
  "Varanasi": ["Sadar", "Pindra", "Chandauli"],
  "Meerut": ["Sadar", "Mawana", "Sardhana"]
};

// Add state for available tehsils
const [availableTehsils, setAvailableTehsils] = useState([]);

// Update tehsils when district changes
useEffect(() => {
  if (formData.address?.district) {
    setAvailableTehsils(tehsils[formData.address.district] || []);
    
    // Clear tehsil if current tehsil not in new district
    if (formData.address.tehsil && 
        !tehsils[formData.address.district]?.includes(formData.address.tehsil)) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          tehsil: ''
        }
      }));
    }
  } else {
    setAvailableTehsils([]);
  }
}, [formData.address?.district]);

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] ">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your personal information and preferences
                </p>
              </div>
            </div>
            {activeTab === 'profile' && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Address
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-slide-down">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-sm font-medium text-green-800">
                {activeTab === 'profile' ? 'Address updated successfully!' : 'Password updated successfully!'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              {/* Profile Summary */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold text-white">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{formData.name || 'User'}</h2>
                    <p className="text-sm text-blue-100 mt-1 capitalize">
                      {data?.citizen?.role?.toLowerCase().replace('_', ' ') || 'Citizen'}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      Member since {new Date(data?.citizen?.createdAt).toLocaleDateString('en-IN', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="p-4">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsEditing(false);
                    setErrors({});
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className={`w-5 h-5 ${
                    activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium">Profile Information</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('security');
                    setErrors({});
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className={`w-5 h-5 ${
                    activeTab === 'security' ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium">Security</span>
                </button>
              </div>

              {/* Account Info - Read Only */}
              <div className="p-4 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Account Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{formData.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {formData.mobile || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                      <span className="text-gray-600">
                        {formData?.address?.village && formData?.address?.tehsil && formData?.address?.district
                          ? `${formData.address.village}, ${formData.address.tehsil}, ${formData.address.district}`
                          : 'Address not set'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isEditing ? 'Edit Address' : 'Profile Information'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isEditing 
                      ? 'Update your address details'
                      : 'View your personal information (Name, Email, Mobile are not editable)'}
                  </p>
                </div>

                <form onSubmit={handleAddressUpdate} className="p-6">
                  <div className="space-y-6">
                    {/* Personal Information - Read Only */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Personal Information (Read Only)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name - Read Only */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            disabled
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        {/* Email - Read Only */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        {/* Mobile Number - Read Only */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Mobile Number
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-sm text-gray-500">+91</span>
                            <input
                              type="tel"
                              value={formData.mobile}
                              disabled
                              className="w-full pl-12 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                              placeholder="9876543210"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information - Editable */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Address Details {isEditing && <span className="text-red-500 text-xs ml-2">*Editable</span>}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Village - Editable only when isEditing */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Village/Town <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address.village"
                            value={formData?.address?.village || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2.5 text-sm border rounded-lg ${
                              errors['address.village'] ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              !isEditing && 'bg-gray-50 text-gray-600'
                            }`}
                            placeholder="Enter village/town"
                          />
                          {errors['address.village'] && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors['address.village']}
                            </p>
                          )}
                        </div>

                        {/* Tehsil - Editable only when isEditing */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Tehsil <span className="text-red-500">*</span>
                          </label>
                          {isEditing ? (
                            <select
                              name="address.tehsil"
                              value={formData?.address?.tehsil || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 text-sm border rounded-lg ${
                                errors['address.tehsil'] ? 'border-red-500' : 'border-gray-300'
                              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            >
                              <option value="">Select Tehsil</option>
                              {formData.address?.district && tehsils[formData.address.district] 
                                ? tehsils[formData.address.district].map(tehsil => (
                                    <option key={tehsil} value={tehsil}>{tehsil}</option>
                                  ))
                                : <option value="" disabled>Select district first</option>
                              }
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={formData?.address?.tehsil || ''}
                              disabled
                              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                          )}
                          {errors['address.tehsil'] && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors['address.tehsil']}
                            </p>
                          )}
                        </div>

                        {/* District - Editable only when isEditing */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            District <span className="text-red-500">*</span>
                          </label>
                          {isEditing ? (
                            <select
                              name="address.district"
                              value={formData?.address?.district || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 text-sm border rounded-lg ${
                                errors['address.district'] ? 'border-red-500' : 'border-gray-300'
                              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            >
                              <option value="">Select District</option>
                              {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={formData?.address?.district || ''}
                              disabled
                              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                            />
                          )}
                          {errors['address.district'] && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors['address.district']}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address Preview */}
                      {formData?.address?.village && formData?.address?.tehsil && formData?.address?.district && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <Home className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-blue-800">Your Full Address</p>
                              <p className="text-sm text-blue-700 mt-1">
                                {formData.address.village}, {formData.address.tehsil}, {formData.address.district}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Actions - Only show when editing */}
                    {isEditing && (
                      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            // Reset address to original values
                            if (data?.citizen?.address) {
                              setFormData(prev => ({
                                ...prev,
                                address: data.citizen.address
                              }));
                            }
                            setErrors({});
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Updating Address...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Update Address
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* Security Tab - Set New Password (No Current Password) */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Set a new password for your account
                  </p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Set New Password
                      </h3>
                      
                      <div className="max-w-md space-y-4">
                        {/* New Password - No current password required */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-2.5 text-sm border rounded-lg ${
                              errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter new password"
                          />
                          {errors.newPassword && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Confirm New Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-2.5 text-sm border rounded-lg ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Confirm new password"
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                          <ul className="space-y-1">
                            <li className="text-xs text-gray-600 flex items-center">
                              <CheckCircle className={`w-3 h-3 mr-2 ${
                                formData.newPassword?.length >= 8 ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              At least 8 characters
                            </li>
                            <li className="text-xs text-gray-600 flex items-center">
                              <CheckCircle className={`w-3 h-3 mr-2 ${
                                /[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              One uppercase letter
                            </li>
                            <li className="text-xs text-gray-600 flex items-center">
                              <CheckCircle className={`w-3 h-3 mr-2 ${
                                /[a-z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              One lowercase letter
                            </li>
                            <li className="text-xs text-gray-600 flex items-center">
                              <CheckCircle className={`w-3 h-3 mr-2 ${
                                /\d/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              One number
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Set New Password
                          </>
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-xs text-red-600 flex items-center justify-end">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}