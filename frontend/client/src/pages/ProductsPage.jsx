import ProductCard from '../components/ProductCard';

const products = [
  { id: 1, name: 'Cigarettes Pack', price: 40 },
  { id: 2, name: 'Soft Drink', price: 15 },
  { id: 3, name: 'Snacks', price: 10 }
];

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>

      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
