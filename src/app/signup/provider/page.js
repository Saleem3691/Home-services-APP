'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ProviderSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    experience: '',
    services: [],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const services = [
  'plumbing', 
  'electrical',
  'car repair', 
  'cleaning',
  'appliance repair',
  'ac-repair'
];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email address';
    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/)) newErrors.phone = 'Invalid phone number (E.164 format)';
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (formData.services.length === 0) newErrors.services = 'Select at least one service';
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        email: formData.email.toLowerCase().trim(),
        services: formData.services.map(s => s.toLowerCase().trim()),
        role: 'provider'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (data.error === "Email already exists") {
        setErrors({ email: 'This email is already registered' });
      }
      throw new Error(data.error || 'Registration failed');
    }

    if (data.user) {
      router.push('/login?registration=success');
    }
  } catch (err) {
    console.error('Registration Error:', err);
    setErrors({ 
      submit: err.message.includes('duplicate key error') 
        ? 'This email is already registered' 
        : err.message || 'Registration failed. Please try again.' 
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Service Provider Registration
          </h2>

          {errors.submit && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Business Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.businessName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Quality Services Ltd."
                  />
                </div>
                {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full pl-10 pr-10 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={`w-full pl-10 pr-10 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Cities you serve"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              {/* Experience Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className={`w-full px-3 py-2 border ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="5"
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
              </div>
            </div>

            {/* Services Checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Services Offered <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {services.map((service) => (
                  <div key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.services.includes(service)}
                      onChange={(e) => {
                        const updatedServices = e.target.checked
                          ? [...formData.services, service]
                          : formData.services.filter(s => s !== service);
                        setFormData({...formData, services: updatedServices});
                      }}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={service} className="ml-2 text-sm text-gray-700">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-sm">{errors.services}</p>}
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Describe your business and services..."
              />
              <p className="text-sm text-gray-500">
                {formData.description.length}/50 characters (minimum 50)
              </p>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Create Provider Account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}