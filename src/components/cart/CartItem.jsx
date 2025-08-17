import React, { useState } from 'react';
import { FaMinus, FaPlus, FaTrash, FaPills } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { buildImageUrl } from '../../utils/imageUtils';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const { product, quantity, purchaseType, pricePerItem, totalPrice } = item;

  // Debug: Log the item data
  console.log('CartItem received:', {
    productId: product._id,
    productName: product.name,
    purchaseType,
    quantity
  });

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0 || isUpdating) return;
    
    setIsUpdating(true);
    await updateCartItem(product._id, purchaseType, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    await removeFromCart(product._id, purchaseType);
    setIsUpdating(false);
  };

  const formatPrice = (price) => `Rs. ${parseFloat(price).toFixed(2)}`;

  const getPurchaseTypeLabel = () => {
    if (purchaseType === 'unit' && ['tablet', 'capsule'].includes(product.productType) && product.allowUnitSale) {
      return product.productType === 'tablet' ? 'Tablets' : 'Capsules';
    }
    // For package purchases, use specific terms
    if (product.productType === 'syrup') return 'Bottles';
    if (product.productType === 'tablet' || product.productType === 'capsule') return 'Strips';
    if (product.productType === 'cream') return 'Tubes';
    if (product.productType === 'injection') return 'Vials';
    return 'Packages';
  };

  const getUnitInfo = () => {
    if (purchaseType === 'unit' && (product.productType === 'tablet' || product.productType === 'capsule')) {
      return `${product.unitsPerStrip || 10} per strip`;
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
      {/* Mobile Layout */}
      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Mobile: Product Info Row */}
        <div className="flex items-start space-x-3 sm:space-x-0">
          {/* Product Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={buildImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaPills className="text-gray-400" size={20} />
              </div>
            )}
          </div>

          {/* Product Details - Mobile */}
          <div className="flex-1 sm:hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <h3 className="font-semibold text-gray-900 text-base leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-xs text-gray-500 capitalize">{product.productType}</p>
              </div>
              
              {/* Mobile Remove Button */}
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 flex-shrink-0"
                title="Remove from cart"
              >
                <FaTrash size={14} />
              </button>
            </div>
            
            {/* Mobile Purchase Type */}
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                purchaseType === 'unit' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {getPurchaseTypeLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Product Details */}
        <div className="hidden sm:block flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <p className="text-xs text-gray-500 capitalize">{product.productType}</p>
              
              {/* Purchase Type Info - Enhanced */}
              <div className="mt-2 space-y-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  purchaseType === 'unit' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {getPurchaseTypeLabel()}
                  {getUnitInfo() && ` (${getUnitInfo()})`}
                </span>
                
                {/* Enhanced info based on purchase type */}
                {purchaseType === 'unit' && ['tablet', 'capsule'].includes(product.productType) && (
                  <p className="text-xs text-blue-600 font-medium">
                    Individual units • Taken from strips of {product.unitsPerStrip || 10}
                  </p>
                )}
                
                {purchaseType === 'package' && ['tablet', 'capsule'].includes(product.productType) && (
                  <p className="text-xs text-green-600 font-medium">
                    Complete strip • {product.unitsPerStrip || 10} {product.productType}s
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
              title="Remove from cart"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Bottom Controls Row */}
      <div className="sm:hidden">
        {/* Quantity Controls - Mobile */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 font-medium">Qty:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMinus size={10} />
              </button>
              <span className="w-8 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus size={10} />
              </button>
            </div>
          </div>

          {/* Mobile Price */}
          <div className="text-right">
            <div className="text-xs text-gray-600">
              {formatPrice(pricePerItem)} × {quantity}
            </div>
            <div className="text-lg font-semibold text-green-600">
              {formatPrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Quantity Controls and Price */}
      <div className="hidden sm:flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaMinus size={12} />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        {/* Desktop Price Info */}
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {formatPrice(pricePerItem)} × {quantity}
          </div>
          <div className="text-lg font-semibold text-green-600">
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>

      {/* Enhanced Stock Warning */}
      {product.stock < 10 && (
        <div className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded flex items-center space-x-1">
          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
          <span>
            Only {product.stock} {
              purchaseType === 'package' 
                ? (product.productType === 'tablet' || product.productType === 'capsule' ? 'strips' : 'packages') 
                : `packages (${product.stock * (product.unitsPerStrip || 10)} units)`
            } in stock
          </span>
        </div>
      )}
    </div>
  );
};

export default CartItem;