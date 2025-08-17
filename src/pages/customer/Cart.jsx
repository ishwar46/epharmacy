import React from 'react';
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
      
      {/* Mobile-First Design */}
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Sticky */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors active:scale-95"
            >
              <FaArrowLeft size={18} className="sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Cart</h1>
              {!cart.isEmpty && (
                <p className="text-xs sm:text-sm text-gray-600">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
            
            <div className="w-16"></div> {/* Spacer for balance */}
          </div>
        </div>

        {cart.isEmpty ? (
          /* Mobile-First Empty Cart State */
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
              <CartSummary showActions={true} />
            </div>
          </div>
        ) : (
          /* Mobile-First Cart Layout */
          <div className="flex flex-col lg:flex-row lg:max-w-7xl lg:mx-auto lg:px-6 lg:py-8 lg:gap-8">
            {/* Cart Items - Mobile Stacked */}
            <div className="flex-1 lg:flex-none lg:w-2/3">
              {/* Mobile Items List */}
              <div className="p-4 sm:p-6 lg:bg-white lg:rounded-lg lg:shadow-sm">
                <div className="hidden lg:block mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({cart.totalItems})
                  </h2>
                </div>
                
                {/* Items Container */}
                <div className="space-y-3 sm:space-y-4">
                  {cart.items.map((item) => (
                    <div key={`${item.product._id}-${item.purchaseType}`} className="bg-white rounded-lg shadow-sm lg:shadow-none lg:bg-transparent lg:border lg:border-gray-200 lg:rounded-lg">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>

                {/* Continue Shopping - Desktop */}
                <div className="hidden lg:block mt-6 p-4 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => navigate('/products')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Summary - Mobile Bottom / Desktop Side */}
            <div className="lg:w-1/3">
              {/* Mobile: Fixed Bottom */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
                <CartSummary showActions={true} isMobile={true} />
              </div>
              
              {/* Desktop: Sticky Side */}
              <div className="hidden lg:block lg:sticky lg:top-24">
                <CartSummary showActions={true} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Continue Shopping Button */}
        {!cart.isEmpty && (
          <div className="lg:hidden px-4 py-3 bg-white border-t border-gray-100">
            <button
              onClick={() => navigate('/products')}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>
        )}

        {/* Mobile Bottom Padding for Fixed Summary */}
        {!cart.isEmpty && <div className="lg:hidden h-28 sm:h-32"></div>}

        {/* Notices - Mobile Optimized */}
        <div className="px-4 py-6 space-y-4 lg:max-w-7xl lg:mx-auto lg:px-6">
          {/* Cart Expiration Notice */}
          {!cart.isEmpty && cart.expiresAt && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800">
                <span className="font-medium">Note:</span> Items reserved for limited time. Complete purchase soon to ensure availability.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Secure Shopping</h3>
            <div className="text-xs sm:text-sm text-blue-800 space-y-1">
              <p>• Encrypted and secure transactions</p>
              <p>• Prescription required for Rx medicines</p>
              <p>• Guaranteed authentic medicines</p>
              <p>• Fast delivery across Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;