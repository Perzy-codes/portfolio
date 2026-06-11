'use client'
import { experiences, projects, skills } from '@/lib/data'

// Theme-stripped, recruiter-friendly view. Same content, zero friction:
// white background, plain typography, metric-led bullets, resume at top.

const RESUME = 'https://drive.google.com/file/d/181aUxS9S7HsAcz2a4fgsVS-FZCl-apWu/view?usp=drive_link'
const LINKEDIN = 'https://www.linkedin.com/in/pratham-dabas-218007137/'
const EMAIL = 'dabaspratham28@gmail.com'
const GITHUB = 'https://github.com/Perzy-codes'
const CAL = 'https://cal.com/pratham-dabas-98/15min'

// Experience entries in resume order (most recent first), excluding the
// "What's next?" node which has no id we render here.
const roles = experiences.filter(e => e.id !== '?')

export default function RecruiterView() {
  return (
    <div className="min-h-screen bg-white text-neutral-800" style={{ fontFamily: 'var(--font-body, Montserrat, sans-serif)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">

        {/* Header */}
        <header className="border-b border-neutral-200 pb-8 mb-8">
          <h1 className="font-heading font-bold text-4xl text-neutral-900 mb-1">Pratham Dabas</h1>
          <p className="text-lg text-neutral-600 mb-3">Data Scientist · Machine Learning · AI</p>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Open to DS / ML / AI roles · New York City · Available July 2026
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href={RESUME} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white text-sm font-semibold px-4 py-2 hover:bg-neutral-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
              Download Resume
            </a>
            <a href={CAL} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 text-sm font-semibold px-4 py-2 text-neutral-800 hover:border-neutral-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
              Book 15 min
            </a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">LinkedIn</a>
            <a href={`mailto:${EMAIL}`} className="text-sm text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{EMAIL}</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">GitHub</a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-10">
          <p className="text-sm leading-relaxed text-neutral-700">
            Data Scientist with an MS in Data Science from the University of Maryland
            (<strong className="text-neutral-900">GPA 3.83</strong>, Class of 2026) and{' '}
            <strong className="text-neutral-900">4 years</strong> at S&amp;P Global shipping real ML systems:
            OTC derivatives post-trade analytics, RAG chatbots, and fine-tuned LLMs. I build, ship, and keep experimenting.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="font-heading font-bold text-xs uppercase tracking-[.18em] text-neutral-500 mb-5">Experience</h2>
          <div className="flex flex-col gap-6">
            {roles.map(e => (
              <div key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold text-neutral-900 text-[15px]">{e.company}</h3>
                  <span className="text-xs text-neutral-500">{e.period}</span>
                </div>
                <p className="text-sm text-neutral-600 mb-1.5">{e.role}</p>
                <p className="text-sm leading-relaxed text-neutral-700">{e.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {e.tech.map(t => (
                    <span key={t} className="text-[11px] text-neutral-600 bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h2 className="font-heading font-bold text-xs uppercase tracking-[.18em] text-neutral-500 mb-5">Selected Projects</h2>
          <div className="flex flex-col gap-5">
            {projects.map(p => (
              <div key={p.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-0.5">
                  <a href={p.github} target="_blank" rel="noreferrer"
                    className="font-semibold text-neutral-900 text-[15px] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                    {p.title} ↗
                  </a>
                  <span className="text-xs font-semibold text-neutral-900">{p.metric}</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700">{p.achievement} {p.about}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tech.map(t => (
                    <span key={t} className="text-[11px] text-neutral-600 bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="font-heading font-bold text-xs uppercase tracking-[.18em] text-neutral-500 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="text-xs text-neutral-700 bg-neutral-100 border border-neutral-200 rounded px-2.5 py-1">{s}</span>
            ))}
          </div>
        </section>

        <footer className="border-t border-neutral-200 pt-6 text-xs text-neutral-400">
          © 2026 Pratham Dabas · Switch to Adventure mode for the full experience.
        </footer>
      </div>
    </div>
  )
}
