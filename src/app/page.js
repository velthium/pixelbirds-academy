'use client'

import PageTitle from '@/components/PageTitle';
import HomeStats from '@/components/HomeStats';
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
      <main className="container py-5">
      {/* Hero */}
        <section className="text-center">
          <h1 className="display-5 mb-3">Pixel Birds</h1>
          <p className="lead mx-auto" style={{maxWidth: 980}}>
            Pixel Birds is a collection (based on Stargaze) of 5202 adorable pixelated NFT birds,
            each with its own characteristic.
          </p>


          <HomeStats />

          <p className="mx-auto" style={{maxWidth: 980}}>
            Pixel Birds is on the Stargaze blockchain, renowned for its negligible energy consumption
            and virtually zero gas fees.
          </p>
        </section>

         {/* Panels */}
        <section className="py-4">
          
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <a
                href="https://www.stargaze.zone/l/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the collection on Stargaze marketplace"
                className="d-block text-reset text-decoration-none"
              >
                <h3 className="text-center mb-3">Mint Page</h3>
                <div className="bg-white border border-success-subtle rounded-4 p-3 d-flex justify-content-center bg-success-subtle">
                  <Image src="/images/mint-preview.webp" alt="Mint page preview" width={360} height={220} className="img-fluid rounded-3" />
                </div>
              </a>
            </div>
            <div className="col-12 col-lg-6">
              <a
                href="https://www.stargaze.zone/m/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2/tokens"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the collection on Stargaze marketplace"
                className="d-block text-reset text-decoration-none"
              >
                <h3 className="text-center mb-3">Marketplace</h3>
                <div className="bg-white border border-success-subtle rounded-4 p-3 d-flex justify-content-center bg-success-subtle">
                  <Image src="/images/market-preview.webp" alt="Marketplace preview" width={360} height={220} className="img-fluid rounded-3" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-5 bg-success-subtle">
          <div className="container">
            <h2 className="text-center mb-5">🚀 Roadmap</h2>

            <div className="mx-auto" style={{ maxWidth: 600 }}>
              {/* Timeline container */}
              <div className="border-start border-3 border-success ps-4">
                
                {/* Item 1 */}
                <div className="card shadow-sm mb-4 border-success-subtle">
                  <div className="card-body">
                    <h5 className="card-title mb-1">NFT Collection Launch</h5>
                    <p className="card-text text-muted small">5,202 PixelBirds minted on Stargaze.</p>
                    <span className="badge text-bg-success">✅ Done</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="card shadow-sm mb-4 border-success-subtle">
                  <div className="card-body">
                    <h5 className="card-title mb-1">Website Foundation</h5>
                    <p className="card-text text-muted small">Homepage, mint page & marketplace preview.</p>
                    <span className="badge text-bg-success">✅ Done</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="card shadow-sm mb-4 border-success-subtle">
                  <div className="card-body">
                    <h5 className="card-title mb-1">Game Creation</h5>
                    <p className="card-text text-muted small">PixelBirds eco-game base mechanics.</p>
                    <span className="badge text-bg-warning">⏳ In Progress</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="card shadow-sm border-success-subtle">
                  <div className="card-body">
                    <h5 className="card-title mb-1">Game Improvements</h5>
                    <p className="card-text text-muted small">Leaderboard, NFT skins, global impact stats.</p>
                    <span className="badge text-bg-warning">⏳ In Progress</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section id="team" className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5">👥 The Team</h2>

            <div className="mx-auto" style={{ maxWidth: 600 }}>
              <div className="border-start border-3 border-primary ps-4">
                
                {/* Team Member */}
                <div className="card shadow-sm border-primary-subtle">
                  <div className="card-body d-flex align-items-center">
                    {/* Avatar / Logo */}
                    <div className="me-3 fs-1">
                    <Image src="/images/velthium-nft.png" alt="Mint page preview" width={360} height={220} className="img-fluid rounded-3" />
                    </div>
                    <div>
                      <h5 className="card-title mb-1">Velthium</h5>
                      <p className="card-text text-muted small mb-1">
                        Creator of the NFT collection, the website, and the game.
                      </p>
                      <span className="badge text-bg-primary">Solo Builder</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
