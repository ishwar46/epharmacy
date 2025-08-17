import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaMinus, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

const AddToCartButton = ({ 
  product, 
  purchaseType = 'package', 
  className = '',
  size = 'md' 
}) => {
  const { addToCart, getCartItem, updateCartItem, checkAvailability, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Safeguard: STRICT enforcement - only tablets and capsules can be sold per unit
  const safePurchaseType = (purchaseType === 'unit' && 
    (!['tablet', 'capsule'].includes(product.productType) || !product.allowUnitSale)) 
    ? 'package' 
    : purchaseType;

  const cartItem = getCartItem(product._id, safePurchaseType);
  const isInCart = !!cartItem;

  // Check availability when component mounts or quantity changes
  useEffect(() => {
    const checkProductAvailability = async () => {
      if (!product._id || quantity < 1) return;
      
      setIsChecking(true);
      const result = await checkAvailability(product._id, quantity, safePurchaseType);
      setAvailability(result);
      setIsChecking(false);
    };

    checkProductAvailability();
  }, [product._id, quantity, safePurchaseType, checkAvailability]);

  const handleAddToCart = async () => {
    if (!availability?.available || isUpdating) return;
    
    setIsUpdating(true);
    const success = await addToCart(product._id, quantity, safePurchaseType);
    if (success) {
      setQuantity(1); // Reset quantity after adding
    }
    setIsUpdating(false);
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 0 || isUpdating) return;
    
    setIsUpdating(true);
    await updateCartItem(product._id, safePurchaseType, cartItem.quantity + newQuantity);
    setIsUpdating(false);
  };

  const getPurchaseTypeLabel = () => {
    if (safePurchaseType === 'unit' && ['tablet', 'capsule'].includes(product.productType) && product.allowUnitSale) {
      return product.productType === 'tablet' ? 'Tablets' : 'Capsules';
    }
    // For package purchases, use specific terms
    if (product.productType === 'syrup') return 'Bottles';
    if (product.productType === 'tablet' || product.productType === 'capsule') return 'Strips';
    if (product.productType === 'cream') return 'Tubes';
    if (product.productType === 'injection') return 'Vials';
    return 'Packages';
  };

  const formatPrice = (price) => `Rs. ${parseFloat(price).toFixed(2)}`;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  // Show validation messages if any
  const validationMessage = availability?.validationMessages?.[0];
  const isAvailable = availability?.available && !validationMessage;

  if (isInCart) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <FaShoppingCart className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-800">
              {cartItem.quantity} in cart
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUpdateQuantity(-1)}
              disabled={isUpdating || cartItem.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center border border-green-300 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaMinus size={10} />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(1)}
              disabled={isUpdating}
              className="w-7 h-7 flex items-center justify-center border border-green-300 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus size={12} />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border border-gray-300 rounded-md py-1 text-sm"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FaPlus size={12} />
          </button>
        </div>
        <span className="text-sm text-gray-600">{getPurchaseTypeLabel()}</span>
      </div>

      {/* Price Display */}
      {availability && (
        <div className="text-sm text-gray-600">
          <span>Price: {formatPrice(availability.pricePerItem)} × {quantity} = </span>
          <span className="font-semibold text-green-600">
            {formatPrice(availability.totalPrice)}
          </span>
        </div>
      )}

      {/* Validation Messages */}
      {validationMessage && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {validationMessage}
        </div>
      )}

      {/* Purchase Type Info - Enhanced messaging */}
      {safePurchaseType === 'unit' && ['tablet', 'capsule'].includes(product.productType) && product.allowUnitSale && (
        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center space-x-1">
            <span className="font-medium">Individual {getPurchaseTypeLabel().toLowerCase()}</span>
            <span>• Taken from strips of {product.unitsPerStrip || 10}</span>
          </div>
          <div className="text-blue-500 mt-1">
            Perfect for trying new medicines or precise dosing
          </div>
        </div>
      )}
      
      {/* Package Type Info */}
      {safePurchaseType === 'package' && ['tablet', 'capsule'].includes(product.productType) && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="flex items-center space-x-1">
            <span className="font-medium">Complete strip</span>
            <span>• {product.unitsPerStrip || 10} {product.productType}s</span>
          </div>
          <div className="text-green-500 mt-1">
            Best value for regular medication
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isAvailable || isUpdating || isChecking || loading}
        className={`w-full flex items-center justify-center space-x-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getSizeClasses()} ${
          isAvailable
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500'
        }`}
      >
        {(isUpdating || isChecking || loading) ? (
          <FaSpinner className="animate-spin" size={16} />
        ) : (
          <FaShoppingCart size={16} />
        )}
        <span>
          {isChecking ? 'Checking...' : 
           isUpdating ? 'Adding...' : 
           isAvailable ? 'Add to Cart' : 
           'Unavailable'}
        </span>
      </button>

      {/* Stock Warning */}
      {availability && availability.availableStock < 10 && availability.available && (
        <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-2">
          Only {availability.availableStock} packages in stock
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;