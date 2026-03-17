import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('gr_cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('gr_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (plant, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(c => c.plantId === plant._id);
      if (exists) return prev.map(c => c.plantId === plant._id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { plantId: plant._id, name: plant.name, price: plant.price, emoji: plant.emoji || '🌿', qty, nurseryId: plant.nursery }];
    });
  };

  const updateQty = (plantId, qty) => {
    if (qty < 1) return removeFromCart(plantId);
    setCart(prev => prev.map(c => c.plantId === plantId ? { ...c, qty } : c));
  };

  const removeFromCart = (plantId) => setCart(prev => prev.filter(c => c.plantId !== plantId));

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
