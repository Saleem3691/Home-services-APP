"use client";
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  CalendarIcon, 
  ClockIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  PencilIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function BookingModal({ serviceName, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isSubmitting]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s()+-\/]{7,20}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Valid phone number required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      if (selectedDate < tomorrow) newErrors.date = "Date must be tomorrow or later";
    }
    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {  // Removed the extra space
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceName,
          date: new Date(formData.date).toISOString()
        })
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit booking');
  
      toast.success('Booking created successfully!');
      onSuccess(data.booking);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAvailableDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalOpen(false);
    setTimeout(onClose, 300);
  };

  const inputClasses = (fieldName) => `
    w-full pl-10 pr-4 py-3 border text-black
    ${errors[fieldName] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} 
    rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-200 shadow-sm
  `;

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-60 
    flex items-center justify-center z-50 p-4 
    transition-opacity duration-300 ease-in-out
    ${modalOpen ? 'opacity-100' : 'opacity-0'}
  `;

  const modalClasses = `
    bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto
    transform transition-all duration-300 ease-in-out
    ${modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
  `;

  return (
    <div className={overlayClasses} onClick={handleCloseModal}>
      <div className={modalClasses} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Book {serviceName} Service
            </h2>
            <button 
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 rounded-full p-1.5 transition-colors hover:bg-gray-100"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses('name')}
                  placeholder="John Smith"
                />
                <PencilIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                {errors.name && <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />}
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses('email')}
                  placeholder="your@email.com"
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                {errors.email && <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />}
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses('phone')}
                  placeholder="(123) 456-7890"
                />
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                {errors.phone && <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />}
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClasses('address')}
                  placeholder="123 Main St, City, State ZIP"
                  rows={2}
                />
                <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                {errors.address && <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />}
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={generateAvailableDates()}
                    className={inputClasses('date')}
                  />
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  {errors.date && <ExclamationCircleIcon className="h-5 w-5 text-red-500 absolute right-3 top-3" />}
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`${inputClasses('time')} appearance-none`}
                  >
                    <option value="">Select Time</option>
                    <option value="08:00-10:00">8:00 - 10:00 AM</option>
                    <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                    <option value="12:00-14:00">12:00 - 2:00 PM</option>
                    <option value="14:00-16:00">2:00 - 4:00 PM</option>
                    <option value="16:00-18:00">4:00 - 6:00 PM</option>
                  </select>
                  <ClockIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Special instructions..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}