import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="products-page">
      <h2>Products</h2>

      <div className="products-grid">
        {products.map(p => (
          <div key={p._id} className="product-card">
            <h3>{p.name}</h3>
            <p className="price">{p.price} EGP</p>
            <button
              className="btn-add"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
