import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>Price: {product.price} EGP</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
