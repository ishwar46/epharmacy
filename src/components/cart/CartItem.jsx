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
    if (purchaseType === 'unit') {
      return product.productType === 'tablet' ? 'Tablets' : 
             product.productType === 'capsule' ? 'Capsules' : 'Units';
    }
    return 'Packages';
  };

  const getUnitInfo = () => {
    if (purchaseType === 'unit' && (product.productType === 'tablet' || product.productType === 'capsule')) {
      return `${product.unitsPerStrip || 10} per strip`;
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={buildImageUrl(product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaPills className="text-gray-400" size={24} />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <p className="text-xs text-gray-500 capitalize">{product.productType}</p>
              
              {/* Purchase Type Info */}
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {getPurchaseTypeLabel()}
                  {getUnitInfo() && ` (${getUnitInfo()})`}
                </span>
              </div>
              
              {/* Unit Sale Info */}
              {purchaseType === 'unit' && getUnitInfo() && (
                <p className="text-xs text-gray-500 mt-1">
                  Individual {product.productType}s from strips
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
              title="Remove from cart"
            >
              <FaTrash size={14} />
            </button>
          </div>

          {/* Quantity Controls and Price */}
          <div className="flex items-center justify-between mt-4">
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

            {/* Price Info */}
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {formatPrice(pricePerItem)} × {quantity}
              </div>
              <div className="text-lg font-semibold text-green-600">
                {formatPrice(totalPrice)}
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {product.stock < 10 && (
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Only {product.stock} packages in stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;