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

      {course.learningOutcomes?.length ? (
        <section className="mb-4">
          <h3 className="h4 text-success mb-2">Learning outcomes</h3>
          <ul className="text-body-secondary" style={{ maxWidth: '760px' }}>
            {course.learningOutcomes.map((outcome) => (
              <li key={outcome} className="mb-1">
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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

      {course.vocabulary?.length ? (
        <section className="mb-5">
          <h3 className="h4 text-success mb-3">Academic vocabulary</h3>
          <div className="row g-3">
            {course.vocabulary.map((item) => (
              <div key={item.term} className="col-12 col-md-6">
                <div className="h-100 border border-success-subtle rounded-4 p-3 bg-white shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="h5 mb-0 text-success">{item.term}</h4>
                  </div>
                  <p className="small text-muted mb-2">{item.definition}</p>
                  {item.example && (
                    <p className="small text-body-secondary mb-0">
                      <span className="fw-semibold text-success">Example:</span> {item.example}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {course.lessonPlan?.length ? (
        <section className="mb-5">
          <h3 className="h4 text-success mb-3">Lesson plan blueprint</h3>
          <div className="row g-4">
            {course.lessonPlan.map((block) => (
              <div key={block.title} className="col-12 col-lg-4">
                <div className="card h-100 border-success-subtle shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h4 className="h5 text-success mb-2">{block.title}</h4>
                    {block.duration && (
                      <p className="badge text-bg-light border border-success-subtle align-self-start mb-3">
                        ⏰ {block.duration}
                      </p>
                    )}
                    {block.objectives?.length && (
                      <div className="mb-3">
                        <h5 className="h6 text-uppercase text-muted">Objectives</h5>
                        <ul className="small text-muted ps-3 mb-0">
                          {block.objectives.map((objective) => (
                            <li key={objective} className="mb-1">
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {block.activities?.length && (
                      <div className="mt-auto">
                        <h5 className="h6 text-uppercase text-muted">Classroom flow</h5>
                        <ul className="small text-muted ps-3 mb-0">
                          {block.activities.map((activity) => (
                            <li key={activity} className="mb-1">
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {course.project && (
        <section className="mb-5">
          <div className="border border-success-subtle rounded-4 p-4 bg-white shadow-sm">
            <h3 className="h4 text-success mb-2">Capstone project: {course.project.title}</h3>
            <p className="text-body-secondary" style={{ maxWidth: '760px' }}>
              {course.project.description}
            </p>
            {course.project.steps?.length ? (
              <ol className="text-body-secondary" style={{ maxWidth: '760px' }}>
                {course.project.steps.map((step) => (
                  <li key={step} className="mb-1">
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      )}

      {course.impact?.stats?.length ? (
        <section className="mb-5">
          <h3 className="h4 text-success mb-3">Impact snapshot</h3>
          <div className="row g-3">
            {course.impact.stats.map((stat) => (
              <div key={stat.label} className="col-12 col-md-4">
                <div className="text-center border border-success-subtle rounded-4 p-4 bg-light h-100">
                  <div className="display-6 fw-bold text-success mb-2">
                    {stat.value.toLocaleString?.() ?? stat.value}
                  </div>
                  <div className="text-muted small text-uppercase">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

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
