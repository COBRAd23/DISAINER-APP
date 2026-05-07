import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDb, initDatabase } from '../database/db';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const db = await getDb();
      const allRows = await db.getAllAsync('SELECT * FROM cart');
      setItems(allRows);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (service) => {
    try {
      const db = await getDb();
      const existing = await db.getFirstAsync('SELECT * FROM cart WHERE serviceId = ?', [service.id]);
      
      if (existing) {
        await db.runAsync('UPDATE cart SET quantity = quantity + 1 WHERE serviceId = ?', [service.id]);
      } else {
        await db.runAsync(
          'INSERT INTO cart (serviceId, name, price, quantity) VALUES (?, ?, ?, ?)',
          [service.id, service.name, service.price, 1]
        );
      }
      await fetchItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      const db = await getDb();
      await db.runAsync('DELETE FROM cart WHERE id = ?', [id]);
      await fetchItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const db = await getDb();
      await db.runAsync('DELETE FROM cart');
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      await fetchItems();
    };
    setup();
  }, [fetchItems]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
