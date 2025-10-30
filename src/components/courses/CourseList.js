import Link from "next/link";
import courses from "@/data/courses.json";

export default function CourseList() {
  return (
    <div className="d-flex flex-column gap-4">
      {courses.map((course) => (
        <Link key={course.id} href={`/academy/${course.id}`} className="text-decoration-none">
          <div className="card shadow-sm border-0 hover-card">
            <div className="card-body text-start">
              <h3 className="card-title text-primary fw-bold mb-2">{course.title}</h3>
              <p className="card-text text-muted mb-0">{course.description}</p>
            </div>
          </div>
        </Link>
      ))}

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
