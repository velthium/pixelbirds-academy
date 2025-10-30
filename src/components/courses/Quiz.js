"use client";

import { useState } from "react";

export default function Quiz({ quiz }) {
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleAnswer = (choice, correct) => {
    if (choice === correct) setScore(score + 1);
    setDone(true);
  };

  return (
    <div className="p-4 border rounded-xl">
      {quiz.map((q, i) => (
        <div key={i}>
          <h3 className="font-semibold mb-2">{q.question}</h3>
          {q.choices.map(c => (
            <button
              key={c}
              onClick={() => handleAnswer(c, q.answer)}
              className="block w-full p-2 border rounded mb-1 hover:bg-green-100"
              disabled={done}
            >
              {c}
            </button>
          ))}
        </div>
      ))}
      {done && <p className="mt-4 font-bold">Résultat : {score}/{quiz.length}</p>}
    </div>
  );
}
