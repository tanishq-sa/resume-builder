'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
  onViewPDF: (data: FormData) => void;
  initialData?: FormData;
}

export default function Form({ onSubmit, onViewPDF, initialData }: FormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || {
    name: '',
    email: '',
    phone: '',
    position: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must have at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleViewPDF = () => {
    if (validateForm()) {
      onViewPDF(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-black mb-8 text-center">Add Your details</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src="/assignment_icons/user.svg"
                alt="User icon"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <label className="text-sm font-semibold text-gray-800">Name</label>
            </div>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400 text-base ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src="/assignment_icons/mail.svg"
                alt="Email icon"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <label className="text-sm font-semibold text-gray-800">Email</label>
            </div>
            <input
              type="email"
              placeholder="e.g. Johndoe@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400 text-base ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center space-x-3 mb-2">
              <Image
                src="/assignment_icons/phone-call.svg"
                alt="Phone icon"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <label className="text-sm font-semibold text-gray-800">Phone Number</label>
            </div>
            <input
              type="tel"
              placeholder="e.g. (220) 222-20002"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400 text-base ${
                errors.phone ? 'border-red-500' : ''
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone}</p>}
          </div>

          {/* Position Field */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src="/assignment_icons/position.svg"
                alt="Position icon"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <label className="text-sm font-semibold text-gray-800">Position</label>
            </div>
            <input
              type="text"
              placeholder="e.g. Junior Front end Developer"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400 text-base"
            />
          </div>

          {/* Description Field */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src="/assignment_icons/Description.svg"
                alt="Description icon"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <label className="text-sm font-semibold text-gray-800">Description</label>
            </div>
            <textarea
              placeholder="e.g. Work expriences"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400 resize-none text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={handleViewPDF}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Image
                src="/assignment_icons/view.svg"
                alt="View icon"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <span>View PDF</span>
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Image
                src="/assignment_icons/Download.svg"
                alt="Download icon"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <span>Download PDF</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
