import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import SEO from '../../components/common/SEO';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading } = useCart();
  
  useDynamicTitle('Shopping Cart');

  if (loading && cart.isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Shopping Cart - FixPharmacy"
        description="Review and manage items in your shopping cart. Secure checkout for all your pharmaceutical needs."
        keywords="shopping cart, pharmacy cart, checkout, online pharmacy nepal"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <FaArrowLeft size={16} />
              <span>Continue Shopping</span>
            </button>
            
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {!cart.isEmpty && (
                <p className="text-gray-600">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </div>

          {cart.isEmpty ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <CartSummary showActions={true} />
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Cart Items ({cart.totalItems})
                  </h2>
                  
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <CartItem key={`${item.product._id}-${item.purchaseType}`} item={item} />
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <button
                    onClick={() => navigate('/products')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <CartSummary showActions={true} />
                </div>
              </div>
            </div>
          )}

          {/* Cart Expiration Notice */}
          {!cart.isEmpty && cart.expiresAt && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Items in your cart are reserved for a limited time. 
                Complete your purchase soon to ensure availability.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Secure Shopping</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• All transactions are encrypted and secure</p>
              <p>• Valid prescription required for prescription medicines</p>
              <p>• Quality guaranteed authentic medicines</p>
              <p>• Fast and reliable delivery across Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;