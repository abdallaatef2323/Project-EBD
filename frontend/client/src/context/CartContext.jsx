import { createContext, useState } from 'react';

// 1️⃣ Create the context
export const CartContext = createContext();

// 2️⃣ Create the provider
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 3️⃣ Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
  };

  // 4️⃣ Remove item from cart (optional but useful)
  const removeFromCart = (index) => {
    setCartItems(prevItems =>
      prevItems.filter((_, i) => i !== index)
    );
  };

  // 5️⃣ Clear cart (optional)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
