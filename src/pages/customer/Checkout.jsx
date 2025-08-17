import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  FileText,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Clock,
  Truck,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { createOrder } from '../../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic title
  useDynamicTitle('Checkout - FixPharmacy');

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    area: '',
    city: 'Biratnagar',
    landmark: '',
    deliveryInstructions: ''
  });

  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customerNotes, setCustomerNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.isEmpty) {
      navigate('/cart');
    }
  }, [cart.isEmpty, navigate]);

  // Check if prescription items exist
  const hasPrescriptionItems = cart.items?.some(item => 
    item.product?.medicineType === 'Prescription'
  );


  // Calculate totals
  const subtotal = cart.subtotal || 0;
  const deliveryFee = deliveryAddress.city?.toLowerCase() === 'biratnagar' ? 50 : 100;
  const tax = 0; // No tax for now
  const total = subtotal + deliveryFee + tax;

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Delivery address validation
      if (!deliveryAddress.name.trim()) newErrors.name = 'Name is required';
      if (!deliveryAddress.phone.trim()) newErrors.phone = 'Phone is required';
      if (!deliveryAddress.street.trim()) newErrors.street = 'Street address is required';
      if (!deliveryAddress.area.trim()) newErrors.area = 'Area is required';
      if (!deliveryAddress.city.trim()) newErrors.city = 'City is required';

      // Guest details validation
      if (!isAuthenticated) {
        if (!guestDetails.name.trim()) newErrors.guestName = 'Your name is required';
        if (!guestDetails.email.trim()) newErrors.guestEmail = 'Email is required';
        if (!guestDetails.phone.trim()) newErrors.guestPhone = 'Phone number is required';
      }
    }

    if (step === 2 && hasPrescriptionItems) {
      // Prescription validation
      if (prescriptions.length === 0) {
        newErrors.prescriptions = 'Prescription is required for prescription medicines';
      }
    }

    // Also validate prescriptions at final step
    if (step === 3 && hasPrescriptionItems && prescriptions.length === 0) {
      newErrors.prescriptions = 'Prescription is required for prescription medicines in your cart';
    }

    if (step === 3) {
      // Final validation
      if (!agreedToTerms) {
        newErrors.terms = 'You must agree to terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle prescription upload
  const handlePrescriptionUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('File size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPrescription = {
          id: Date.now() + Math.random(),
          file: file,
          preview: event.target.result,
          doctorName: '',
          hospitalName: '',
          prescriptionDate: '',
          uploaded: false,
          uploading: false,
          fileUrl: null
        };
        setPrescriptions(prev => [...prev, newPrescription]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload prescription files to server
  const uploadPrescriptionFiles = async () => {
    const unuploadedPrescriptions = prescriptions.filter(p => !p.uploaded && !p.uploading);
    
    // Track uploads with a local variable to avoid state synchronization issues
    const uploadResults = [];
    
    for (const prescription of unuploadedPrescriptions) {
      try {
        // Mark as uploading
        setPrescriptions(prev => prev.map(p => 
          p.id === prescription.id ? { ...p, uploading: true } : p
        ));

        const formData = new FormData();
        formData.append('prescription', prescription.file);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions/upload`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          // Store the upload result locally
          uploadResults.push({
            id: prescription.id,
            uploaded: true,
            uploading: false,
            fileUrl: result.data.fileUrl,
            fileName: result.data.fileName,
            doctorName: prescription.doctorName,
            hospitalName: prescription.hospitalName,
            prescriptionDate: prescription.prescriptionDate
          });
          
          // Update prescription with uploaded file info
          setPrescriptions(prev => prev.map(p => 
            p.id === prescription.id 
              ? { 
                  ...p, 
                  uploaded: true, 
                  uploading: false, 
                  fileUrl: result.data.fileUrl,
                  fileName: result.data.fileName
                } 
              : p
          ));
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Prescription upload error:', error);
        toast.error(`Failed to upload prescription: ${error.message}`);
        
        // Mark upload as failed
        setPrescriptions(prev => prev.map(p => 
          p.id === prescription.id ? { ...p, uploading: false } : p
        ));
        
        return { success: false, uploadResults: [] }; // Return failure
      }
    }
    
    return { success: true, uploadResults }; // Return success with results
  };

  // Remove prescription
  const removePrescription = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  // Handle step navigation
  const goToStep = (step) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handlePlaceOrder();
      }
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      let prescriptionData = [];
      
      // First, upload prescription files if any
      if (hasPrescriptionItems && prescriptions.length > 0) {
        const uploadResult = await uploadPrescriptionFiles();
        if (!uploadResult.success) {
          throw new Error('Failed to upload prescription files');
        }
        
        // Use the upload results directly instead of relying on React state
        prescriptionData = uploadResult.uploadResults.map(p => ({
          doctorName: p.doctorName || '',
          hospitalName: p.hospitalName || '',
          prescriptionDate: p.prescriptionDate || '',
          imageUrl: p.fileUrl,
          fileName: p.fileName
        }));
        
        // Also include any already uploaded prescriptions from state
        const alreadyUploaded = prescriptions.filter(p => p.uploaded && p.fileUrl);
        alreadyUploaded.forEach(p => {
          // Only add if not already in prescriptionData
          if (!prescriptionData.find(pd => pd.fileName === p.fileName)) {
            prescriptionData.push({
              doctorName: p.doctorName || '',
              hospitalName: p.hospitalName || '',
              prescriptionDate: p.prescriptionDate || '',
              imageUrl: p.fileUrl,
              fileName: p.fileName
            });
          }
        });
      }

      const orderData = {
        deliveryAddress,
        paymentMethod,
        customerNotes: customerNotes.trim(),
        prescriptions: prescriptionData
      };

      // Add guest details if not authenticated
      if (!isAuthenticated) {
        orderData.guestDetails = guestDetails;
      }

      // API call to create order using orderService
      const result = await createOrder(orderData);

      if (result.success) {
        // Clear cart
        await clearCart();
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Navigate to order confirmation
        navigate(`/order-confirmation/${result.data.orderNumber}`);
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.isEmpty) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <SEO
        title="Checkout - FixPharmacy"
        description="Complete your order securely with fast delivery across Nepal"
        keywords="checkout, pharmacy order, medicine delivery, online pharmacy nepal"
      />

      {/* Mobile-First Design */}
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm sm:text-base font-medium">Back to Cart</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Checkout</h1>
              <p className="text-xs sm:text-sm text-gray-600">Step {currentStep} of 3</p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white px-4 py-3 sm:px-6">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <CheckCircle size={16} /> : step}
                </div>
                {step < 3 && (
                  <div 
                    className={`w-12 sm:w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-600 max-w-md mx-auto mt-2">
            <span>Address</span>
            <span>Review</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:max-w-7xl lg:mx-auto lg:px-6 lg:py-8 lg:gap-8">
          {/* Steps Content */}
          <div className="flex-1 lg:w-2/3">
            {/* Step 1: Delivery Address */}
            {currentStep === 1 && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.name}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={deliveryAddress.phone}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="98XXXXXXXX"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter street address"
                      />
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area/Ward *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.area}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, area: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.area ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ward number or area name"
                      />
                      {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="Biratnagar">Biratnagar</option>
                        <option value="Itahari">Itahari</option>
                        <option value="Dharan">Dharan</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.landmark}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, landmark: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Near hospital, school, etc."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={deliveryAddress.deliveryInstructions}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Any special delivery instructions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Guest Details */}
                {!isAuthenticated && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <User size={20} className="text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={guestDetails.name}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.guestName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your name"
                        />
                        {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={guestDetails.email}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.guestEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={guestDetails.phone}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.guestPhone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="98XXXXXXXX"
                        />
                        {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Review & Prescriptions */}
            {currentStep === 2 && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Order Review */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Review</h2>
                  
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={`${item.product._id}-${item.purchaseType}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          {item.product.images?.[0] ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${item.product.images[0]}`}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                          <p className="text-xs text-gray-600">{item.product.brand}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.purchaseType === 'unit' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {item.purchaseType === 'unit' ? 'Individual' : 'Package'}
                            </span>
                            {item.product.medicineType === 'Prescription' && (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                                Rx Required
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-green-600">Rs. {item.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescription Upload */}
                {hasPrescriptionItems && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText size={20} className="text-red-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Prescription Required</h2>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-700">
                          <p className="font-medium">Prescription Required</p>
                          <p>Your order contains prescription medicines. Please upload a valid prescription from a licensed doctor.</p>
                        </div>
                      </div>
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload prescription images</p>
                      <p className="text-xs text-gray-500 mb-4">JPG, PNG, PDF up to 2MB each</p>
                      
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handlePrescriptionUpload}
                        className="hidden"
                        id="prescription-upload"
                      />
                      <label
                        htmlFor="prescription-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Choose Files
                      </label>
                    </div>

                    {/* Uploaded Prescriptions */}
                    {prescriptions.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {prescriptions.map((prescription) => (
                          <div key={prescription.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                              <div className="relative">
                                <img
                                  src={prescription.preview}
                                  alt="Prescription"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                {prescription.uploading && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                  </div>
                                )}
                                {prescription.uploaded && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                    <CheckCircle size={12} />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Doctor's Name *"
                                    value={prescription.doctorName}
                                    onChange={(e) => {
                                      setPrescriptions(prev => prev.map(p => 
                                        p.id === prescription.id 
                                          ? { ...p, doctorName: e.target.value }
                                          : p
                                      ));
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    disabled={prescription.uploading}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Hospital/Clinic"
                                    value={prescription.hospitalName}
                                    onChange={(e) => {
                                      setPrescriptions(prev => prev.map(p => 
                                        p.id === prescription.id 
                                          ? { ...p, hospitalName: e.target.value }
                                          : p
                                      ));
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    disabled={prescription.uploading}
                                  />
                                </div>
                                <input
                                  type="date"
                                  value={prescription.prescriptionDate}
                                  onChange={(e) => {
                                    setPrescriptions(prev => prev.map(p => 
                                      p.id === prescription.id 
                                        ? { ...p, prescriptionDate: e.target.value }
                                        : p
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={prescription.uploading}
                                />
                                
                                {/* Upload status */}
                                <div className="text-xs">
                                  {prescription.uploading && (
                                    <span className="text-blue-600">Uploading...</span>
                                  )}
                                  {prescription.uploaded && (
                                    <span className="text-green-600">✓ Uploaded successfully</span>
                                  )}
                                  {!prescription.uploaded && !prescription.uploading && (
                                    <span className="text-gray-500">Ready to upload</span>
                                  )}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => removePrescription(prescription.id)}
                                className="text-red-500 hover:text-red-700"
                                disabled={prescription.uploading}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.prescriptions && (
                      <p className="text-red-500 text-sm mt-2">{errors.prescriptions}</p>
                    )}
                  </div>
                )}

                {/* Customer Notes */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Any special instructions or requests..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Payment Method */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                      <div className="text-green-600 font-medium">Free</div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="esewa"
                        disabled
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">eSewa</p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="khalti"
                        disabled
                        className="text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Khalti</p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 text-blue-600"
                    />
                    <div className="text-sm text-gray-700">
                      <p>
                        I agree to the{' '}
                        <button className="text-blue-600 hover:underline">
                          Terms & Conditions
                        </button>{' '}
                        and{' '}
                        <button className="text-blue-600 hover:underline">
                          Privacy Policy
                        </button>
                      </p>
                    </div>
                  </label>
                  {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
                </div>

                {/* Trust Indicators */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Shield size={24} className="text-green-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Secure</p>
                      <p className="text-xs text-gray-600">100% Safe</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Truck size={24} className="text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                      <p className="text-xs text-gray-600">Same Day</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle size={24} className="text-green-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Authentic</p>
                      <p className="text-xs text-gray-600">Genuine Medicines</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Desktop Sidebar / Mobile Bottom */}
          <div className="lg:w-1/3">
            {/* Mobile: Fixed Bottom Summary */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">Rs. {total}</span>
                </div>
                
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Processing...' : currentStep === 3 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </div>

            {/* Desktop: Sticky Sidebar */}
            <div className="hidden lg:block lg:sticky lg:top-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                    <span className="font-medium">Rs. {subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rs. {deliveryFee}</span>
                  </div>
                  
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">Rs. {tax}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-green-600">Rs. {total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={nextStep}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Processing...' : currentStep === 3 ? 'Place Order' : 'Continue'}
                  </button>

                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Back
                    </button>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-700 text-sm">
                    <Clock size={16} />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Same day delivery in Biratnagar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Padding */}
        <div className="lg:hidden h-24"></div>
      </div>
    </>
  );
};

export default Checkout;