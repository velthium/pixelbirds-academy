"use client";

import CourseList from '@/components/courses/CourseList';
import usePixelBirdAccess, { ACCESS_STATUS } from '@/hooks/usePixelBirdAccess';
import Link from 'next/link';

export default function AcademyPage() {
  const { address, status, tokens, isHolder, isLoading } = usePixelBirdAccess();

  const renderContent = () => {
    if (!address) {
      return (
        <div className="text-center">
          <p className="lead text-secondary mb-4">
            Connect your Stargaze wallet to prove you hold a PixelBird NFT and unlock the lessons.
          </p>
          <Link href={{ pathname: '/login', query: { next: '/academy' } }} className="btn btn-success btn-lg rounded-pill px-4">
            🔐 Login with wallet
          </Link>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" aria-label="Loading access" />
          <p className="text-muted mt-3">Checking your PixelBirds…</p>
        </div>
      );
    }

    if (status === ACCESS_STATUS.ERROR) {
      return (
        <div className="alert alert-danger" role="alert">
          <strong>We could not verify your collection.</strong> Please refresh the page or try again later.
        </div>
      );
    }

    if (!isHolder) {
      return (
        <div className="text-center">
          <p className="lead text-secondary mb-3">
            No PixelBirds detected on <span className="fw-bold">{address}</span>.
          </p>
          <p className="text-muted mb-4">
            You need at least one PixelBird NFT to access the Academy. Visit the marketplace to add one to your flock.
          </p>
          <a
            href="https://www.stargaze.zone/m/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success btn-lg rounded-pill px-4"
          >
            Explore the marketplace
          </a>
        </div>
      );
    }

    return (
      <>
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body text-start">
            <h2 className="h5 text-uppercase text-success mb-3">Your PixelBird Crew</h2>
            <div className="d-flex flex-wrap gap-3">
              {tokens.map((token) => (
                <div key={token.tokenId} className="d-flex align-items-center gap-2 border rounded-3 px-3 py-2 bg-success-subtle">
                  <span role="img" aria-label="PixelBird">🐦</span>
                  <div>
                    <div className="fw-semibold">{token.name}</div>
                    <div className="small text-muted">ID #{token.tokenId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CourseList />
      </>
    );
  };

  return (
    <div className="academy-container py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">PixelBirds Academy 🌍</h1>
          <p className="lead text-secondary mb-0 mx-auto" style={{ maxWidth: '720px' }}>
            Learn English through immersive eco-missions. Each lesson mixes storytelling, decision-making mini-games,
            and quizzes so you can become a guardian of our planet.
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
