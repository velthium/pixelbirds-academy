'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import courses from '@/data/courses.json';
import EcoMissionGame from '@/components/courses/EcoMissionGame';
import usePixelBirdAccess, { ACCESS_STATUS } from '@/hooks/usePixelBirdAccess';

function MissionSummary({ mission, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mission.id)}
      className={`text-start w-100 btn ${
        isActive ? 'btn-success text-white' : 'btn-outline-success'
      } rounded-4 p-4 d-flex flex-column gap-2 align-items-start`}
    >
      <span className="badge text-bg-light text-success-emphasis">{mission.badge}</span>
      <div>
        <h3 className="h5 fw-bold mb-1">{mission.title}</h3>
        <p className={`small mb-2 ${isActive ? 'text-white-50' : 'text-muted'}`}>{mission.tagline}</p>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {mission.focusAreas?.map((area) => (
          <span
            key={area}
            className={`badge rounded-pill ${
              isActive ? 'text-bg-light text-success-emphasis' : 'text-bg-success-subtle text-success-emphasis'
            }`}
          >
            {area}
          </span>
        ))}
      </div>
      <div className={`small fw-semibold ${isActive ? 'text-white' : 'text-success'}`}>
        ⏱️ {mission.estimatedTime} · {mission.level}
      </div>
    </button>
  );
}

export default function PlayPage() {
  const { address, tokens, isHolder, isLoading, status } = usePixelBirdAccess();
  const missions = useMemo(() => courses.filter((course) => Boolean(course.game)), []);
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id ?? null);
  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) ?? missions[0];

  const renderGate = () => {
    if (!address) {
      return (
        <div className="text-center">
          <p className="lead text-secondary mb-4">
            Connect your Stargaze wallet to prove ownership of a PixelBird NFT and access the missions.
          </p>
          <Link href={{ pathname: '/login', query: { next: '/play' } }} className="btn btn-success btn-lg rounded-pill px-4">
            🔐 Login with wallet
          </Link>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" aria-label="Loading access" />
          <p className="text-muted mt-3">Checking your PixelBird flock…</p>
        </div>
      );
    }

    if (status === ACCESS_STATUS.ERROR) {
      return (
        <div className="alert alert-danger" role="alert">
          Something went wrong while verifying your NFT. Please refresh the page and try again.
        </div>
      );
    }

    if (!isHolder) {
      return (
        <div className="text-center">
          <p className="lead text-secondary mb-3">No PixelBirds detected on {address}.</p>
          <p className="text-muted mb-4" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Purchase a PixelBird NFT to unlock every eco-mission, quiz, and downloadable guide. Owning even one bird gives you
            lifetime access.
          </p>
          <a
            href="https://www.stargaze.zone/m/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success btn-lg rounded-pill px-4"
          >
            Browse the marketplace
          </a>
        </div>
      );
    }

    return null;
  };

  const gate = renderGate();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-success mb-3">Mission Control 🎮</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '780px' }}>
          Step into fully English eco-adventures crafted for PixelBird holders. Choose a mission, balance the impact metrics, and
          earn badges while expanding your climate vocabulary.
        </p>
      </div>

      {gate ? (
        gate
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h2 className="h5 text-uppercase text-success mb-3">Your PixelBird crew</h2>
                <div className="d-flex flex-wrap gap-3">
                  {tokens.map((token) => (
                    <div key={token.tokenId} className="border rounded-3 px-3 py-2 bg-success-subtle d-flex align-items-center gap-2">
                      <span role="img" aria-hidden>
                        🐦
                      </span>
                      <div>
                        <div className="fw-semibold">{token.name}</div>
                        <div className="small text-muted">ID #{token.tokenId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 text-uppercase text-success mb-3">Select a mission</h2>
                <div className="d-flex flex-column gap-3">
                  {missions.map((mission) => (
                    <MissionSummary
                      key={mission.id}
                      mission={mission}
                      isActive={mission.id === selectedMission?.id}
                      onSelect={setSelectedMissionId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            {selectedMission ? (
              <div className="d-flex flex-column gap-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h2 className="h4 text-success fw-bold mb-3">{selectedMission.title}</h2>
                    <p className="text-muted">{selectedMission.summary}</p>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {selectedMission.sections?.[0]?.points?.map((point) => (
                        <span key={point} className="badge text-bg-light text-success-emphasis">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <EcoMissionGame game={selectedMission.game} />
                  </div>
                </div>

                {selectedMission.quiz && selectedMission.quiz.length > 0 && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h3 className="h5 fw-bold text-primary mb-3">Knowledge check</h3>
                      <p className="text-muted small mb-3">
                        Answer the questions to reinforce the mission vocabulary. You can retry as many times as you like.
                      </p>
                      <Link href={`/academy/${selectedMission.id}`} className="btn btn-outline-success btn-sm rounded-pill px-3">
                        Review the full course page
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                More missions are on the way. Check back soon for fresh adventures.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
