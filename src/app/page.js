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
      <main className="container py-5">
      {/* Hero */}
        <section className="text-center">
          <h1 className="display-5 mb-3">Pixel Birds</h1>
          <p className="lead mx-auto" style={{maxWidth: 980}}>
            Pixel Birds is a collection (based on Stargaze) of 5202 adorable pixelated NFT birds,
            each with its own characteristic.
          </p>

          {/* Stats (row/col, fond vert doux) */}
          <div className="bg-success-subtle border border-success-subtle rounded-4 shadow-sm px-3 py-4 my-4">
            <div className="row text-center g-4 align-items-center">
              {[
                { label: 'Trees planted', value: '10,240', emoji: '🌳' },
                { label: 'PixelBirds holders', value: '512', emoji: '🪺' },
                { label: 'Games played', value: '3,421', emoji: '🎮' },
              ].map((s, i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className={`d-flex flex-column align-items-center ${i>0 ? 'border-start border-2 border-success ps-md-4' : ''}`}>
                    <div className="fs-4">{s.label}</div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                      <span className="fs-3">{s.value}</span>
                      <span className="fs-1 lh-1">{s.emoji}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto" style={{maxWidth: 980}}>
            Pixel Birds is on the Stargaze blockchain, renowned for its negligible energy consumption
            and virtually zero gas fees.
          </p>
        </section>

         {/* Panels */}
        <section className="py-4">
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <h3 className="text-center mb-3">Mint Page</h3>
              <div className="bg-white border border-success-subtle rounded-4 p-3 d-flex justify-content-center bg-success-subtle">
                <Image src="/images/mint-preview.webp" alt="Mint page preview" width={360} height={220} className="img-fluid rounded-3" />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <h3 className="text-center mb-3">Marketplace</h3>
              <div className="bg-white border border-success-subtle rounded-4 p-3 d-flex justify-content-center bg-success-subtle">
                <Image src="/images/market-preview.webp" alt="Marketplace preview" width={360} height={220} className="img-fluid rounded-3" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
