'use client';
import { useEffect, useMemo, useState } from 'react';

function fmt(n) {
  try { return new Intl.NumberFormat().format(Number(n || 0)); }
  catch { return String(n ?? 0); }
}

function formatDelta(n) {
  if (n === null || n === undefined) return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  if (num === 0) return 'Updated today';
  const sign = num > 0 ? '+' : '−';
  return `${sign}${fmt(Math.abs(num))}`;
}

export default function HomeStats({ refreshMs = 30000, className = '' }) {
  const [data, setData] = useState({ treesPlanted: 0, holders: 0, gamesPlayed: 0, daily: {} });
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  const items = useMemo(() => ([
    {
      label: 'Trees planted',
      value: loading ? '…' : fmt(data.treesPlanted),
      emoji: '🌳',
      delta: loading ? null : formatDelta(data?.daily?.treesPlanted),
    },
    {
      label: 'PixelBirds holders',
      value: loading ? '…' : fmt(data.holders),
      emoji: '🪺',
      delta: loading ? null : formatDelta(data?.daily?.holders),
    },
    {
      label: 'Games played',
      value: loading ? '…' : fmt(data.gamesPlayed),
      emoji: '🎮',
      delta: loading ? null : formatDelta(data?.daily?.gamesPlayed),
    },
  ]), [loading, data]);

  return (
    <div className={`bg-success-subtle border border-success-subtle rounded-4 shadow-sm px-3 py-4 my-4 ${className}`}>
      <div className="row text-center g-4 align-items-center">
        {items.map((s, i) => (
          <div key={s.label} className="col-12 col-md-4">
            <div className={`d-flex flex-column align-items-center ${i > 0 ? 'border-start border-2 border-success ps-md-4' : ''}`}>
              <div className="fs-4">{s.label}</div>
              <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                <span className="fs-3">{s.value}</span>
                <span className="fs-1 lh-1" aria-hidden>{s.emoji}</span>
              </div>
              {s.delta && (
                <span className="badge text-bg-white border border-success-subtle text-success-emphasis mt-2 small">
                  {s.delta}
                  {s.delta === 'Updated today' ? '' : ' today'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
