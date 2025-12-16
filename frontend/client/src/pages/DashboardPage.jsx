export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div className="card">
          <h3>Credit Limit</h3>
          <p>3000 EGP</p>
        </div>

        <div className="card">
          <h3>Outstanding Balance</h3>
          <p>800 EGP</p>
        </div>

        <div className="card">
          <h3>Status</h3>
          <p>Active</p>
        </div>
      </div>
    </div>
  );
}
