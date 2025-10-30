"use client";

import { useMemo, useState } from 'react';

export default function Quiz({ quiz }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quiz[step];
  const progress = useMemo(() => Math.round(((step + (finished ? 1 : 0)) / quiz.length) * 100), [step, finished, quiz.length]);

  const handleChoice = (choice) => {
    if (selected || finished) return;
    const isCorrect = choice === currentQuestion.answer;
    setSelected({ choice, isCorrect });
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (!selected) return;

    if (step + 1 >= quiz.length) {
      setFinished(true);
    } else {
      setStep((prev) => prev + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setStep(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  return (
    <div className="p-4 border rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="h5 mb-0">Knowledge check</h4>
        <div className="small text-muted">Score: {score}/{quiz.length}</div>
      </div>

      <div className="progress mb-4" style={{ height: '8px' }}>
        <div className="progress-bar bg-success" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" />
      </div>

      {!finished && currentQuestion ? (
        <div>
          <h5 className="fw-semibold mb-3">{currentQuestion.question}</h5>
          <div className="d-flex flex-column gap-2">
            {currentQuestion.choices.map((choice) => {
              const isActive = selected?.choice === choice;
              const isCorrect = choice === currentQuestion.answer;
              const variant = selected
                ? isCorrect
                  ? 'btn-success'
                  : isActive
                  ? 'btn-danger'
                  : 'btn-outline-secondary'
                : 'btn-outline-success';

              return (
                <button
                  key={choice}
                  className={`btn ${variant} text-start`}
                  onClick={() => handleChoice(choice)}
                  disabled={!!selected}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`alert mt-3 ${selected.isCorrect ? 'alert-success' : 'alert-warning'}`} role="alert">
              {selected.isCorrect ? 'Correct! ' : 'Not quite. '}
              {currentQuestion.explanation}
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary" onClick={handleNext} disabled={!selected}>
              {step + 1 === quiz.length ? 'See result' : 'Next question →'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h5 className="text-success">Final score: {score}/{quiz.length}</h5>
          <p className="text-body-secondary">
            {score === quiz.length
              ? 'Amazing! You mastered this mission vocabulary.'
              : 'Review the mission log and try again to boost your mastery.'}
          </p>
          <button className="btn btn-success" onClick={restart} type="button">
            Retry quiz
          </button>
        </div>
      )}
    </div>
  );
}
