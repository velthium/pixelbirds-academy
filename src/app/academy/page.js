"use client";

import CourseList from '@/components/courses/CourseList';

export default function AcademyPage() {
  return (
    <div className="academy-container py-5 text-center">
      <div className="container">
        <h1 className="display-5 fw-bold text-success mb-3">
          PixelBirds Academy 🌍
        </h1>
        <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px' }}>
          Welcome to the PixelBirds Academy! Learn how to protect nature, understand ecology,
          and earn NFT badges for each completed module.
        </p>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <CourseList />
          </div>
        </div>
      </div>
    </div>
  );
}
