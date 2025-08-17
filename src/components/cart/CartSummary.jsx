import React from 'react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ showActions = true }) => {
  const { cart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => `Rs. ${parseFloat(price).toFixed(2)}`;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    // Navigate to checkout page (to be implemented)
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (cart.isEmpty) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <FaShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Add some products to get started</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Items Count */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Items ({cart.totalItems})</span>
        <span>{formatPrice(cart.subtotal)}</span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between text-base font-medium text-gray-900 mb-4 pt-2 border-t border-gray-200">
        <span>Subtotal</span>
        <span>{formatPrice(cart.subtotal)}</span>
      </div>

      {/* Delivery Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Delivery charges and taxes will be calculated at checkout
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <button
            onClick={handleClearCart}
            disabled={loading}
            className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
          >
            <FaTrash size={12} />
            <span>Clear Cart</span>
          </button>
        </div>
      )}

      {/* Login Prompt for Guest Users */}
      {!isAuthenticated && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Have an account? Sign in for faster checkout
          </p>
          <button
            onClick={() => navigate('/login', { state: { from: '/cart' } })}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;