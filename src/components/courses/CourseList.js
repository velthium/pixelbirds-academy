import Link from 'next/link';
import courses from '@/data/courses.json';

export default function CourseList() {
  return (
    <div className="d-flex flex-column gap-4">
      {courses.map((course) => (
        <Link key={course.id} href={`/academy/${course.id}`} className="text-decoration-none">
          <div className="card shadow-sm border-0 hover-card">
            <div className="card-body text-start">
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h3 className="card-title text-primary fw-bold mb-0">{course.title}</h3>
                {course.estimatedTime && (
                  <span className="badge text-bg-light border border-success-subtle">
                    ⏱️ {course.estimatedTime}
                  </span>
                )}
              </div>
              <p className="card-text text-muted mb-3">{course.tagline}</p>
              <div className="d-flex gap-2 flex-wrap">
                {course.badge && (
                  <span className="badge text-bg-success">{course.badge}</span>
                )}
                {course.level && (
                  <span className="badge text-bg-primary">{course.level}</span>
                )}
                {course.focusAreas?.map((area) => (
                  <span key={area} className="badge text-bg-secondary">
                    {area}
                  </span>
                ))}
              </div>
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
