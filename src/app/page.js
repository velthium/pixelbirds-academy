'use client';

import Image from 'next/image';
import Link from 'next/link';
import HomeStats from '@/components/HomeStats';
import courses from '@/data/courses.json';

const featureTiles = [
  {
    title: 'NFT-gated mastery',
    description:
      'Hold one PixelBird NFT to access every expedition, mission log, and quiz. Ownership becomes your student ID.',
    icon: '🔐',
  },
  {
    title: 'Authentic English practice',
    description:
      'Explore environmental stories written entirely in English and designed to grow vocabulary, listening, and speaking confidence.',
    icon: '🗣️',
  },
  {
    title: 'Real climate impact',
    description:
      'Every decision inside the eco-missions mirrors real conservation trade-offs, so you learn language and systems thinking together.',
    icon: '🌍',
  },
];

const roadmap = [
  {
    title: 'NFT collection launch',
    detail: '5,202 PixelBirds minted on Stargaze and ready for explorers.',
    status: '✅ Completed',
  },
  {
    title: 'Academy foundation',
    detail: 'Wallet login, NFT verification, and immersive lesson layouts.',
    status: '✅ Completed',
  },
  {
    title: 'Mission expansion',
    detail: 'Multiple eco-games with branching choices, audio narration, and progress saves.',
    status: '⏳ In progress',
  },
  {
    title: 'Community challenges',
    detail: 'Weekly cooperative events, live classes, and impact leaderboards.',
    status: '🛠️ Planned',
  },
];

const faqs = [
  {
    question: 'Who can access the lessons?',
    answer:
      'Anyone holding at least one PixelBird NFT on Stargaze gains full access to every learning path, quiz, and game.',
  },
  {
    question: 'How do I play the eco-missions?',
    answer:
      'Connect your wallet, head to the Play hub, and choose a mission. Each round asks you to analyse scenarios and pick the best strategy.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer:
      'Yes. Courses include estimated times, downloadable vocabulary sheets, and replayable quizzes so you can review anytime.',
  },
];

export default function Home() {
  const spotlightCourses = courses.filter((course) => course.game).slice(0, 3);

  return (
    <main className="container py-5">
      <section className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success mb-3">PixelBirds Academy</h1>
        <p className="lead mx-auto" style={{ maxWidth: 900 }}>
          PixelBirds is a Stargaze-native collection of 5,202 pixelated birds unlocking a modern English learning platform. Hold a
          bird, log in with your wallet, and start mastering climate storytelling through interactive eco-games.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <Link href="/academy" className="btn btn-success btn-lg rounded-pill px-4">
            Explore the Academy
          </Link>
          <Link href="/play" className="btn btn-outline-success btn-lg rounded-pill px-4">
            Jump into a Mission
          </Link>
        </div>
        <HomeStats className="mt-5" />
        <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
          PixelBirds thrives on Stargaze, a carbon-neutral blockchain with near-zero gas fees. Your learning path is fast,
          decentralised, and accessible from anywhere.
        </p>
      </section>

      <section className="py-5">
        <h2 className="text-center fw-bold mb-4">Why learners choose PixelBirds</h2>
        <div className="row g-4">
          {featureTiles.map((tile) => (
            <div key={tile.title} className="col-12 col-md-4">
              <div className="h-100 border border-success-subtle rounded-4 p-4 shadow-sm bg-white">
                <div className="fs-1 mb-3" aria-hidden>
                  {tile.icon}
                </div>
                <h3 className="h5 fw-bold">{tile.title}</h3>
                <p className="text-muted mb-0">{tile.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5 bg-success-subtle rounded-4 px-4 px-md-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h2 className="fw-bold mb-3">Immersive missions, real vocabulary</h2>
            <p className="text-muted">
              Each course blends story-driven missions with English learning objectives. Review mission intel, make strategic
              decisions, and unlock specialist vocabulary about biodiversity, climate, and ocean science.
            </p>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">✅ Narrative briefings with key terminology and pronunciation notes</li>
              <li className="mb-2">✅ Choice-based gameplay that reacts to your strategy in real time</li>
              <li className="mb-2">✅ Knowledge checks with immediate feedback and retry options</li>
              <li>✅ Downloadable resources to keep practising offline</li>
            </ul>
          </div>
          <div className="col-12 col-lg-6">
            <div className="bg-white border border-success-subtle rounded-4 p-3 shadow-sm">
              <Image
                src="/images/mint-preview.webp"
                alt="Screenshot of the PixelBirds mission interface"
                width={540}
                height={320}
                className="img-fluid rounded-3"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <h2 className="text-center fw-bold mb-4">Featured expeditions</h2>
        <div className="row g-4">
          {spotlightCourses.map((course) => (
            <div key={course.id} className="col-12 col-lg-4">
              <div className="h-100 border rounded-4 shadow-sm p-4">
                <h3 className="h5 text-success fw-bold mb-2">{course.title}</h3>
                <p className="text-muted small mb-3">{course.summary}</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {course.focusAreas?.map((area) => (
                    <span key={area} className="badge text-bg-success-subtle text-success-emphasis">
                      {area}
                    </span>
                  ))}
                </div>
                <p className="small text-muted mb-4">Estimated time: {course.estimatedTime}</p>
                <Link href={`/academy/${course.id}`} className="btn btn-outline-success btn-sm rounded-pill px-3">
                  View the course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5 bg-light rounded-4 px-4 px-md-5">
        <h2 className="text-center fw-bold mb-4">Roadmap</h2>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <div className="border-start border-3 border-success ps-4">
            {roadmap.map((item) => (
              <div key={item.title} className="card shadow-sm mb-4 border-success-subtle">
                <div className="card-body">
                  <h3 className="h6 text-uppercase text-success mb-1">{item.title}</h3>
                  <p className="text-muted small mb-2">{item.detail}</p>
                  <span className="badge text-bg-success-subtle text-success-emphasis">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="bg-white border border-success-subtle rounded-4 p-4 shadow-sm h-100">
              <h2 className="fw-bold mb-3">Community voices</h2>
              <blockquote className="blockquote text-muted mb-4">
                “The missions are like choose-your-own-adventure stories that teach real English phrases we can reuse in class.”
              </blockquote>
              <p className="mb-1 fw-semibold">Lina, English teacher and PixelBird holder</p>
              <p className="text-muted small mb-0">
                Join the Discord community to share lesson ideas, request missions, and collaborate on live events.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="bg-success-subtle border border-success-subtle rounded-4 p-4 shadow-sm h-100">
              <h2 className="fw-bold mb-3">Frequently asked questions</h2>
              <div className="accordion" id="faq-list">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className="accordion-item border-0 mb-3">
                    <h3 className="accordion-header" id={`faq-${index}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-collapse-${index}`}
                        aria-expanded="false"
                        aria-controls={`faq-collapse-${index}`}
                      >
                        {faq.question}
                      </button>
                    </h3>
                    <div
                      id={`faq-collapse-${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`faq-${index}`}
                      data-bs-parent="#faq-list"
                    >
                      <div className="accordion-body text-muted">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <h2 className="fw-bold text-success mb-3">Ready to take flight?</h2>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: 680 }}>
          Secure your PixelBird, log in with your Stargaze wallet, and unlock an English learning journey focused on protecting the
          planet. New missions arrive regularly with fresh vocabulary and decision-making challenges.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <a
            href="https://www.stargaze.zone/m/stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg rounded-pill px-4"
          >
            Buy a PixelBird NFT
          </a>
          <Link href="/login" className="btn btn-outline-success btn-lg rounded-pill px-4">
            Connect your wallet
          </Link>
        </div>
      </section>
    </main>
  );
}
