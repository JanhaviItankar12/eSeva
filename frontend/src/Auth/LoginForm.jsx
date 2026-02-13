import { useState } from 'react';
import { useLoginMutation } from '../features/api/authApi'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../services/authSlice';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await login(formData).unwrap();

      // Check if first login for officers to redirect to password change
      if (res.user?.isFirstLogin) {
        alert("Please change your temporary password");
        // Redirect to change password page
        // router.push('/change-password');
      } else {
        alert("Login successful!");
        dispatch(setCredentials({
          user: res.user,
          token: res.token
        }));


        // Redirect based on role
        switch (res.user.role) {
          case 'CITIZEN':
            navigate('/');
            break;
          case 'GRAM_SEVAK':
            navigate('/gram-sevak/dashboard');
            break;
          case 'SARPANCH':
            navigate('/sarpanch/dashboard');
            break;
          // ... add other role redirects
          default:
            navigate('/dashboard');
        }
      }

      // Reset form
      setFormData({
        email: "",
        password: ""
      });

    } catch (err) {
      console.error("Login failed:", err);

      // Handle specific error messages
      let errorMessage = "Login failed";
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err?.status === 403) {
        errorMessage = "Your account is deactivated. Please contact administrator.";
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-800 rounded-lg mb-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#1e40af" />
              <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white" />
              <rect x="10" y="21" width="12" height="2" fill="white" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Welcome to eSeva</h1>
          <p className="text-sm text-slate-600">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent outline-none transition-all`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent outline-none transition-all`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs text-blue-700 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Error Message */}
            {isError && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-xs text-red-600 text-center">
                  {error?.data?.message || 'Invalid email or password'}
                </p>
              </div>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-700 hover:text-blue-800 font-medium">
                Create account
              </a>
            </p>
          </div>

          {/* Officer Login Note */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="bg-blue-50 rounded p-2">
              <p className="text-xs text-blue-800 text-center">
                <span className="font-medium">For Officers:</span> Use your provided email and temporary password sent to your registered email
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 mt-4">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-700 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
