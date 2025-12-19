import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(error => {
        console.error('Failed to fetch products:', error);
        // Keep empty array if API fails - no fallback
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <h2>Products</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-page">
        <h2>Products</h2>
        <p>No products available.</p>
      </div>
    );
  }

  // Check if we should use ProductCard or grid
  const useProductCard = ProductCard && products[0]?._id;

  return (
    <div className="products-page">
      <h2>Products</h2>
      
      <div className={useProductCard ? "products-list" : "products-grid"}>
        {products.map((product) => (
          useProductCard ? (
            <ProductCard key={product._id} product={product} />
          ) : (
            <div key={product.id || product._id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">{product.price} EGP</p>
              <button
                className="btn-add"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}