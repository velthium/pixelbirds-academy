"use client";

import Link from 'next/link';
import courses from '@/data/courses.json';
import Quiz from '@/components/courses/Quiz';
import CourseDetail from '@/components/courses/CourseDetail';
import EcoMissionGame from '@/components/courses/EcoMissionGame';
import usePixelBirdAccess, { ACCESS_STATUS } from '@/hooks/usePixelBirdAccess';

export default function CoursePage({ params }) {
  const { address, isHolder, isLoading, status } = usePixelBirdAccess();
  const { id } = params;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="container text-center py-5">
        <h1 className="text-danger fw-bold mb-3">Course Not Found 😢</h1>
        <Link href="/academy" className="btn btn-outline-success">
          ← Back to Academy
        </Link>
      </div>
    );
  }

  const renderAccessState = () => {
    if (!address) {
      return (
        <div className="text-center py-5">
          <p className="lead text-secondary mb-4">Connect your wallet to keep exploring this mission.</p>
          <Link href={{ pathname: '/login', query: { next: `/academy/${id}` } }} className="btn btn-success btn-lg rounded-pill px-4">
            🔐 Login with wallet
          </Link>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" aria-label="Loading access" />
          <p className="text-muted mt-3">Verifying your PixelBirds…</p>
        </div>
      );
    }

    if (status === ACCESS_STATUS.ERROR) {
      return (
        <div className="alert alert-danger" role="alert">
          We could not verify your NFT ownership. Please refresh the page or try again later.
        </div>
      );
    }

    if (!isHolder) {
      return (
        <div className="text-center py-5">
          <h2 className="h4 text-danger mb-3">PixelBird access required</h2>
          <p className="text-muted mb-4" style={{ maxWidth: '620px', margin: '0 auto' }}>
            This interactive course is reserved for PixelBird holders. Add a bird to your collection to unlock the game and quiz.
          </p>
          <a
            href="https://www.stargaze.zone/m/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success"
          >
            Explore the marketplace
          </a>
        </div>
      );
    }

    return null;
  };

  const gatingState = renderAccessState();

  return (
    <div className="container py-5">
      <Link href="/academy" className="btn btn-outline-success mb-4">
        ← Back to Academy
      </Link>

      <h1 className="fw-bold text-success mb-3">{course.title}</h1>

      {gatingState ? (
        gatingState
      ) : (
        <>
          <CourseDetail course={course} />

          {course.game && (
            <div className="mb-5">
              <EcoMissionGame game={course.game} />
            </div>
          )}

          {course.quiz && course.quiz.length > 0 && (
            <div className="border rounded-4 shadow-sm p-4 bg-light">
              <h3 className="fw-bold mb-3 text-primary">Quiz 🧠</h3>
              <Quiz quiz={course.quiz} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
