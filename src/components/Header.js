'use client';
import Link from 'next/link';
import { useWallet } from '@/components/WalletProvider';

export default function Header() {
  const { address, short, logout } = useWallet();

  return (
    <header className="bg-dark">
      <nav className="navbar navbar-expand-md navbar-dark container">
        <Link className="navbar-brand fs-3" href="/">Pixel Birds</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-md-center gap-2">
            {address && (
              <li className="nav-item">
                <Link className="nav-link fs-5" href="/play">Play</Link>
              </li>
            )}
            <li className="nav-item"><Link className="nav-link fs-5" href="/#roadmap">Roadmap</Link></li>
            <li className="nav-item"><Link className="nav-link fs-5" href="/#team">The Team</Link></li>

            {!address ? (
              <li className="nav-item">
                <Link
                  href={{ pathname: '/login', query: { next: '/play' } }}
                  className="btn btn-success btn-sm rounded-pill px-3"
                >
                  🔗 Login
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <span className="badge text-bg-success rounded-pill px-3 py-2">{short}</span>
                </li>
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    Logout
                  </button>
                </li>
              </>
            )}

            <li className="nav-item ms-1"><span className="fs-4" aria-hidden>🐦</span></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
