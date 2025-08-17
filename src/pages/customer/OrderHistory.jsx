import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { getUserOrders } from '../../services/orderService';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  // Dynamic title
  useDynamicTitle('My Orders - FixPharmacy');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await getUserOrders();
        
        if (response.success) {
          setOrders(response.data);
        } else {
          setError('Failed to load orders');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders');
        toast.error('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filters.status !== 'all' && order.status !== filters.status) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => 
          item.productSnapshot.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          return orderDate >= new Date(now.setDate(now.getDate() - 7));
        case 'month':
          return orderDate >= new Date(now.setMonth(now.getMonth() - 1));
        case '3months':
          return orderDate >= new Date(now.setMonth(now.getMonth() - 3));
        default:
          return true;
      }
    }

    return true;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      prescription_verified: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Verified' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Confirmed' },
      packed: { color: 'bg-purple-100 text-purple-800', icon: Package, text: 'Packed' },
      out_for_delivery: { color: 'bg-blue-100 text-blue-800', icon: Truck, text: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Cancelled' },
      returned: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Returned' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Orders - FixPharmacy"
        description="View your order history, track deliveries, and manage your pharmaceutical orders"
        keywords="order history, track orders, pharmacy orders, medicine delivery status"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Orders</h1>
              <p className="text-xs sm:text-sm text-gray-600">{filteredOrders.length} orders</p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Date Range */}
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start shopping to see your order history here."
                  : "Try adjusting your filters to find the orders you're looking for."
                }
              </p>
              {orders.length === 0 && (
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600">
                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      <Link
                        to={`/track/${order.orderNumber}`}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Eye size={14} />
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.productSnapshot.image ? (
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${item.productSnapshot.image}`}
                                alt={item.productSnapshot.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.productSnapshot.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} • Rs. {item.totalPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          <span>{order.deliveryAddress.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Package size={14} className="mr-1" />
                          <span>{order.items.length} items</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          Rs. {order.pricing.total}
                        </p>
                        <p className="text-xs text-gray-600">{order.payment.method.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;