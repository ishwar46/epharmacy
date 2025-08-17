import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartAPI from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    totalItems: 0,
    isEmpty: true
  });
  const [loading, setLoading] = useState(false);
  const [guestId, setGuestId] = useState(null);

  // Generate or retrieve guest ID for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      let existingGuestId = localStorage.getItem('guestId');
      if (!existingGuestId) {
        existingGuestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('guestId', existingGuestId);
      }
      setGuestId(existingGuestId);
    } else {
      setGuestId(null);
    }
  }, [isAuthenticated]);

  // Load cart from API
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart(guestId);
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Don't show error toast for cart loading - just fail silently
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  // Load cart when user changes or guest ID is set
  useEffect(() => {
    if (isAuthenticated || guestId) {
      loadCart();
    }
  }, [isAuthenticated, user?.id, guestId, loadCart]);

  // Add item to cart
  const addToCart = async (productId, quantity, purchaseType = 'package') => {
    try {
      setLoading(true);
      
      // Ensure productId is a string and handle any potential type issues
      const productIdString = typeof productId === 'object' ? productId._id : productId;
      
      const response = await cartAPI.addToCart({
        productId: productIdString,
        quantity,
        purchaseType,
        guestId
      });
      
      if (response.success) {
        setCart(response.data);
        toast.success('Item added to cart');
        return true;
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, purchaseType, quantity) => {
    try {
      setLoading(true);
      
      // Ensure productId is a string and handle any potential type issues
      const productIdString = typeof productId === 'object' ? productId._id : productId;
      
      // Debug logging
      console.log('Trying to update cart item:', {
        productId: productIdString,
        purchaseType,
        quantity
      });
      
      const response = await cartAPI.updateCartItem({
        productId: productIdString,
        purchaseType,
        quantity,
        guestId
      });
      
      if (response.success) {
        setCart(response.data);
        if (quantity === 0) {
          toast.success('Item removed from cart');
        } else {
          toast.success('Cart updated');
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, purchaseType) => {
    try {
      setLoading(true);
      
      // Ensure productId is a string and handle any potential type issues
      const productIdString = typeof productId === 'object' ? productId._id : productId;
      
      const response = await cartAPI.removeFromCart({
        productId: productIdString,
        purchaseType,
        guestId
      });
      
      if (response.success) {
        setCart(response.data);
        toast.success('Item removed from cart');
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.clearCart(guestId);
      
      if (response.success) {
        setCart({
          items: [],
          subtotal: 0,
          totalItems: 0,
          isEmpty: true
        });
        toast.success('Cart cleared');
        return true;
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check product availability
  const checkAvailability = async (productId, quantity, purchaseType = 'package') => {
    try {
      const response = await cartAPI.checkAvailability({
        productId,
        quantity,
        purchaseType
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return null;
    }
  };

  // Get cart item by product and purchase type
  const getCartItem = (productId, purchaseType) => {
    return cart.items.find(
      item => item.product._id === productId && item.purchaseType === purchaseType
    );
  };

  // Get total quantity for a specific product (across all purchase types)
  const getProductQuantity = (productId) => {
    return cart.items
      .filter(item => item.product._id === productId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    guestId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkAvailability,
    getCartItem,
    getProductQuantity,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;