import { useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useContext(CartContext);

  const placeOrder = async () => {
    try {
      const items = cartItems.map(i => ({
        name: i.name,
        qty: i.quantity,
        price: i.price,
      }));

      await api.post('/orders', {
        items,
        totalAmount: getTotalPrice(),
      });

      clearCart();
      alert('Order placed successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Cart</h2>

        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name}</span>
            <span>{item.price} EGP</span>
            <button className="btn-danger" onClick={() => removeFromCart(index)}>
              Remove
            </button>
          </div>
        ))}

        <h3>Total: {getTotalPrice()} EGP</h3>

        <button className="btn-success" onClick={placeOrder}>
          Place Order
        </button>

        <button className="btn-danger" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
