"use client";

import React from "react";
import courses from "@/data/courses.json";
import Quiz from "@/components/courses/Quiz";
import Link from "next/link";

export default function CoursePage({ params }) {
  // ✅ unwrap params using React.use()
  const { id } = React.use(params);

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

  return (
    <div className="container py-5">
      <Link href="/academy" className="btn btn-outline-success mb-4">
        ← Back to Academy
      </Link>

      <h1 className="fw-bold text-success mb-3">{course.title}</h1>
      <p className="lead text-secondary mb-5" style={{ maxWidth: "700px" }}>
        {course.content}
      </p>

      <div className="border rounded-4 shadow-sm p-4 bg-light">
        <h3 className="fw-bold mb-3 text-primary">Quiz 🧠</h3>
        <Quiz quiz={course.quiz} />
      </div>
    </div>
  );
}
