import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  Truck,
  Clock,
  ArrowRight,
  Share2,
  Download,
  FileText,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { trackOrder } from '../../services/orderService';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic title
  useDynamicTitle('Order Confirmed - FixPharmacy');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await trackOrder(orderNumber);
        
        if (response.success) {
          setOrder(response.data);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const handleShareOrder = async () => {
    const shareData = {
      title: `FixPharmacy Order ${orderNumber}`,
      text: `Track your medicine order: ${orderNumber}`,
      url: `${window.location.origin}/track/${orderNumber}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Order tracking link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const getEstimatedDelivery = () => {
    if (!order) return '';
    
    const estimatedDate = new Date(order.estimatedDeliveryTime || Date.now() + 24 * 60 * 60 * 1000);
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/track"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Track Another Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Order Confirmed - ${orderNumber} - FixPharmacy`}
        description="Your medicine order has been confirmed. Track your delivery status and get updates."
        keywords="order confirmation, medicine delivery, pharmacy order status"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Success Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 mb-4">
                Thank you for your order. We'll prepare your medicines and deliver them soon.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600 mr-2">Order Number:</span>
                <span className="font-mono font-semibold text-blue-600">{orderNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Order Items
                </h2>
                
                <div className="space-y-4">
                  {order?.items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
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

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Delivery Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">{order?.deliveryAddress?.name}</p>
                    <p className="text-gray-600">{order?.deliveryAddress?.phone}</p>
                  </div>
                  
                  <div className="text-gray-600">
                    <p>{order?.deliveryAddress?.street}</p>
                    <p>{order?.deliveryAddress?.area}, {order?.deliveryAddress?.city}</p>
                    {order?.deliveryAddress?.landmark && (
                      <p className="text-sm">Near: {order.deliveryAddress.landmark}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <Truck className="w-4 h-4" />
                    <span>Estimated delivery: {getEstimatedDelivery()}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Order Status
                </h2>
                
                <div className="space-y-4">
                  {order?.statusHistory?.map((status, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {status.status.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(status.changedAt).toLocaleString()}
                        </p>
                        {status.notes && (
                          <p className="text-sm text-gray-500 mt-1">{status.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleShareOrder}
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Order
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/track/${orderNumber}`}
                    className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/orders"
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Order History
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/"
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>Call: +977-21-123456</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>support@fixpharmacy.com</span>
                  </div>
                  
                  <p className="text-gray-600 mt-4">
                    Our team is available 9 AM - 9 PM to help with your order.
                  </p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Keep this order number for future reference</li>
                  <li>• Ensure someone is available at delivery address</li>
                  <li>• Payment on delivery for COD orders</li>
                  <li>• Contact us immediately for any changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;