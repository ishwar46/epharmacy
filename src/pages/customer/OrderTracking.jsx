import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  Search,
  User,
  Calendar,
  Hash,
  Info,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { trackOrder } from '../../services/orderService';

const OrderTracking = () => {
  const { orderNumber: paramOrderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [orderNumber, setOrderNumber] = useState(paramOrderNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  // Dynamic title
  useDynamicTitle(order ? `Track Order ${order.orderNumber}` : 'Track Order - FixPharmacy');

  // Auto-track if order number is in URL
  useEffect(() => {
    if (paramOrderNumber) {
      handleTrackOrder(paramOrderNumber, searchParams.get('phone') || '');
    }
  }, [paramOrderNumber]);

  const handleTrackOrder = async (orderNum = orderNumber, phone = phoneNumber) => {
    if (!orderNum.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await trackOrder(orderNum, phone || null);
      
      if (response.success) {
        setOrder(response.data);
        setShowPhoneInput(false);
        
        // Update URL without phone number for privacy
        window.history.replaceState({}, '', `/track/${orderNum}`);
      } else {
        throw new Error(response.message || 'Order not found');
      }
    } catch (error) {
      console.error('Track order error:', error);
      
      // Check if it's a phone verification error
      if (error.message?.includes('Phone number verification')) {
        setShowPhoneInput(true);
        setError('Please enter the phone number used for this order');
      } else {
        setError(error.message || 'Failed to track order');
        toast.error(error.message || 'Failed to track order');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackOrder();
  };

  // Status timeline component
  const StatusTimeline = ({ statusHistory, currentStatus }) => {
    const allStatuses = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'prescription_verified', label: 'Prescription Verified', icon: CheckCircle },
      { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
      { key: 'packed', label: 'Packed', icon: Package },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const getStatusIndex = (status) => allStatuses.findIndex(s => s.key === status);
    const currentIndex = getStatusIndex(currentStatus);

    return (
      <div className="space-y-4">
        {allStatuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const historyItem = statusHistory.find(h => h.status === status.key);
          const Icon = status.icon;

          return (
            <div key={status.key} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {status.label}
                  </h4>
                  {historyItem && (
                    <span className="text-xs text-gray-500">
                      {new Date(historyItem.changedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {historyItem?.notes && (
                  <p className="text-sm text-gray-600 mt-1">{historyItem.notes}</p>
                )}
                
                {!isCompleted && index > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getDeliveryStatus = () => {
    if (!order) return '';
    
    switch (order.status) {
      case 'delivered':
        return order.actualDeliveryTime 
          ? `Delivered on ${new Date(order.actualDeliveryTime).toLocaleDateString()}`
          : 'Delivered';
      case 'out_for_delivery':
        return 'Out for delivery';
      case 'packed':
        return 'Ready for delivery';
      case 'confirmed':
        return 'Being prepared';
      case 'pending':
        return 'Order received';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return 'Processing';
    }
  };

  return (
    <>
      <SEO
        title={order ? `Track Order ${order.orderNumber}` : 'Track Your Order - FixPharmacy'}
        description="Track your medicine delivery in real-time. Get updates on your pharmacy order status."
        keywords="track order, delivery status, medicine tracking, pharmacy order"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>
              
              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Track Order</h1>
                {order && (
                  <p className="text-xs sm:text-sm text-gray-600">#{order.orderNumber}</p>
                )}
              </div>
              
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          {/* Search Form */}
          {!order && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Order Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number *
                  </label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                      placeholder="Enter your order number (e.g., FP240817001)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {showPhoneInput && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number used for order"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      For guest orders, we need the phone number for verification
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How to find your order number:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Check your order confirmation page</li>
                      <li>• Look for the order number in the format: FP240817001</li>
                      <li>• For guest orders, you may need the phone number</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <>
              {/* Order Status Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 text-center sm:text-right">
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <Clock size={14} className="mr-1" />
                      {getDeliveryStatus()}
                    </div>
                    
                    {order.estimatedDeliveryTime && order.status !== 'delivered' && (
                      <p className="text-sm text-gray-600 mt-1">
                        Expected: {new Date(order.estimatedDeliveryTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.purchaseType === 'unit' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {item.purchaseType === 'unit' ? 'Individual' : 'Package'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Delivery Address
                </h3>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{order.deliveryAddress.name}</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.area}, {order.deliveryAddress.city}</p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-sm">Near: {order.deliveryAddress.landmark}</p>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Order Timeline
                </h3>
                <StatusTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
              </div>

              {/* Track Another Order */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setOrder(null);
                    setOrderNumber('');
                    setPhoneNumber('');
                    setError(null);
                    setShowPhoneInput(false);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Search size={16} />
                  <span>Track Another Order</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderTracking;