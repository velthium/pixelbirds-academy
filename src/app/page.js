'use client'

import PageTitle from '@/components/PageTitle';
import { useEffect, useState } from 'react';
import Image from "next/image";

export default function Home() {
    const stats = [
    { label: '🌳 Trees planted', value: '10,240' },
    { label: '🐦 PixelBirds holders', value: '512' },
    { label: '🎮 Games played', value: '3,421' }
  ]

const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Top bar */}
      <header className="topbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="brand">Pixel Birds</div>
          <nav className="nav d-flex align-items-center">
            <a href="#roadmap">Roadmap</a>
            <a href="#team">The Team</a>
            <a href="#login">Login</a>
            <span className="icons">🐦</span>
          </nav>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <section className="hero">
          <h1 className="title">Pixel Birds</h1>
          <p className="lead">
            Pixel Birds is a collection (based on Stargaze) of 5202 adorable pixelated NFT birds,
            each with its own characteristic.
          </p>

          {/* Stats block */}
          <div className="stats">
            {stats.map((s, i) => (
              <div key={i} className="stat">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <p className="sub">
            Pixel Birds is on the Stargaze blockchain, renowned for its negligible energy consumption
            and virtually zero gas fees.
          </p>
        </section>

        {/* Two feature panels */}
        <section className="panels">
          <div className="panel">
            <h3>Mint Page</h3>
            <div className="card">
              <Image
                src="/images/mint-preview.webp"
                alt="Mint page preview"
                width={300}
                height={300}
              />
            </div>
          </div>

          <div className="panel">
            <h3>Marketplace</h3>
            <div className="card">
              <Image
                src="/images/market-preview.webp"
                alt="Marketplace preview"
                width={300}
                height={300}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">© Velthium. All rights reserved.</div>
      </footer>
    </>
  )
}
