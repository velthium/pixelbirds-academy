export default function CourseDetail({ course }) {
  return (
    <div className="mb-5">
      <div className="d-flex flex-wrap gap-3 mb-4">
        {course.badge && (
          <span className="badge text-bg-success rounded-pill px-3 py-2">🏅 {course.badge}</span>
        )}
        {course.estimatedTime && (
          <span className="badge text-bg-light border border-success-subtle rounded-pill px-3 py-2">
            ⏱️ {course.estimatedTime}
          </span>
        )}
        {course.level && (
          <span className="badge text-bg-primary rounded-pill px-3 py-2">{course.level}</span>
        )}
      </div>

      {course.summary && (
        <p className="lead text-secondary" style={{ maxWidth: '760px' }}>
          {course.summary}
        </p>
      )}

      {course.sections?.map((section) => (
        <section key={section.heading} className="mb-4">
          <h3 className="h4 text-success mb-2">{section.heading}</h3>
          {section.content?.map((paragraph, index) => (
            <p key={index} className="text-body-secondary" style={{ maxWidth: '760px' }}>
              {paragraph}
            </p>
          ))}
          {section.points && (
            <ul className="text-body-secondary" style={{ maxWidth: '720px' }}>
              {section.points.map((point) => (
                <li key={point} className="mb-1">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {course.resources?.length ? (
        <div className="card border-success-subtle">
          <div className="card-body">
            <h4 className="h5 text-success mb-3">Go further</h4>
            <ul className="list-unstyled mb-0">
              {course.resources.map((resource) => (
                <li key={resource.url} className="mb-2">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    {resource.label} ↗
                  </a>
                  {resource.description && (
                    <div className="small text-muted">{resource.description}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
