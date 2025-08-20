import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (course) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === course.id);
      if (existing) return prev;
      return [...prev, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal
  }), [cartItems, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};
