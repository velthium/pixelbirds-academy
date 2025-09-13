'use client';
import { useEffect, useState } from 'react';

export default function Leaderboard({ className = '' }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const json = await res.json();
      setRows(json?.top ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000); // refresh toutes les 30s
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-sm align-middle">
        <thead>
          <tr>
            <th style={{width: 60}}>#</th>
            <th>Wallet</th>
            <th style={{width: 120}}>Best</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="text-muted">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={3} className="text-muted">No scores yet.</td></tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.address}>
                <td>{i + 1}</td>
                <td>{r.address.slice(0, 8)}…{r.address.slice(-6)}</td>
                <td><span className="badge text-bg-dark">{r.best_score}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
