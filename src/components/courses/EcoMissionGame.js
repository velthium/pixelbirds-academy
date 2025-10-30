"use client";

import { useMemo, useState } from 'react';

function formatDelta(value) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return '±0';
}

export default function EcoMissionGame({ game }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [metrics, setMetrics] = useState(() =>
    game.metrics.reduce((acc, metric) => {
      acc[metric.id] = metric.start ?? 0;
      return acc;
    }, {})
  );
  const [log, setLog] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState(false);

  const totalScore = useMemo(
    () => Object.values(metrics).reduce((sum, value) => sum + value, 0),
    [metrics]
  );

  const currentRound = game.rounds[roundIndex];

  const handleChoice = (option) => {
    if (selectedOption || completed) return;

    const nextMetrics = { ...metrics };
    Object.entries(option.effects || {}).forEach(([metricId, delta]) => {
      nextMetrics[metricId] = (nextMetrics[metricId] ?? 0) + delta;
    });

    setMetrics(nextMetrics);
    setSelectedOption(option.id);
    setLog((prev) => [
      ...prev,
      {
        roundId: currentRound.id,
        title: currentRound.title,
        optionId: option.id,
        label: option.label,
        feedback: option.feedback,
        effects: option.effects,
      },
    ]);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const nextIndex = roundIndex + 1;
    if (nextIndex >= game.rounds.length) {
      setCompleted(true);
    } else {
      setRoundIndex(nextIndex);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setRoundIndex(0);
    setSelectedOption(null);
    setCompleted(false);
    setMetrics(
      game.metrics.reduce((acc, metric) => {
        acc[metric.id] = metric.start ?? 0;
        return acc;
      }, {})
    );
    setLog([]);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-3 align-items-center mb-4">
          <div>
            <h3 className="h4 text-primary mb-1">{game.title}</h3>
            <p className="text-body-secondary mb-0" style={{ maxWidth: '720px' }}>
              {game.intro}
            </p>
          </div>
          <button className="btn btn-outline-success btn-sm" onClick={handleRestart} type="button">
            🔄 Restart mission
          </button>
        </div>

        <div className="row g-3 mb-4">
          {game.metrics.map((metric) => (
            <div key={metric.id} className="col-12 col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-success-subtle">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold">{metric.icon} {metric.label}</span>
                  <span className="badge text-bg-dark">{metrics[metric.id]}</span>
                </div>
                <small className="text-muted">{metric.description}</small>
              </div>
            </div>
          ))}
        </div>

        {!completed && currentRound ? (
          <div className="mb-4">
            <span className="badge text-bg-secondary mb-2">
              Scenario {roundIndex + 1}/{game.rounds.length}
            </span>
            <h4 className="h5 mb-2">{currentRound.title}</h4>
            <p className="text-body-secondary" style={{ maxWidth: '720px' }}>
              {currentRound.scenario}
            </p>

            <div className="d-flex flex-column gap-3 mt-3">
              {currentRound.options.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    className={`text-start border rounded-3 p-3 btn ${
                      isSelected ? 'btn-success' : 'btn-outline-success'
                    }`}
                    onClick={() => handleChoice(option)}
                    disabled={!!selectedOption}
                  >
                    <div className="fw-semibold">{option.label}</div>
                    <div className="small">
                      {Object.entries(option.effects || {})
                        .map(([metricId, delta]) => {
                          const metric = game.metrics.find((m) => m.id === metricId);
                          return `${metric?.icon || ''} ${metric?.label || metricId}: ${formatDelta(delta)}`;
                        })
                        .join(' • ')}
                    </div>
                    <p className="mb-0 mt-2 small text-body-secondary">{option.description}</p>
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className="alert alert-info mt-4" role="status">
                {currentRound.options.find((opt) => opt.id === selectedOption)?.feedback}
              </div>
            )}

            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {roundIndex + 1 === game.rounds.length ? 'View results' : 'Next scenario →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <h4 className="h5 text-success mb-2">Mission complete!</h4>
            <p className="text-body-secondary mb-4">
              You finished the expedition with a total impact score of <strong>{totalScore}</strong>.
              {totalScore >= game.successThreshold
                ? ' Excellent work — the rainforest thrives thanks to your strategy!'
                : ' There is room to improve. Try again to boost your impact.'}
            </p>
            <button className="btn btn-success" onClick={handleRestart} type="button">
              Try again
            </button>
          </div>
        )}

        {log.length > 0 && (
          <div className="mt-4">
            <h4 className="h6 text-uppercase text-muted">Mission log</h4>
            <ul className="list-group">
              {log.map((entry) => (
                <li key={entry.roundId} className="list-group-item">
                  <div className="fw-semibold">{entry.title}</div>
                  <div className="small text-muted">Decision: {entry.label}</div>
                  <div className="small text-body-secondary">{entry.feedback}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
