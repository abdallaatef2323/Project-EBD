import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
